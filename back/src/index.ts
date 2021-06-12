import * as Koa from "koa";
import * as KoaRouter from "koa-router";
import * as KoaBodyParser from "koa-bodyparser";
import * as DotEnv from "dotenv";
import { Pool } from "pg";
import ICustomContext from "@utils/context";
import router from "./routes";

// Get config.

DotEnv.config()

// Create app.

const app = new Koa<Koa.DefaultState, ICustomContext>();

app.context.pg = new Pool();

// Mount middlewares.

app.use(KoaBodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

// Listen.

app.listen(process.env.PORT, () => {

	console.log(`Server listening to port ${process.env.PORT}`);
	
});
