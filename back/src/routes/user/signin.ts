import * as Crypto from "crypto";
import * as KoaRouter from "koa-router";
import * as JWT from "jsonwebtoken";
import ICustomContext from "@utils/context";
import TokenData from "@utils/token";

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
		return;

	}

	if (!password) {

		context.response.body = { error: "Field 'password' is empty." };
		context.response.status = 400;
		return;

	}

	// Check.

	const dbClient = await context.pg.connect();
	let userId: number;

	try {

		const hashedPassword = Crypto.createHash("sha256").update(password).digest("hex");

		const checkResult = await dbClient.query("SELECT id FROM users WHERE username = $1 AND password = $2", [username, hashedPassword]);

		if (checkResult.rowCount == 0) {

			context.response.body = { error: `Username and password does not match.` };
			context.response.status = 401;
			dbClient.release();
			return;

		}
	
		userId = checkResult.rows[0]["id"];
		
		dbClient.release();

	}  catch (error) {

		context.response.body = { error: `Something went wrong while creating an account.` };
		context.response.status = 500;
		dbClient.release();
		return;

	}

	const token = JWT.sign(<TokenData>{ userId: userId }, process.env.JWTSECRET as string, { algorithm: "HS256", expiresIn: "1d"});

	context.cookies.set("token", token, { domain: "localhost" });
	context.response.body = {}
	context.response.status = 200;

});

export default router;
