const RentalSpace = require('../models/RentalSpace');
const Contract = require('../models/Contract');

class RentalSpaceService {
  async createSpace(data) {
    const { name, type, location, floor, surface, monthlyPrice } = data;

    const existingSpace = await RentalSpace.findOne({ name });
    if (existingSpace) {
      const error = new Error('Rental space with this name already exists');
      error.statusCode = 400;
      throw error;
    }

    const space = new RentalSpace({
      name,
      type,
      location,
      floor: floor || 1,
      surface,
      monthlyPrice
    });

    await space.save();

    return {
      message: 'Rental space created successfully',
      space: {
        id: space._id,
        name: space.name,
        type: space.type,
        location: space.location,
        floor: space.floor,
        surface: space.surface,
        monthlyPrice: space.monthlyPrice,
        status: space.status
      }
    };
  }

  async getAllSpaces(filters = {}) {
    const query = {};

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.type) {
      query.type = filters.type;
    }

    if (filters.floor !== undefined) {
      query.floor = filters.floor;
    }

    const spaces = await RentalSpace.find(query).sort({ createdAt: -1 });
    return spaces;
  }

  async getAvailableSpaces() {
    const spaces = await RentalSpace.find({ status: 'available' }).sort({ createdAt: -1 });
    return spaces;
  }

  async getSpaceById(spaceId) {
    const space = await RentalSpace.findById(spaceId);
    if (!space) {
      const error = new Error('Rental space not found');
      error.statusCode = 404;
      throw error;
    }
    return space;
  }

  async updateSpace(spaceId, data) {
    const space = await RentalSpace.findById(spaceId);
    if (!space) {
      const error = new Error('Rental space not found');
      error.statusCode = 404;
      throw error;
    }

    const { name, type, location, floor, surface, monthlyPrice, status } = data;

    if (name !== undefined) space.name = name;
    if (type !== undefined) space.type = type;
    if (location !== undefined) space.location = location;
    if (floor !== undefined) space.floor = floor;
    if (surface !== undefined) space.surface = surface;
    if (monthlyPrice !== undefined) space.monthlyPrice = monthlyPrice;
    if (status !== undefined) {
      if (!['available', 'occupied', 'maintenance'].includes(status)) {
        const error = new Error('Invalid status');
        error.statusCode = 400;
        throw error;
      }
      space.status = status;
    }

    await space.save();

    return {
      message: 'Rental space updated successfully',
      space: {
        id: space._id,
        name: space.name,
        type: space.type,
        location: space.location,
        floor: space.floor,
        surface: space.surface,
        monthlyPrice: space.monthlyPrice,
        status: space.status
      }
    };
  }

  async changeStatus(spaceId, newStatus) {
    const space = await RentalSpace.findById(spaceId);
    if (!space) {
      const error = new Error('Rental space not found');
      error.statusCode = 404;
      throw error;
    }

    if (!['available', 'occupied', 'maintenance'].includes(newStatus)) {
      const error = new Error('Invalid status');
      error.statusCode = 400;
      throw error;
    }

    space.status = newStatus;
    await space.save();

    return {
      message: 'Status updated successfully',
      space: {
        id: space._id,
        name: space.name,
        status: space.status
      }
    };
  }
}

module.exports = new RentalSpaceService();
