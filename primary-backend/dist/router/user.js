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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../authMiddleware");
const types_1 = require("../types");
const db_1 = require("../db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const router = express_1.default.Router();
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_1.prismaClient.$connect();
    }
    catch (error) {
        console.log("The error while connecting the database ", error);
    }
});
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const parsedData = types_1.signUpSchema.safeParse(body);
    if (!parsedData.success) {
        return res.status(411).json({
            message: "Invalid inputs",
        });
    }
    //change the database schema for unique user entries
    const existUser = yield db_1.prismaClient.user.findFirst({
        where: {
            name: parsedData.data.username,
        },
    });
    if (existUser) {
        return res.status(403).json({
            message: "user Already exist",
        });
    }
    else {
        try {
            const passwordToSave = yield hashedPassword(parsedData.data.password);
            const response = yield db_1.prismaClient.user.create({
                data: {
                    name: parsedData.data.username,
                    email: parsedData.data.email,
                    password: passwordToSave,
                },
            });
            if (!response) {
                return res.status(500).json({
                    message: "user not created ",
                });
            }
        }
        catch (error) {
            console.log("the error while the creating the user", error);
        }
        //send email
        return res.status(200).json({
            message: "user Created successfully",
            message2: "Please verify the email",
        });
    }
}));
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const parsedData = types_1.signInSchema.safeParse(body);
    if (!parsedData.success) {
        console.log(parsedData.data);
        console.log(parsedData.error);
        return res.status(411).json({
            message: "Invalid inputs",
        });
    }
    else {
        const existUser = yield db_1.prismaClient.user.findFirst({
            where: {
                name: parsedData.data.username,
            },
        });
        if (!existUser) {
            return res.status(411).json({
                message: "User Not exist",
            });
        }
        else {
            const savedPassword = existUser.password;
            const resp = yield comparePassword(parsedData.data.password, savedPassword);
            if (resp === false) {
                return res.status(400).json({
                    message: "password not correct",
                });
            }
            //signIng the token
            const token = jsonwebtoken_1.default.sign({
                id: existUser.id,
            }, config_1.JWT_SECRET);
            return res.json({
                message: "user signed In successFully",
                token: token,
            });
        }
    }
}));
router.get("/", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const id = req.id;
    const user = yield db_1.prismaClient.user.findFirst({
        where: {
            id,
        },
        select: {
            name: true,
            email: true,
        },
    });
    return res.json({
        user,
    });
}));
exports.userRouter = router;
const hashedPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const salt = yield bcryptjs_1.default.genSalt(10);
    const hash = yield bcryptjs_1.default.hash(password, salt);
    return hash;
});
const comparePassword = (passwordToCheck, savedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const isMatch = yield bcryptjs_1.default.compare(passwordToCheck, savedPassword);
    return isMatch;
});
