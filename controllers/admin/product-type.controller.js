const ProductType = require("../../models/products-type.model");
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helpers/createTree"); 

// [GET]/admin/product-type/
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    };


    const records = await ProductType.find(find);

    const newRecords = createTreeHelper.tree(records);

    res.render("admin/pages/products-type/index", {
        pageTitle: "Trang danh muc san pham",
        records: newRecords
    });
};

// [GET]/admin/product-type/
module.exports.create = async (req, res) => {
    let find = {
        deleted: false
    };

    const records = await ProductType.find(find);

    const newRecords = createTreeHelper.tree(records);
    
    res.render("admin/pages/products-type/create", {
        pageTitle: "Tạo danh mục sản phẩm",
        records: newRecords 
    });
};

// [POST]/admin/product-type/create
module.exports.createPost = async (req, res) => {
    const permissions = res.locals.role.permissions;

    // if(permissions.includes("prodcuts-type_create")) {
    //     console.log("Có quyền")
    // } else {
    //     console.log("0 Có quyền")
    //     return;
    // }
    if (req.body.position == ""){
        const count = await ProductType.countDocuments();
        req.body.position = count + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }
    const record = new ProductType(req.body);
    await record.save();

    res.redirect(`${systemConfig.prefixAdmin}/products-type`)
};

// [GET]/admin/product-type/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;

        const record = await ProductType.findOne({
            _id: id,
            deleted: false
        });

        const records = await ProductType.find({
            deleted: false
        });
        const newRecords = createTreeHelper.tree(records);

        res.render("admin/pages/products-type/edit", {
            pageTitle: "Chỉnh sửa danh mục sản phẩm",
            record: record,
            records: newRecords
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products-type`)
    }
};

// [PATCH] /admin/products-type/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;
    req.body.position = parseInt(req.body.position);

    await ProductType.updateOne({
        _id:id
    }, req.body);

    res.redirect("back")
    // res.redirect(`${systemConfig.prefixAdmin}/products-type`)
    // dang deo biet nen redirect ve trang chinh hay la trang edit nua
};

// [GET]/admin/products-type/detail/:id
module.exports.detail = async (req, res) => {
    try {

        const find = await ProductType.findOne({
            _id: req.params.id,
            deleted: false,
        });

        const productsType = await ProductType.findOne(find);
        res.render("admin/pages/products-type/detail", {
            pageTitle: productsType.title,
            productsType: productsType,
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products-type`)
    }
};

// [DELETE]/admin/products-type/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    
        await ProductType.updateOne(
            { _id : id}, 
            {
                deleted: true,
                deletedAt : new Date()
            });
        
    req.flash("success", "Deleted product category completely !!!");
    res.redirect("back");
};

// [PATCH]/admin/products-type/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;

    await ProductType.updateOne(
        { _id : id},
        { status : status }
    );

    req.flash("success", "Updated Status Completely!");

    res.redirect("back");
}