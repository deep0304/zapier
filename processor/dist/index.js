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
// import from the kafka
const kafkajs_1 = require("kafkajs");
//imports from the prisma
const client_1 = require("@prisma/client");
const client = new client_1.PrismaClient();
const kafka = new kafkajs_1.Kafka({
    clientId: "my-zap-app",
    brokers: ["localhost:9092"],
});
const producer = kafka.producer({});
const batchSize = 5;
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    while (1) {
        try {
            try {
                yield client.$connect();
                yield producer.connect();
            }
            catch (error) {
                console.log("error while conecting to the message Distributibng service", error);
            }
            const zapRunsOutboxes = yield client.zapRunOutbox.findMany({
                take: batchSize,
            });
            //prepare mesasage
            const messages = zapRunsOutboxes.map((data) => ({
                value: JSON.stringify(data),
            }));
            const response = yield producer.send({
                topic: "ZapServices",
                messages,
            });
            console.log("send prodcer response", response);
            const deleteresponse = yield client.zapRunOutbox.deleteMany({
                where: {
                    id: {
                        in: zapRunsOutboxes.map((oneZapRunOutBox) => oneZapRunOutBox.id),
                    },
                },
            });
            console.log("deleteResponse : ", deleteresponse);
            // console.log(response);
        }
        catch (error) {
            console.log("error", error);
        }
        yield new Promise((resolve) => setTimeout(resolve, 5000));
    }
});
const sendOnTheKafkaQueue = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //     await producer.connect();
        const response = yield producer.send({
            topic: "ZapServices",
            messages: [
                {
                    value: JSON.stringify(data),
                },
            ],
        });
        if (!response) {
            console.log("cannot send on the queue ");
        }
        else {
            console.log("sent on the kafka queue by the producer ");
            console.log("response is the: ", response);
        }
    }
    catch (error) {
        console.log("Erorr while producing to the kafka ", error);
    }
    //   finally {
    //     await producer.disconnect();
    //   }
});
run();
