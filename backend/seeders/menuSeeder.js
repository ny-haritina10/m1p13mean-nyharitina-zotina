const MenuItem = require('../models/MenuItem');

const seedMenus = async () => {
  try {
    const adminMenus = [
      { label: "Dashboard", icon: "dashboard", route: "/admin/dashboard", roles: ["admin"], order: 1 },
      { label: "Gestion Locataires", icon: "people", route: "/admin/sellers", roles: ["admin"], order: 2 },
      { label: "Contrats", icon: "description", route: "/admin/contracts", roles: ["admin"], order: 3 },
      { label: "Loyers", icon: "payments", route: "/admin/rents", roles: ["admin"], order: 4 },
      { label: "Rapports Financiers", icon: "assessment", route: "/admin/reports", roles: ["admin"], order: 5 },
      { label: "Plan du Centre", icon: "map", route: "/admin/map", roles: ["admin"], order: 6 }
    ];

    const sellerMenus = [
      { label: "Ma Boutique", icon: "storefront", route: "/seller/boutique", roles: ["boutique"], order: 1 },
      { label: "Mes Produits", icon: "inventory", route: "/seller/products", roles: ["boutique"], order: 2 }
    ];

    const allMenus = [...adminMenus, ...sellerMenus];

    for (const menuData of allMenus) {
      const existing = await MenuItem.findOne({ route: menuData.route, roles: menuData.roles });
      if (!existing) {
        await MenuItem.create(menuData);
        console.log(`Menu created: ${menuData.label}`);
      }
    }

    console.log('Menu seeding completed');
  } catch (error) {
    console.error('Error seeding menus:', error.message);
  }
};

module.exports = seedMenus;
