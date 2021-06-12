import * as KoaRouter from "koa-router";
import ICustomContext from "@utils/context";
import subRouter from "./sub";
import userRouter from "./user";

const router = new KoaRouter<any, ICustomContext>();

router.use("/sub", subRouter.routes());
router.use("/user", userRouter.routes());

export default router;