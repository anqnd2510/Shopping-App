const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const productTypeSchema = new mongoose.Schema(
    {
        title: String,
        parent_id: {
            type: String,
            default: "",
        },
        description: String,
        thumbnail: String,
        // category: String,
        status: String,
        position: Number,
        slug: {
            type: String,
            slug: "title",
            unique: true
        },
        deleted: {
            type: Boolean,
            default: false
        },
        deletedAt: Date
    }, {
        timestamps: true
    }
);

const ProductType = mongoose.model("ProductType", productTypeSchema, "products-type");

module.exports = ProductType;