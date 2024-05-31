const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");

// [GET]/admin/role
module.exports.index = async (req, res) => {
    let find = {
        deleted: false,
    }
    const records = await Role.find(find);

    res.render("admin/pages/role/index", {
        pageTitle: "Nhóm quyền",
        records: records
    });
};

// [GET]/admin/role/create
module.exports.create = async (req, res) => {

    res.render("admin/pages/role/create", {
        pageTitle: "Tạo nhóm quyền",
    });
};

// [POST]/admin/role/create
module.exports.createPost = async (req, res) => {
    
    const record = new Role(req.body);
    await record.save();
    
    req.flash("success", "Tạo mới nhóm quyền thành công");
    res.redirect(`${systemConfig.prefixAdmin}/role`)

};

// [GET]/admin/role/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;

        let find = {
            _id: id,
            deleted: false
        };
        const data = await Role.findOne(find);

        res.render("admin/pages/role/edit", {
            pageTitle: "Chỉnh sửa nhóm quyền",
            data: data
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/role`);
    }
};

// [PATCH] /admin/role/edit/:id
module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id;

        await Role.updateOne({
            _id:id
        }, req.body);
        
        req.flash("success", "Cập nhật nhóm quyền thành công!");

        res.redirect("back");
    } catch (error) {
        req.flash("error", "Cập nhật nhóm quyền thất bại!");
    }
};

// [GET] /admin/role/permission
module.exports.permission = async (req, res) => {
    const records = await Role.find({
        deleted: false
    });

    res.render("admin/pages/role/permission", {
        pageTitle: "Phân quyền",
        records: records
        });
    }
    
// [PATCH] /admin/role/permission
module.exports.permissionPatch = async (req, res) => {
    try {
        const permissions = JSON.parse(req.body.permissions);
            for (const item of permissions) {
                await Role.updateOne({ _id: item.id}, {permissions: item.permissions})
            }
            req.flash("success","Updated Permissions Completely !!");    
            res.redirect("back");
    } catch (error) {
        req.flash("error", "Updated Permissions Wrong!");
    }
}

// [GET] /admin/role/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const find = await Role.findOne({
            _id: req.params.id,
            deleted: false,
        });

        const role = await Role.findOne(find);
        res.render("admin/pages/role/detail", {
            pageTitle: role.title,
            role: role,
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/role`)
    }
};

// [DELETE]/admin/product/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    
        await Role.updateOne(
            { _id : id}, 
            {
                deleted: true,
                deletedAt : new Date()
            });
        
    req.flash("success", "Deleted Role Completely !!!");
    res.redirect("back");
};
