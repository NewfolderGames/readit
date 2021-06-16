import * as Crypto from "crypto";
import * as KoaRouter from "koa-router";
import ICustomContext from "@utils/context";

const router = new KoaRouter<any, ICustomContext>();

interface SignUpRequest {

	username?: string,
	password?: string,
	email?: string,

}

router.post("/", async (context) => {

	const { username, password, email } = <SignUpRequest>context.request.body;

	// Validation.

	if (!username) {

		context.response.body = { error: "Field 'username' is empty." };
		context.response.status = 400;
		return;

	} else if (username.length > 32 || username.length < 4) {

		context.response.body = { error: "Field 'username' should be between 4 to 32 characters long." };
		context.response.status = 400;
		return;

	}

	if (!password) {

		context.response.body = { error: "Field 'password' is empty." };
		context.response.status = 400;
		return;

	} else if (password.length > 64 || password.length < 8) {

		context.response.body = { error: "Field 'password' should be between 8 to 64 characters long." };
		context.response.status = 400;
		return;

	}

	if (!email) {

		context.response.body = { error: "Field 'email' is empty." };
		context.response.status = 400;
		return;

	} else if (!/^[0-9a-zA-Z]+@[a-z]+\.[a-z]+$/.test(email)) {

		context.response.body = { error: "Field 'email' has wrong format." };
		context.response.status = 400;
		return;

	}

	// Insert.

	const dbClient = await context.pg.connect();

	try {

		// Check username.

		const checkUsernameResult = await dbClient.query("SELECT * FROM users WHERE username = $1", [username]);
		
		if (checkUsernameResult.rowCount > 0) {

			dbClient.release();
			context.response.body = { error: `Username ${username} is already in use.` };
			context.response.status = 409;
			return;

		}

		// Check email.

		const checkEmailResult = await dbClient.query("SELECT * FROM users WHERE email = $1", [email]);
		
		if (checkEmailResult.rowCount > 0) {

			dbClient.release();
			context.response.body = { error: `Email ${email} is already in use.` };
			context.response.status = 409;
			return;

		}

		// Insert.

		const hashedPassword = Crypto.createHash("sha256").update(password).digest("hex");

		await dbClient.query("INSERT INTO users (username, password, email, created_datetime) VALUES ($1, $2, $3, NOW())", [username, hashedPassword, email]);
		dbClient.release();

	} catch (error) {

		dbClient.release();
		context.response.body = { error: `Something went wrong while creating an account.` };
		context.response.status = 500;
		return;

	}

	context.response.body = {};
	context.response.status = 201;
	
});

export default router;
