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
const client_1 = require("@prisma/client");
const client = new client_1.PrismaClient();
const Topic = "ZapServices";
const kafka = new kafkajs_1.Kafka({
    clientId: "zap-worker",
    brokers: ["localhost:9092"],
});
const consumer = kafka.consumer({ groupId: "workers" });
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield client.$connect();
    yield consumer.connect();
    yield consumer.subscribe({ topics: [Topic], fromBeginning: true });
    try {
        yield consumer.run({
            autoCommit: false,
            eachMessage: (_a) => __awaiter(void 0, [_a], void 0, function* ({ topic, partition, message }) {
                console.log("starting the processs", message.offset);
                console.log({
                    topic,
                    partition,
                    offset: message.offset,
                    value: message.value.toString(),
                });
                yield new Promise((r) => setTimeout(r, 3000));
                yield consumer.commitOffsets([
                    {
                        topic: Topic,
                        partition,
                        offset: (parseInt(message.offset) + 1).toString(),
                    },
                ]);
                console.log("process Done");
            }),
        });
    }
    catch (error) {
        console.log("error while sending to worker ", error);
    }
});
main();
