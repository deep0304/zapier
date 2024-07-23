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
const kafkajs_1 = require("kafkajs");
const kafka = new kafkajs_1.Kafka({
    clientId: "my-zap-app",
    brokers: ["localhost:9092"],
});
const admin = kafka.admin();
const createTopic = (topic) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield admin.connect();
        ///creating the toppic
        const response = yield admin.createTopics({
            validateOnly: false,
            timeout: 6000,
            topics: [
                {
                    topic: topic,
                    numPartitions: 2,
                    replicationFactor: 1,
                },
            ],
        });
        if (!response) {
            console.log("topic not created ");
        }
        else {
            console.log("topic created successfully ");
        }
    }
    catch (error) {
        console.log("Error while creating the topic ", error);
    }
    finally {
        yield admin.disconnect();
    }
});
createTopic("ZapServices2");
