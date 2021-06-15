import * as KoaRouter from "koa-router";
import ICustomContext from "@utils/context";

import SubRouter from "./sub";

const router = new KoaRouter<any, ICustomContext>();

router.use("/", SubRouter.routes());

export default router;