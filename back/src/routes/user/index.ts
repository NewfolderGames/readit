import * as KoaRouter from "koa-router";
import ICustomContext from "@utils/context";

import SignInRouter from "./signin";
import SignUpRouter from "./signup";

const router = new KoaRouter<any, ICustomContext>();

router.use("/signin", SignInRouter.routes());
router.use("/signup", SignUpRouter.routes());

export default router;
