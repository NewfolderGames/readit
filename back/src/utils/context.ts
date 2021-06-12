import * as Koa from "koa";
import { Pool } from "pg";

export default interface ICustomContext extends Koa.Context {
	
	pg: Pool;

}
