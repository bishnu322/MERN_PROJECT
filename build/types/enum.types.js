"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment_method = exports.Order_status = exports.Role = void 0;
var Role;
(function (Role) {
    Role["ADMIN"] = "ADMIN";
    Role["USER"] = "USER";
    Role["SUPER_ADMIN"] = "SUPER_ADMIN";
})(Role || (exports.Role = Role = {}));
var Order_status;
(function (Order_status) {
    Order_status["PENDING"] = "PENDING";
    Order_status["PROCESSING"] = "PROCESSING";
    Order_status["SHIPPED"] = "SHIPPED";
    Order_status["COMPLETED"] = "COMPLETED";
    Order_status["CANCELLED"] = "CANCELLED";
})(Order_status || (exports.Order_status = Order_status = {}));
var Payment_method;
(function (Payment_method) {
    Payment_method["COD"] = "COD";
    Payment_method["CARD"] = "CARD";
})(Payment_method || (exports.Payment_method = Payment_method = {}));
