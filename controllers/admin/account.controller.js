const md5 = require("md5");
const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");

// [GET]/admin/account
module.exports.index = async (req, res) => {
    let find = {
        deleted: false,
    }
    const records = await Account.find(find).select("-password -token");
    
    for (const record of records) {
        const role = await Role.findOne({
            _id: record.role_id,
            deleted: false
        });
        record.role = role;
    }
    
    res.render("admin/pages/account/index", {
        pageTitle: "Danh sách tài khoản",
        records: records
    });
};

// [GET]/admin/account/create
module.exports.create = async (req, res) => {
    const roles = await Role.find({
        deleted: false
    });

    res.render("admin/pages/account/create", {
        pageTitle: "Tạo mới tài khoản",
        roles: roles
    });
};

// [POST]/admin/account/create
module.exports.createPost = async (req, res) => {
    const emailExist = await Account.findOne({
        email: req.body.email,
        deleted: false
    });

    if(emailExist){
        req.flash("error", `Email ${req.body.email} đã tồn tại rồi!!!`);
        res.redirect("back");
    } else {
        req.body.password = md5(req.body.password);

        const record = new Account(req.body);
        await record.save();
    
        res.redirect(`${systemConfig.prefixAdmin}/account`);
    }
};

// [GET]/admin/account/edit/:id
module.exports.edit = async (req, res) => {
    let find = {
        _id: req.params.id,
        deleted: false,
    };

    try{
        const data = await Account.findOne(find);
        const roles = await Role.find({
            deleted: false
        });

        res.render("admin/pages/account/edit", {
            pageTitle: "Sửa tài khoản",
            data: data,
            roles: roles
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/account`);
    }
};

// [PATCH]/admin/account/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;

    const emailExist = await Account.findOne({
        _id: {$ne: id},
        email: req.body.email,
        deleted: false
    });

    if(emailExist) {
        req.flash("error", `Email ${req.body.email} đã tồn tại rồi!!!`);
    } else {
        if(req.body.password) {
            req.body.password = md5(req.body.password);
            } else {
            delete req.body.password;
            }
        await Account.updateOne({ _id: id}, req.body);
        
        req.flash("success", "Updated account completely!!")
    }

    res.redirect("back");
};

// [GET]/admin/account/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };
        
        const account = await Account.findOne(find);
        res.render("admin/pages/account/detail", {
            pageTitle: "Chi tiết tài khoản",
            account: account
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/account`)
    }
};

// [DELETE]/admin/account/delete/:id
module.exports.deleteAccount = async (req, res) => {
    const id = req.params.id;
    
        await Account.updateOne(
            { _id : id}, 
            {
                deleted: true,
                deletedAt : new Date()
            });
        
    req.flash("success", "Deleted Account Completely !!!");
    res.redirect("back");
};