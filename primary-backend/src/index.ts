import express, { Router } from "express";
import { zapRouter } from "./router/zap";
import { userRouter } from "./router/user";
import cors from "cors";
import { actionRouter } from "./router/actions";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/v1/user/", userRouter);

app.use("/api/v1/zap", zapRouter);
app.use("/api/v1/actions", actionRouter);

app.listen(3000, () => {
  console.log("running on the port 3000");
});
