"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pagination = void 0;
const pagination = (page, limit, total) => __awaiter(void 0, void 0, void 0, function* () {
    const total_page = Math.ceil(total / limit);
    const next_page = total_page > page ? page + 1 : null;
    const pre_page = 1 < page ? page - 1 : null;
    const has_next_page = total_page > page ? true : false;
    const has_pre_page = 1 < page ? true : false;
    return {
        total_page,
        next_page,
        pre_page,
        has_next_page,
        has_pre_page,
    };
});
exports.pagination = pagination;
