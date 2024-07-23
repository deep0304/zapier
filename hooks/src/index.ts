import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
app.use(express.json());
const port = 3000;
const client = new PrismaClient();
app.post("/hooks/zap/:userId/:zapId", (req, res) => {
  const userId = req.params.userId;
  const zapId = req.params.zapId;
  const body = req.body;

  //store in the db
  client.$transaction(async (tx) => {
    const run = await client.zapRun.create({
      data: {
        zapId: zapId,
        metadata: body,
      },
    });
    await client.zapRunOutbox.create({
      data: {
        zapRunId: run.id,
      },
    });
  });

  res.json({
    message: "Webhooks recieved",
  });
  // hooks hit  handle
});
app.listen(port, () => {
  console.log("runnnig on the port " + port);
});
