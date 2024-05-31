const Product = require("../../models/product.model");

const productsHelper = require("../../helpers/product");
// [GET]/
module.exports.home = async (req, res) => {

    const productsFeatured = await Product.find({
        featured: "1",
        deleted: false,
        status: "active"
    }).limit(6);
    
    const newProducts = productsHelper.priceNewProducts(productsFeatured);
    
    const productsLatest = await Product.find({
        deleted: false,
        status: "active"
    }).sort({ position: "desc" }).limit(6);

    const latestProducts = productsHelper.priceNewProducts(productsLatest);

    res.render("client/pages/home/index", {
            pageTitle: "Trang chủ",
            productsFeatured: newProducts,
            productsLatest: latestProducts
        });
    };