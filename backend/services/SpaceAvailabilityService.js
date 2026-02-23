const RentalSpace = require('../models/RentalSpace');
const Contract = require('../models/Contract');

class SpaceAvailabilityService {
  async getAvailabilitySummary() {
    const [total, available, occupied, maintenance] = await Promise.all([
      RentalSpace.countDocuments(),
      RentalSpace.countDocuments({ status: 'available' }),
      RentalSpace.countDocuments({ status: 'occupied' }),
      RentalSpace.countDocuments({ status: 'maintenance' })
    ]);

    return { totalSpaces: total, available, occupied, maintenance };
  }

  async setMaintenance(spaceId) {
    const space = await RentalSpace.findById(spaceId);
    if (!space) {
      const error = new Error('Space not found');
      error.statusCode = 404;
      throw error;
    }

    if (space.status === 'occupied') {
      const error = new Error('Cannot set maintenance on occupied space');
      error.statusCode = 400;
      throw error;
    }

    space.status = 'maintenance';
    await space.save();

    return { message: 'Space set to maintenance', space };
  }

  async removeMaintenance(spaceId) {
    const space = await RentalSpace.findById(spaceId);
    if (!space) {
      const error = new Error('Space not found');
      error.statusCode = 404;
      throw error;
    }

    const activeContract = await Contract.findOne({
      rentalSpace: spaceId,
      status: 'active',
      endDate: { $gte: new Date() }
    });

    space.status = activeContract ? 'occupied' : 'available';
    await space.save();

    return { message: 'Maintenance removed', space };
  }

  async syncSpaceStatus() {
    const spaces = await RentalSpace.find({});
    const now = new Date();

    for (const space of spaces) {
      const activeContract = await Contract.findOne({
        rentalSpace: space._id,
        status: 'active',
        endDate: { $gte: now }
      });

      if (space.status !== 'maintenance') {
        if (activeContract) {
          if (space.status !== 'occupied') {
            space.status = 'occupied';
            await space.save();
          }
        } else {
          if (space.status !== 'available') {
            space.status = 'available';
            await space.save();
          }
        }
      }
    }

    return { message: 'Space status synchronized' };
  }

  async getAvailableSpaces() {
    return RentalSpace.find({ status: 'available' }).sort({ floor: 1, name: 1 });
  }

  async getOccupiedSpaces() {
    return RentalSpace.find({ status: 'occupied' }).sort({ floor: 1, name: 1 });
  }

  async getSpacesByStatus() {
    const summary = await this.getAvailabilitySummary();
    const [availableSpaces, occupiedSpaces, maintenanceSpaces] = await Promise.all([
      this.getAvailableSpaces(),
      this.getOccupiedSpaces(),
      RentalSpace.find({ status: 'maintenance' }).sort({ floor: 1, name: 1 })
    ]);

    return {
      summary,
      availableSpaces,
      occupiedSpaces,
      maintenanceSpaces
    };
  }
}

module.exports = new SpaceAvailabilityService();
