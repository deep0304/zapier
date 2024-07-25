import { Kafka } from "kafkajs";
import { PrismaClient } from "@prisma/client";
const client = new PrismaClient();
const Topic = "ZapServices";
const kafka = new Kafka({
  clientId: "zap-worker",
  brokers: ["localhost:9092"],
});
const consumer = kafka.consumer({ groupId: "workers" });
const main = async () => {
  await client.$connect();
  await consumer.connect();
  await consumer.subscribe({ topics: [Topic], fromBeginning: true });

  try {
    await consumer.run({
      autoCommit: false,
      eachMessage: async ({ topic, partition, message }) => {
        console.log("starting the processs", message.offset);
        console.log({
          topic,
          partition,
          offset: message.offset,
          value: message.value.toString(),
        });

        await new Promise((r) => setTimeout(r, 3000));
        await consumer.commitOffsets([
          {
            topic: Topic,
            partition,
            offset: (parseInt(message.offset) + 1).toString(),
          },
        ]);
        console.log("process Done");
      },
    });
  } catch (error) {
    console.log("error while sending to worker ", error);
  }
};
main();
