import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

// export default defineConfig({
//   driver: "pglite",
//   schema: "./src/lib/db/schema.ts",
//   dialect: 'postgresql',
//   dbCredentials: {
//     user: process.env.DATABASE_USER!,
//     password: process.env.DATABASE_PASS!,
//     ssl: true,
//     host: process.env.DATABASE_HOST!,
//     port: process.env.DATABASE_PORT!,
//     database: process.env.DATABASE_NAME!,
    
// }},
// );

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  dialect: 'postgresql',
  dbCredentials: {
    url:process.env.DATABASE_URL!,    
}},
);