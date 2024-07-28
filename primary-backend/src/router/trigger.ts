import express, { Router } from "express";
import { prismaClient } from "../db";
const router = Router();
router.get("/available", async (req, res) => {
  try {
    const triggers = await prismaClient.availableTrigger.findMany({
      where: {},
    });
    if (!triggers) {
      return res.status(400).json({ message: "triggers notn recieved" });
    }
    return res.status(200).json({ triggers });
  } catch (error) {
    console.log("The error while getting the triggers", error);
    return res.status(500).json("Error while getting the triggers");
  }
});
export const triggerRouter = router;
