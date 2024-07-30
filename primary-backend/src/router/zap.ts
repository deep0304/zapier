import express from "express";
import { authMiddleware } from "../authMiddleware";
import { zapCreateSchema } from "../types";
import { prismaClient } from "../db";
const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  const body = req.body;
  //@ts-ignore
  const id: string = req.id;
  console.log("The data commint from the frontend: ", body);
  const parsedData = zapCreateSchema.safeParse(body);
  console.log("The parseddata  : ", parsedData);

  if (!parsedData.success) {
    return res.json({
      message: "Zap not created , something went wrong",
    });
  } else {
    try {
      const zapId = await prismaClient.$transaction(async (tx) => {
        const zap = await tx.zap.create({
          data: {
            triggerId: "",
            userId: parseInt(id),
            actions: {
              create: parsedData.data.actions.map((x, index) => ({
                actionId: x.availableActionId,
                sortingOrder: index,
                actionMetadata: x.actionMetadata,
              })),
            },
          },
        });
        console.log("zap: ", zap);
        const associatedTrigger = await tx.trigger.create({
          data: {
            zapId: zap.id,
            triggerId: parsedData.data.availableTriggerId,
          },
        });
        console.log("associated Trigger ", associatedTrigger);
        const updatedZap = await tx.zap.update({
          where: {
            id: zap.id,
          },
          data: {
            triggerId: associatedTrigger.id,
          },
        });
        console.log("updated Zap: ", updatedZap);
        return updatedZap.id;
      });
      //@ts-ignore
      return res.status(200).json({
        message: "the zap is created with zapId",
        zapId,
      });
    } catch (error) {
      console.log("the error while creating the zap", error);
    }
  }
});
router.get("/", authMiddleware, async (req, res) => {
  //@ts-ignore
  const userId = req.id;
  try {
    const allZaps = await prismaClient.zap.findMany({
      where: {
        userId: userId,
      },
      include: {
        trigger: {
          include: {
            type: true,
          },
        },
        actions: {
          include: {
            type: true,
          },
        },
      },
    });
    return res.status(200).json(allZaps);
  } catch (error) {
    console.log("the error while finding the zaps", error);
  }
});
router.get("/:zapId", authMiddleware, async (req, res) => {
  //@ts-ignore
  const userId = req.id;
  const zapId = req.params.zapId;
  console.log("zap ID : ", zapId);
  try {
    const zapResponse = await prismaClient.zap.findUnique({
      where: {
        id: zapId,
        userId: userId,
      },
      include: {
        trigger: {
          include: {
            type: true,
          },
        },
        actions: {
          include: {
            type: true,
          },
        },
      },
    });
    if (!zapResponse) {
      return res.status(411).json({
        message: "the zap not found",
      });
    }
    return res.status(200).json(zapResponse);
  } catch (error) {
    console.log("the error while finding the details of the gievn zap", error);
    return res.status(400).json({
      message: "Error while findig the zap",
    });
  }
});
export const zapRouter = router;
