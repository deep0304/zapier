// import from the kafka
import { Kafka } from "kafkajs";
import { Partitioners } from "kafkajs";

//imports from the prisma
import { PrismaClient, ZapRunOutbox } from "@prisma/client";
const client = new PrismaClient();

const kafka = new Kafka({
  clientId: "my-zap-app",
  brokers: ["localhost:9092"],
});
const producer = kafka.producer({});
const batchSize = 5;
const run = async () => {
  while (1) {
    try {
      try {
        await client.$connect();
        await producer.connect();
      } catch (error) {
        console.log(
          "error while conecting to the message Distributibng service",
          error
        );
      }

      const pendingRows = await client.zapRunOutbox.findMany({
        where: {},
        take: batchSize,
      });
      //prepare mesasage
      const messages = pendingRows.map((data) => ({
        value: JSON.stringify({ zapRunId: data.zapRunId, stage: 0 }),
      }));
      const response = await producer.send({
        topic: "ZapServices",
        messages,
      });
      console.log("send prodcer response", response);
      const deleteresponse = await client.zapRunOutbox.deleteMany({
        where: {
          id: {
            in: pendingRows.map((oneZapRunOutBox) => oneZapRunOutBox.id),
          },
        },
      });
      console.log("deleteResponse : ", deleteresponse);

      // console.log(response);
    } catch (error) {
      console.log("error", error);
    }
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
};

const sendOnTheKafkaQueue = async (data: object) => {
  try {
    //     await producer.connect();
    const response = await producer.send({
      topic: "ZapServices",
      messages: [
        {
          value: JSON.stringify(data),
        },
      ],
    });
    if (!response) {
      console.log("cannot send on the queue ");
    } else {
      console.log("sent on the kafka queue by the producer ");
      console.log("response is the: ", response);
    }
  } catch (error) {
    console.log("Erorr while producing to the kafka ", error);
  }
  //   finally {
  //     await producer.disconnect();
  //   }
};

run();
