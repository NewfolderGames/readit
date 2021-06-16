import * as Crypto from "crypto";
import * as KoaRouter from "koa-router";
import * as JWT from "jsonwebtoken";
import ICustomContext from "@utils/context";
import TokenData from "@utils/token";

import CommentsRouter from "./comments";
import PostsRouter from "./posts";

const router = new KoaRouter<any, ICustomContext>();

router.use("/comments", PostsRouter.routes());
router.use("/posts", PostsRouter.routes());

router.get("/", async (context) => {

	const { username } = context.params;

	// Validation.

	if (!username) {

		context.response.body = { error: "User not found." };
		context.response.status = 404;
		return;

	}

	// Search.

	const dbClient = await context.pg.connect();
	let user;

	try {

		const result = await dbClient.query("SELECT username, email, created_datetime, is_admin FROM users WHERE username = $1", [username]);

		if (!result.rows[0]) {

			context.response.body = { error: "User not found." };
			context.response.status = 404;
			return;

		}
		
		user = result.rows[0];

		dbClient.release();

	} catch (err) {

		dbClient.release();
		context.response.body = { error: `Something went wrong while getting user infomation.` };
		context.response.status = 500;
		return;

	}

	context.response.body = user;
	context.response.status = 200;

});

export default router;
