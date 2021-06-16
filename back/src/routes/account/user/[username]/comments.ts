import * as Crypto from "crypto";
import * as KoaRouter from "koa-router";
import * as JWT from "jsonwebtoken";
import ICustomContext from "@utils/context";
import TokenData from "@utils/token";

const ITEMS_PER_PAGE = 50;

const router = new KoaRouter<any, ICustomContext>();

router.get("/", async (context) => {

	const { username } = context.params;
	const { page } = context.query;

	// Validation.

	if (!username) {

		context.response.body = { error: "User not found." };
		context.response.status = 404;
		return;

	}

	let pageNumber = window.parseInt(page as string);

	if (!pageNumber || pageNumber < 1) pageNumber = 1;

	// Search.

	const dbClient = await context.pg.connect();
	let comments;

	try {

		const userIdCheck = await dbClient.query("SELECT id FROM users WHERE username = $1 AND is_deleted = false", [username]);

		if (!userIdCheck.rows[0]) {

			context.response.body = { error: "User not found." };
			context.response.status = 404;
			return;

		}

		const userId = userIdCheck.rows[0]["id"];

		const commentsResult = await dbClient.query("SELECT * FROM comments WHERE user_id = $1 AND is_deleted = false LIMIT $2 OFFSET $3 ORDER BY created_datetime DESC", [userId, ITEMS_PER_PAGE, ITEMS_PER_PAGE * (pageNumber - 1)]);
		let comments = commentsResult.rows;

		dbClient.release();

	} catch (err) {

		dbClient.release();
		context.response.body = { error: `Something went wrong while getting comments.` };
		context.response.status = 500;
		return;

	}

	context.response.body = comments;
	context.response.status = 200;

});

export default router;
