import express from "express";
import { authMiddleware } from "../authMiddleware";
import { signInSchema, signUpSchema } from "../types";
import { prismaClient } from "../db";
import bycrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
const router = express.Router();
const run = async () => {
  try {
    await prismaClient.$connect();
  } catch (error) {
    console.log("The error while connecting the database ", error);
  }
};

router.post("/signup", async (req, res) => {
  const body = req.body;
  const parsedData = signUpSchema.safeParse(body);
  console.log(body);
  if (!parsedData.success) {
    return res.status(411).json({
      message: "Invalid inputs",
    });
  }
  //change the database schema for unique user entries

  const existUser = await prismaClient.user.findFirst({
    where: {
      name: parsedData.data.username,
    },
  });
  if (existUser) {
    return res.status(403).json({
      message: "user Already exist",
    });
  } else {
    try {
      const passwordToSave = await hashedPassword(parsedData.data.password);
      const response = await prismaClient.user.create({
        data: {
          name: parsedData.data.username,
          email: parsedData.data.email,
          password: passwordToSave,
        },
      });
      if (!response) {
        return res.status(500).json({
          message: "user not created ",
        });
      }
      const token = jwt.sign(
        {
          id: response.id,
        },
        JWT_SECRET
      );
      return res.status(200).json({
        message: "user Created successfully",
        message2: "Please verify the email",
        token: token,
      });
    } catch (error) {
      console.log("the error while the creating the user", error);
    }
    //send email
  }
});
router.post("/signin", async (req, res) => {
  const body = req.body;
  const parsedData = signInSchema.safeParse(body);
  if (!parsedData.success) {
    console.log(parsedData.data);
    console.log(parsedData.error);
    return res.status(411).json({
      message: "Invalid inputs",
    });
  } else {
    const existUser = await prismaClient.user.findFirst({
      where: {
        name: parsedData.data.username,
      },
    });
    if (!existUser) {
      return res.status(411).json({
        message: "User Not exist",
      });
    } else {
      const savedPassword = existUser.password;
      const resp = await comparePassword(
        parsedData.data.password,
        savedPassword
      );
      if (resp === false) {
        return res.status(400).json({
          message: "password not correct",
        });
      }
      //signIng the token
      const token = jwt.sign(
        {
          id: existUser.id,
        },
        JWT_SECRET
      );
      return res.json({
        message: "user signed In successFully",
        token: token,
      });
    }
  }
});
router.get("/", authMiddleware, async (req, res) => {
  //@ts-ignore
  const id = req.id;
  const user = await prismaClient.user.findFirst({
    where: {
      id,
    },
    select: {
      name: true,
      email: true,
    },
  });
  return res.json({
    user,
  });
});

export const userRouter = router;

const hashedPassword = async (password: string) => {
  const salt = await bycrypt.genSalt(10);
  const hash = await bycrypt.hash(password, salt);
  return hash;
};

const comparePassword = async (
  passwordToCheck: string,
  savedPassword: string
) => {
  const isMatch = await bycrypt.compare(passwordToCheck, savedPassword);
  return isMatch;
};
