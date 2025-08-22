"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const db_config_1 = require("./config/db.config");
const error_handler_middleware_1 = require("./middlewares/error-handler.middleware");
//* importing routes
const auth_routes_1 = __importDefault(require("./routers/auth.routes"));
const user_routes_1 = __importDefault(require("./routers/user.routes"));
const brand_routes_1 = __importDefault(require("./routers/brand.routes"));
const category_routes_1 = __importDefault(require("./routers/category.routes"));
const product_routes_1 = __importDefault(require("./routers/product.routes"));
const wish_list_routes_1 = __importDefault(require("./routers/wish_list.routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cart_routes_1 = __importDefault(require("./routers/cart.routes"));
const order_routes_1 = __importDefault(require("./routers/order.routes"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const DB_URI = (_a = process.env.DB_URI) !== null && _a !== void 0 ? _a : "";
//* calling database connection
(0, db_config_1.DB_CONNECTION)(DB_URI);
app.set("trust proxy", 1);
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:5173", // your dev frontend
        "https://mern-kart-client.vercel.app", // your deployed frontend
    ],
    credentials: true, // allow cookies
}));
//*  Using middlewares
app.use(express_1.default.json({ limit: "5mb" }));
app.use(express_1.default.urlencoded({ limit: "5mb", extended: true }));
//* using cookieParser
app.use((0, cookie_parser_1.default)());
//* serving uploads as static file
app.use("/api/uploads", express_1.default.static("uploads/"));
// * Home route
app.get("/", (req, res) => {
    res.send("server is up and running");
});
// routers
app.use("/api/auth", auth_routes_1.default);
app.use("/api/user", user_routes_1.default);
app.use("/api/brand", brand_routes_1.default);
app.use("/api/category", category_routes_1.default);
app.use("/api/product", product_routes_1.default);
app.use("/api/wishlist", wish_list_routes_1.default);
app.use("/api/cart", cart_routes_1.default);
app.use("/api/order", order_routes_1.default);
//* All error routes
app.all("/{*all}", (req, res, next) => {
    const message = `cannot ${req.method} on path ${req.originalUrl}`;
    const error = new error_handler_middleware_1.CustomError(message, 404);
    next(error);
});
app.listen(PORT, () => {
    console.log(`Server is listening on port http://localhost:${PORT}`);
});
// * errorHandler middleware called
app.use(error_handler_middleware_1.errorHandler);
