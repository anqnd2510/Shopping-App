const Product = require("../../models/product.model");
const ProductType = require("../../models/products-type.model");
const productsHelper = require("../../helpers/product");


// [GET]/product
module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "active",
        deleted: false
    }).sort({position: "desc" });

    const newProducts = productsHelper.priceNewProducts(products);

    res.render("client/pages/product/index", {
        pageTitle: "Trang phục",
        products: newProducts
    });
};

// [GET]/product/:slugProduct
module.exports.detail = async (req, res) => {
    try{
        const find = {
            deleted: false,
            slug: req.params.slugProduct,
            status: "active"
        };
        
        const product = await Product.findOne(find);

        if(product.product_type_id) {
            const type = await ProductType.findOne({
                _id: product.product_type_id,
                status: "active",
                deleted: false,
            });

            product.type = type;
        }

        product.priceNew = productsHelper.priceNewProduct(product);
        
        res.render("client/pages/product/detail", {
            pageTitle:"Chi tiết sản phẩm",
            product: product
        });
    } catch (error) {
        res.redirect("/");
    }
};

// [GET]/product/:slugType
module.exports.type = async (req, res) => {
    try {
        const slugType = req.params.slugType;
        const type = await ProductType.findOne({
            slug: slugType,
            deleted: false,
            status: "active"
        });
        
        const getSubType = async (parentId) => {
            const subs = await ProductType.find({
                parent_id: parentId,
                status: "active",
                deleted: false,
            });
            

            let allSub = [...subs];

            for (const sub of subs) {
                const childs = await getSubType(sub.id);
                allSub = allSub.concat(childs);
            }

            return allSub;
        }

        
        const listSubType = await getSubType(type.id);

        const listSubTypeId = listSubType.map(item => item.id);


        const products = await Product.find({
            product_type_id: { $in: [type.id, ...listSubTypeId] },
            status: "active",
            deleted: false
        }).sort({ position: "desc" });

        const newProducts = productsHelper.priceNewProducts(products);
        

        res.render("client/pages/product/index", {
            pageTitle: "Trang phục",
            products: newProducts,
        });
    } catch (error) {
        res.redirect("/");
    }
};

