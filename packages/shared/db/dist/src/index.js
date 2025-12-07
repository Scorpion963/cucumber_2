import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "./schema";
export var db = drizzle(process.env.DATABASE_URL, { schema: schema });
export * from "./schema";
