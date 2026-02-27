const boutiqueService = require('../services/BoutiqueService');

exports.getBoutique = async (req, res, next) => {
  try {
    const result = await boutiqueService.getBoutiqueBySeller(req.user.userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.createOrUpdateBoutique = async (req, res, next) => {
  try {
    const boutique = await boutiqueService.createOrUpdateBoutique(
      req.user.userId,
      req.body
    );
    res.json({
      message: 'Boutique saved successfully',
      boutique
    });
  } catch (error) {
    next(error);
  }
};
