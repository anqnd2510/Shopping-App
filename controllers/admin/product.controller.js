const Product = require("../../models/product.model");
const ProductType = require("../../models/products-type.model");
const Account = require("../../models/account.model");

const systemConfig = require("../../config/system");

const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const createTreeHelper = require("../../helpers/createTree");

// [GET]/admin/product
module.exports.index = async (req, res) => {
    // filter status
    const filterStatus = filterStatusHelper(req.query);
    
    let find = {
        deleted: false,
    };

    if(req.query.status){
        find.status = req.query.status;
    }
    // end filter status

    //search
    const objectSearch = searchHelper(req.query);

    if(objectSearch.regex){
        find.title = objectSearch.regex;
    }
    //end search

    // Pagination
    let initPagination = {
            currentPage: 1,
            limitItems: 4,
        };
    const countProducts = await Product.countDocuments(find);
    const objectPagination = paginationHelper(
            initPagination,
            req.query,
            countProducts
        );
    // End Pagination

    // Sort
    let sort = {};

    if(req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    } else {
        sort.position = "desc";
    } 
    // End Sort
    const products = await Product.find(find)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);

    for(const product of products) {
        // get information of user who created
        // f5 lai web la created At se sua lai theo luon
        const user = await Account.findOne({
            _id: product.createdBy.account_id
        });

        if(user) {
            product.accountFullName = user.fullName;
        }
        // get information of user who updated lastest
        const updatedBy = product.updatedBy.slice(-1)[0];
        if(updatedBy){
            const userUpdated = Account.findOne({
                _id: updatedBy.account_id
            });
    
            updatedBy.accountFullName = userUpdated.fullName;
            //chua lay ra duoc nguoi created
        }
    }

    res.render("admin/pages/product/index", {
        pageTitle: "Trang phục",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
};

// [PATCH]/admin/product/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;

    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }
    
    await Product.updateOne(
        { _id: id }, 
        { status: status,
        $push: {updatedBy: updatedBy }
    });

    req.flash("success", "Updated Completely!");

    res.redirect("back");
};

// [PATCH]/admin/product/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");

    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }
    
    switch (type) {
        case "active":
            await Product.updateMany({ _id: { $in: ids }}, 
                { 
                    status: "active",
                    $push: {updatedBy: updatedBy }
            });
            req.flash("success", `Updated new status of ${ids.length} products completely !!!`);
            break;
        case "inactive":
            await Product.updateMany({ _id: { $in: ids } },
                { 
                    status: "inactive",
                    $push: {updatedBy: updatedBy }
            });
            req.flash("success", `Updated new status of ${ids.length} products completely !!!`);
            break;
        case "delete-all":
            await Product.updateMany({ _id: { $in: ids } },
                {
                    deleted: true,
                    deletedBy : {
                        account_id: res.locals.user.id,
                        deletedAt: new Date(),
                    }
                });
                req.flash("success", `Deleted ${ids.length} products completely !!!`);
                break;
        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split("-");
                position = parseInt(position);
                await Product.updateOne({ _id: id }, { 
                    position: position,
                    $push: {updatedBy: updatedBy }
                });
            }
            break;    
        default:
            break;
        }
    
        res.redirect("back");
};

// [DELETE]/admin/product/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    
        await Product.updateOne(
            { _id : id}, 
            {
                deleted: true,
                deletedBy : {
                    account_id: res.locals.user.id,
                    deletedAt: new Date(),
                }
            });
        
    req.flash("success", "Deleted products completely !!!");
    res.redirect("back");
    //them tinh' nang restore tra ve deleted: true
};

// [GET]/admin/product/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false
    };

    const type = await ProductType.find(find);

    const newType = createTreeHelper.tree(type);

    res.render("admin/pages/product/create", {
        pageTitle: "Thêm mới trang phục",
        type: newType
    });
};

// [POST]/admin/product/create
module.exports.createPost = async (req, res) => {
    req.body.price = parseInt(req.body.price);
    // req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    
    if(req.body.position === ""){
        const countProducts = await Product.countDocuments();
        req.body.position = countProducts + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    req.body.createdBy = {
        account_id: res.locals.user.id
    };
    

    const product = new Product(req.body);
    await product.save();
    
    res.redirect(`${systemConfig.prefixAdmin}/product`);
};

// [GET]/admin/product/edit/:id
module.exports.edit = async (req, res) => {
    try{
        const find = {
            deleted: false,
            _id: req.params.id
        };
        const product = await Product.findOne(find);

        const type = await ProductType.find({
            deleted: false
        });

        const newType = createTreeHelper.tree(type);
        
        res.render("admin/pages/product/edit", {
            pageTitle: "Chỉnh sửa trang phục",
            product: product,
            type: newType
        });
    } catch (error) {
        // can res.flash nua
        res.redirect(`${systemConfig.prefixAdmin}/product`)
    }
};

// [PATCH]/admin/product/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);

    if(req.file) {
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }

    try{
        const updatedBy = {
            account_id: res.locals.user.id,
            updatedAt: new Date()
        }

        await Product.updateOne({
            _id: id
        }, {
            ...req.body, //... truoc req.body để gom các tham số hoặc phần tử của một mảng hoặc đối tượng lại thành một biến hoặc một mảng mới
            $push: { updatedBy: updatedBy }
        });

        req.flash("success", "Cập nhật sản phẩm thành công !!!");
    } catch (error) {
        req.flash("error", "Cập nhật sản phẩm không thành công !!!");
    }

    res.redirect("back");
};

// [GET]/admin/product/detail/:id
module.exports.detail = async (req, res) => {
    try{
        const find = {
            deleted: false,
            _id: req.params.id
        };

        const product = await Product.findOne(find);
    
        res.render("admin/pages/product/detail", {
            pageTitle: product.title,
            product: product
        });
    } catch (error) {
        // can res.flash nua
        res.redirect(`${systemConfig.prefixAdmin}/product`)
    }
};