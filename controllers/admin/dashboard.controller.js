const ProductType = require("../../models/products-type.model");
const Account = require("../../models/account.model");
const Product = require("../../models/product.model");
const User = require("../../models/user.model");

// [GET]/admin/dashboard
module.exports.dashboard = async (req, res) => {
    const statistic = {
        typeProduct: {
            total: 0,
            active: 0,
            inactive: 0,
        },
        product: {
            total: 0,
            active: 0,
            inactive: 0,
        },
        admin: {
            total: 0,
            active: 0,
            inactive: 0,
        },
        client: {
            total: 0,
            active: 0,
            inactive: 0,
        },
    };
    // ProductType
    statistic.typeProduct.total = await ProductType.countDocuments({
        deleted: false
    });
    statistic.typeProduct.active = await ProductType.countDocuments({
        deleted: false,
        status:"active"
    });
    statistic.typeProduct.inactive = await ProductType.countDocuments({
        status:"inactive",
        deleted: false
    });
    // Product
    statistic.product.total = await Product.countDocuments({
        deleted: false
    });
    statistic.product.active = await Product.countDocuments({
        deleted: false,
        status:"active"
    });
    statistic.product.inactive = await Product.countDocuments({
        status:"inactive",
        deleted: false
    });
    // Account
    statistic.admin.total = await Account.countDocuments({
        deleted: false
    });
    statistic.admin.active = await Account.countDocuments({
        deleted: false,
        status:"active"
    });
    statistic.admin.inactive = await Account.countDocuments({
        status:"inactive",
        deleted: false
    });
    // User
    statistic.client.total = await User.countDocuments({
        deleted: false
    });
    statistic.client.active = await User.countDocuments({
        deleted: false,
        status:"active"
    });
    statistic.client.inactive = await User.countDocuments({
        status:"inactive",
        deleted: false
    });

    res.render("admin/pages/dashboard/index", {
        pageTitle: "Trang tổng quan",
        statistic: statistic
    });
};