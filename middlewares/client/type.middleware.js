const ProductType = require("../../models/products-type.model");
const createTreeHelper = require("../../helpers/createTree"); 

module.exports.type = async (req, res, next) => {
    const productsType = await ProductType.find({
        deleted: false,
    });
    
    const newProductsType = createTreeHelper.tree(productsType);

    res.locals.layoutProductsType = newProductsType;

    next();
}