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
exports.zapRouter = void 0;
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../authMiddleware");
const types_1 = require("../types");
const db_1 = require("../db");
const router = express_1.default.Router();
router.post("/", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    console.log("body ", body);
    //@ts-ignore
    const id = req.id;
    console.log("id: ", id);
    const parsedData = types_1.zapCreateSchema.safeParse(body);
    console.log("parsedData : ", parsedData.data ? parsedData.data.actions : "actions not found");
    if (!parsedData.success) {
        return res.json({
            message: "Zap not created , something went wrong",
        });
    }
    else {
        try {
            const zapId = yield db_1.prismaClient.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
                const zap = yield tx.zap.create({
                    data: {
                        triggerId: "",
                        userId: parseInt(id),
                        actions: {
                            create: parsedData.data.actions.map((x, index) => ({
                                actionId: x.availableActionId,
                                sortingOrder: index,
                            })),
                        },
                    },
                });
                console.log("zap: ", zap);
                const associatedTrigger = yield tx.trigger.create({
                    data: {
                        zapId: zap.id,
                        triggerId: parsedData.data.availableTriggerId,
                    },
                });
                console.log("associated Trigger ", associatedTrigger);
                const updatedZap = yield tx.zap.update({
                    where: {
                        id: zap.id,
                    },
                    data: {
                        triggerId: associatedTrigger.id,
                    },
                    include: {
                        actions: true,
                    },
                });
                console.log("updated Zap: ", updatedZap);
                return updatedZap.id;
            }));
            //@ts-ignore
            return res.status(200).json({
                message: "the zap is created with zapId",
                zapId,
            });
        }
        catch (error) {
            console.log("the error while creating the zap", error);
        }
    }
}));
router.get("/", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const userId = req.id;
    try {
        const allZaps = yield db_1.prismaClient.zap.findMany({
            where: {
                userId: userId,
            },
        });
        return res.status(200).json(allZaps);
    }
    catch (error) {
        console.log("the error while finding the zaps", error);
    }
}));
router.get("/:zapId", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const zapId = req.params.zapId;
    console.log("zap ID : ", zapId);
    try {
        const zapResponse = yield db_1.prismaClient.zap.findUnique({
            where: {
                id: zapId,
            },
        });
        console.log("zapRespnse: ", zapResponse);
        if (!zapResponse) {
            return res.status(411).json({
                message: "the zap not found",
            });
        }
        return res.status(200).json(zapResponse);
    }
    catch (error) {
        console.log("the error while finding the details of the gievn zap", error);
        return res.status(400).json({
            message: "Error while findig the zap",
        });
    }
}));
exports.zapRouter = router;
