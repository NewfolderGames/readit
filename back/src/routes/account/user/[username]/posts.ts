import * as Crypto from "crypto";
import * as KoaRouter from "koa-router";
import * as JWT from "jsonwebtoken";
import ICustomContext from "@utils/context";
import TokenData from "@utils/token";

const ITEMS_PER_PAGE = 50;

const router = new KoaRouter<any, ICustomContext>();

router.get("/", async (context) => {

	

});

export default router;
