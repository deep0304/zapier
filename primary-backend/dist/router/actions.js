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
exports.actionRouter = void 0;
const express_1 = require("express");
const db_1 = require("../db");
const router = (0, express_1.Router)();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const actions = yield db_1.prismaClient.availableAction.findMany({
            where: {},
        });
        if (!actions) {
            return res.status(411).json({ message: "actions not found " });
        }
        return res.status(200).json(actions);
    }
    catch (error) {
        console.log("error while finding the actions: ");
        res.status(400).json({
            message: "the actions not found",
        });
    }
}));
router.get("/triggers", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const triggers = yield db_1.prismaClient.availableTrigger.findMany({
            where: {},
        });
        if (!triggers) {
            return res.status(400).json({ message: "triggers notn recieved" });
        }
        return res.status(200).json(triggers);
    }
    catch (error) {
        console.log("The error while getting the triggers", error);
        return res.status(500).json("Error while getting the triggers");
    }
}));
exports.actionRouter = router;
