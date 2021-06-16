import * as KoaRouter from "koa-router";
import ICustomContext from "@utils/context";
import AccountRouter from "./account";
import SubreaditRouter from "./subreadit";

const router = new KoaRouter<any, ICustomContext>();

router.use("/account", AccountRouter.routes());
router.use("/subreadit", SubreaditRouter.routes());

export default router;