const RentalSpace = require('../models/RentalSpace');
const Contract = require('../models/Contract');

class MallMapService {
  async getSpacesByFloor(floor) {
    const query = floor ? { floor: parseInt(floor) } : {};
    
    const spaces = await RentalSpace.find(query).sort({ name: 1 });
    
    const spacesWithContracts = await Promise.all(
      spaces.map(async (space) => {
        const activeContract = await Contract.findOne({
          rentalSpace: space._id,
          status: 'active'
        }).populate('seller', 'username boutiqueName');

        let currentStatus = space.status;
        if (activeContract) {
          currentStatus = 'occupied';
        }

        return {
          id: space._id,
          name: space.name,
          type: space.type,
          status: currentStatus,
          floor: space.floor,
          location: space.location,
          surface: space.surface,
          monthlyPrice: space.monthlyPrice,
          x: space.mapPosition?.x || 0,
          y: space.mapPosition?.y || 0,
          width: space.width || 60,
          height: space.height || 40,
          currentContract: activeContract ? {
            seller: activeContract.seller,
            startDate: activeContract.startDate,
            endDate: activeContract.endDate,
            monthlyRent: activeContract.monthlyRent
          } : null
        };
      })
    );

    return spacesWithContracts;
  }

  async getMapData(floor) {
    return await this.getSpacesByFloor(floor);
  }

  async getSpaceDetails(spaceId) {
    const space = await RentalSpace.findById(spaceId);
    
    if (!space) {
      const error = new Error('Space not found');
      error.statusCode = 404;
      throw error;
    }

    const activeContract = await Contract.findOne({
      rentalSpace: spaceId,
      status: 'active'
    }).populate('seller', 'username boutiqueName phone');

    const allContracts = await Contract.find({ rentalSpace: spaceId })
      .populate('seller', 'username boutiqueName')
      .sort({ createdAt: -1 });

    return {
      id: space._id,
      name: space.name,
      type: space.type,
      floor: space.floor,
      location: space.location,
      surface: space.surface,
      monthlyPrice: space.monthlyPrice,
      status: activeContract ? 'occupied' : space.status,
      mapPosition: space.mapPosition,
      width: space.width,
      height: space.height,
      currentContract: activeContract ? {
        seller: activeContract.seller,
        startDate: activeContract.startDate,
        endDate: activeContract.endDate,
        monthlyRent: activeContract.monthlyRent,
        status: activeContract.status
      } : null,
      contractHistory: allContracts
    };
  }

  async updateMapPosition(spaceId, coordinates) {
    const space = await RentalSpace.findById(spaceId);
    
    if (!space) {
      const error = new Error('Space not found');
      error.statusCode = 404;
      throw error;
    }

    if (coordinates.x !== undefined) space.mapPosition.x = coordinates.x;
    if (coordinates.y !== undefined) space.mapPosition.y = coordinates.y;
    if (coordinates.width !== undefined) space.width = coordinates.width;
    if (coordinates.height !== undefined) space.height = coordinates.height;

    await space.save();

    return {
      message: 'Map position updated successfully',
      space: {
        id: space._id,
        name: space.name,
        mapPosition: space.mapPosition,
        width: space.width,
        height: space.height
      }
    };
  }

  async getFloors() {
    const floors = await RentalSpace.distinct('floor');
    return floors.sort((a, b) => a - b);
  }
}

module.exports = new MallMapService();
