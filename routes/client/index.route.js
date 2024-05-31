const homeRoutes = require("./home.route");

const productRoutes = require("./product.route");
const searchRoutes = require("./search.route");
const outletRoutes = require("./outlet.route");
const cartRoutes = require("./cart.route");
const checkoutRoutes = require("./checkout.route");
const userRoutes = require("./user.route");

const typeMiddleware = require("../../middlewares/client/type.middleware");
const cartMiddleware = require("../../middlewares/client/cart.middleware");
const userMiddleware = require("../../middlewares/client/user.middleware");
const settingMiddleware = require("../../middlewares/client/setting.middleware");

module.exports = (app) => {
    app.use(typeMiddleware.type);

    app.use(cartMiddleware.cartId);

    app.use(userMiddleware.infoUser);

    app.use(settingMiddleware.settingGeneral);

    app.use("/", homeRoutes);

    app.use("/product", productRoutes);

    app.use("/search", searchRoutes);

    app.use("/outlet", outletRoutes);

    app.use("/cart", cartRoutes);

    app.use("/checkout", checkoutRoutes);

    app.use("/user", userRoutes);
}