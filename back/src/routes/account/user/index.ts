import * as KoaRouter from "koa-router";
import ICustomContext from "@utils/context";

import UsernameRouter from "./[username]";

const router = new KoaRouter<any, ICustomContext>();

router.use("/:username", UsernameRouter.routes());

export default router;
