import * as KoaRouter from "koa-router";
import * as JWT from "jsonwebtoken";
import ICustomContext from "@utils/context";
import TokenData from "@utils/token";

const router = new KoaRouter<any, ICustomContext>();

interface CreateRequest {

	title?: string,
	description?: string,

}

router.post("/", async (context) => {

	const { title, description } = <CreateRequest>context.request.body;

	// Validation.

	if (!title) {

		context.response.body = { error: "Field 'title' is empty." };
		context.response.status = 400;
		return;

	} else if (title.length > 32 || title.length < 4) {

		context.response.body = { error: "Field 'title' should be between 4 to 32 characters long." };
		context.response.status = 400;
		return;

	}

	if (!description) {

		context.response.body = { error: "Field 'description' is empty." };
		context.response.status = 400;
		return;

	}

	// Authorization.

	const rawToken = context.cookies.get("token");

	if (!rawToken) {

		context.response.body = { error: "Not authorized." };
		context.response.status = 401;
		return;

	}
	
	let userId: number;

	try {

		const token = <TokenData>JWT.verify(rawToken, process.env.JWTSECRET as string);
		userId = token.userId;

	} catch (err) {

		context.response.body = { error: "Could not parse the token." };
		context.response.status = 401;
		return;

	}

	// Insert.

	const dbClient = await context.pg.connect();

	try {

		await dbClient.query("BEGIN");
		await dbClient.query("INSERT INTO subreadits (title, description) VALUES ($1, $2)", [title, description]);

		const result = await dbClient.query("SELECT id FROM subreadits WHERE title = $1", [title]);
		let subreaditId = result.rows[0]["id"];

		await dbClient.query("INSERT INTO subreadit_moderators (user_id, subreadit_id) VALUES ($1, $2)", [userId, subreaditId]);
		await dbClient.query("COMMIT");
		dbClient.release();

	} catch (err) {

		dbClient.query("ROLLBACK");
		dbClient.release();

		context.response.body = { error: `Something went wrong while creating a subreadit.` };
		context.response.status = 500;
		return;

	}

	const token = JWT.sign(<TokenData>{ userId: userId }, process.env.JWTSECRET as string, { algorithm: "HS256", expiresIn: "1d"});

	context.cookies.set("token", token, { domain: "localhost" });
	context.response.body = {};
	context.response.status = 201;

});

export default router;