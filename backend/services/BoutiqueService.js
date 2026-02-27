const Boutique = require('../models/Boutique');
const Contract = require('../models/Contract');
const RentalSpace = require('../models/RentalSpace');

class BoutiqueService {
  async createOrUpdateBoutique(sellerId, data) {
    const boutique = await Boutique.findOneAndUpdate(
      { seller: sellerId },
      { ...data, seller: sellerId },
      { new: true, upsert: true }
    );
    return boutique;
  }

  async getBoutiqueBySeller(sellerId) {
    const boutique = await Boutique.findOne({ seller: sellerId });
    
    // Get active contract for location info
    const contract = await Contract.findOne({
      seller: sellerId,
      status: 'active'
    }).populate('rentalSpace');

    let locationInfo = null;
    if (contract && contract.rentalSpace) {
      locationInfo = {
        floor: contract.rentalSpace.floor,
        zone: contract.rentalSpace.zone,
        spaceNumber: contract.rentalSpace.name,
        contractInfo: {
          startDate: contract.startDate,
          endDate: contract.endDate,
          monthlyRent: contract.monthlyRent
        }
      };
    }

    return {
      boutique,
      location: locationInfo
    };
  }

  async getAllBoutiques() {
    return await Boutique.find().populate('seller', 'username boutiqueName');
  }
}

module.exports = new BoutiqueService();
