import 'dotenv/config';
import { defineConfig } from "drizzle-kit";
import { env } from "./src/config/env.js";

export default defineConfig({
    schema: './src/models/schema.ts',
    out: './drizzle',
    dialect: 'mysql',
    dbCredentials: {
        url: env.DATABASE_URL!,
    },
    strict: true,
    verbose: true,
})