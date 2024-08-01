import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
app.use(express.json());
const port = 3002;
const client = new PrismaClient();
app.post("/hooks/zap/:userId/:zapId", (req, res) => {
  const userId = req.params.userId;
  const zapId = req.params.zapId;
  const body = req.body;
  console.log(body);
  //store in the db
  try {
    client.$transaction(async (tx) => {
      const run = await client.zapRun.create({
        data: {
          zapId: zapId,
          metadata: body,
        },
      });
      console.log("working fine \n response is : ", run);
      const outboxResponse = await client.zapRunOutbox.create({
        data: {
          zapRunId: run.id,
        },
      });
      console.log("the outbox response is : ", outboxResponse);
    });
  } catch (error) {
    console.log("the error while creating the zap", error);
  }

  res.json({
    message: "Webhooks recieved",
  });
  // hooks hit  handle
});
app.listen(port, () => {
  console.log("runnnig on the port " + port);
});
