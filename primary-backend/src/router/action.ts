import express, { Router } from "express";
import { prismaClient } from "../db";

const router = Router();

router.get("/available", async (req, res) => {
  try {
    const actions = await prismaClient.availableAction.findMany({
      where: {},
    });
    if (!actions) {
      return res.status(411).json({ message: "actions not found " });
    }
    return res.status(200).json({ actions });
  } catch (error) {
    console.log("error while finding the actions: ");
    return res.status(400).json({
      message: "the actions not found",
    });
  }
});

export const actionRouter = router;
