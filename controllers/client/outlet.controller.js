const Product = require("../../models/product.model");
const systemConfig = require("../../config/system");

// [GET]/outlet
module.exports.index = async (req, res) => {
    const allProducts = await Product.find({
        status: "active",
        deleted: false
    }).sort({position: "desc" });

    const discountedProducts = allProducts.filter(item => item.discountPercentage > 0);

    const newProducts = discountedProducts.map(item => {
        item.priceNew = (item.price * (100 - item.discountPercentage) / 100).toFixed(0);
        return item;
    });

    res.render("client/pages/outlet/index", {
        pageTitle: "Trang phục giảm giá",
        products: newProducts
    });
};

// [GET]/outlet/:slug
module.exports.detail = async (req, res) => {
    try{
        const find = {
            deleted: false,
            slug: req.params.slug,
            status: "active"
        };
        
        const product = await Product.findOne(find);
        
        res.render("client/pages/outlet/detail", {
            pageTitle: product.title,
            product: product
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/outlet`)
    }
};
