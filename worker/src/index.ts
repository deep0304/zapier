require("dotenv").config();
import { Kafka } from "kafkajs";
import { PrismaClient } from "@prisma/client";
import { JsonObject } from "@prisma/client/runtime/library";
import { parser } from "./parser";
import { sendEmail } from "./email";
import { sendEth } from "./etherum";
const client = new PrismaClient();
const Topic = "ZapServices";
const kafka = new Kafka({
  clientId: "zap-worker",
  brokers: ["localhost:9092"],
});
const consumer = kafka.consumer({ groupId: "workers" });
const producer = kafka.producer({});
const main = async () => {
  await client.$connect();
  await consumer.connect();
  await consumer.subscribe({ topics: [Topic], fromBeginning: true });
  await producer.connect();

  try {
    await consumer.run({
      autoCommit: false,
      eachMessage: async ({ topic, partition, message }) => {
        console.log(
          "---------------------start-------------------------------"
        );
        console.log("starting the processs", message.offset);
        //@ts-ignore
        const parsedValue = JSON.parse(message.value.toString());
        const parsedZapRunId = parsedValue.zapRunId;
        const parsedStage = parsedValue.stage;
        const zapRunDetails = await client.zapRun.findFirst({
          where: { id: parsedZapRunId },
          include: {
            zap: {
              include: {
                actions: {
                  include: {
                    type: true,
                  },
                },
              },
            },
          },
        });
        const currentAction = zapRunDetails?.zap.actions.find(
          (x) => x.sortingOrder === parsedStage
        );
        console.log("the currebt action is : ", currentAction);

        if (!currentAction) {
          return;
        }
        const zapRunMetadata = zapRunDetails?.metadata;

        if (currentAction?.type.name === "sendEmails") {
          const body = parser(
            (currentAction.actionMetadata as JsonObject)?.body as string,
            zapRunMetadata
          );
          const to = parser(
            (currentAction.actionMetadata as JsonObject)?.email as string,
            zapRunMetadata
          );
          const response = await sendEmail(to, body);
          console.log(response);
        }

      //   if (currentAction?.type.name === "sendSol") {
      // //     const address = parser(
      // //       (currentAction.actionMetadata as JsonObject)?.address as string,
      // //       zapRunMetadata
      // //     );
      // //     const amount = parser(
      // //       (currentAction.actionMetadata as JsonObject)?.amount as string,
      // //       zapRunMetadata
      // //     );

      // //     console.log(
      // //       `sending the sol to address ${address} with the amount ${amount}`
      // //     );
      // //     const reseponse = await sendEth(address, amount);
      // //     console.log(
      // //       "the eth is send scccessfully the reciept it ",
      // //       reseponse
      // //     );
      //   }

        const lastStage = (zapRunDetails?.zap.actions.length || 1) - 1;
        if (parsedStage !== lastStage) {
          const response = await producer.send({
            topic: "ZapServices",
            messages: [
              {
                value: JSON.stringify({
                  zapRunId: parsedZapRunId,
                  stage: parsedStage + 1,
                }),
              },
            ],
          });
        }
        await new Promise((r) => setTimeout(r, 3000));
        await consumer.commitOffsets([
          {
            topic: Topic,
            partition,
            offset: (parseInt(message.offset) + 1).toString(),
          },
        ]);
        console.log("process Done");
        console.log("--------------------end------------------------------");
      },
    });
  } catch (error) {
    console.log("error while sending to worker ", error);
  }
};
main();
