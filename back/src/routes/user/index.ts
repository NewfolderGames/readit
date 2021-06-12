import * as KoaRouter from "koa-router";
import ICustomContext from "@utils/context";
import SignUpRouter from "./signup";

const router = new KoaRouter<any, ICustomContext>();

router.use("/signup", SignUpRouter.routes());

export default router;
