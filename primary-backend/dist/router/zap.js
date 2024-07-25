"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.zapRouter = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../authMiddleware");
const router = express_1.default.Router();
const client = new client_1.PrismaClient();
router.post("/", authMiddleware_1.authMiddleware, (req, res) => {
    return res.json({ message: "zap create" });
});
router.get("/", authMiddleware_1.authMiddleware, (req, res) => {
    return res.json({
        message: "zaps view",
    });
});
router.get("/:zapId", authMiddleware_1.authMiddleware, (req, res) => {
    return res.json({
        message: "zap handler",
    });
});
exports.zapRouter = router;
