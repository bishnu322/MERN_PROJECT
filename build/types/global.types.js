"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allAdminAndUser = exports.users = exports.allAdmin = void 0;
const enum_types_1 = require("./enum.types");
exports.allAdmin = [enum_types_1.Role.ADMIN, enum_types_1.Role.SUPER_ADMIN];
exports.users = [enum_types_1.Role.USER];
exports.allAdminAndUser = [...exports.allAdmin, ...exports.users];
