import express from "express";
import { authMiddleware } from "../authMiddleware";
import { zapCreateSchema } from "../types";
import { prismaClient } from "../db";
const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  const body = req.body;
  //@ts-ignore
  const id: string = req.id;
  const parsedData = zapCreateSchema.safeParse(body);
  if (!parsedData.success) {
    return res.json({
      message: "Zap not created , something went wrong",
    });
  } else {
    try {
      await prismaClient.$transaction(async (tx) => {
        const zap = await prismaClient.zap.create({
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
        const associatedTrigger = await prismaClient.trigger.create({
          data: {
            zapId: zap.id,
            triggerId: parsedData.data.availableTriggerId,
          },
        });
        await prismaClient.zap.update({
          where: {
            id: zap.id,
          },
          data: {
            triggerId: associatedTrigger.id,
          },
        });
        return zap.id;
      });
    } catch (error) {
      console.log("the error while creating the zap", error);
    }
  }
});
router.get("/", authMiddleware, (req, res) => {
  return res.json({
    message: "zaps view",
  });
});
router.get("/:zapId", authMiddleware, (req, res) => {
  return res.json({
    message: "zap handler",
  });
});

export const zapRouter = router;
