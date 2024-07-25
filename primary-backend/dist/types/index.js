"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signInSchema = exports.signUpSchema = void 0;
const zod_1 = require("zod");
exports.signUpSchema = zod_1.z.object({
    username: zod_1.z.string().min(5),
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
exports.signInSchema = zod_1.z.object({
    username: zod_1.z.string().min(5),
    password: zod_1.z.string(),
});
