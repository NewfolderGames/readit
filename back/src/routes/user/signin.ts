import { createHash } from "crypto";
import * as KoaRouter from "koa-router";
import ICustomContext from "@utils/context";

const router = new KoaRouter<any, ICustomContext>();

interface SignInRequest {

	username?: string,
	password?: string,

}

router.post("/", async (context) => {

	const { username, password } = <SignInRequest>context.request.body;

	// Validation.

	if (!username) {

		context.response.body = { error: "Field 'username' is empty." };
		context.response.status = 400;
		return

	}

	if (!password) {

		context.response.body = { error: "Field 'password' is empty." };
		context.response.status = 400;
		return

	}

	// Check.

	const dbClient = await context.pg.connect();

	try {

		const hashedPassword = createHash("sha256").update(password).digest("hex");

		const checkResult = await dbClient.query("SELECT * FROM users WHERE username = $1 AND password = $2", [username, hashedPassword]);

		if (checkResult.rowCount == 0) {

			context.response.body = { error: `Username and password does not match.` };
			context.response.status = 401;
			dbClient.release();
			return;

		}

	}  catch (error) {

		context.response.body = { error: `Something went wrong while creating an account.` };
		context.response.status = 500;
		dbClient.release();
		return;

	}

	context.response.body = {}
	context.response.status = 200;

});

export default router;
