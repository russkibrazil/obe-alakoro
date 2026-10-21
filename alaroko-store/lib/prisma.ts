import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 30,
  allowPublicKeyRetrieval: true
});

const sqliteAdapter =  new PrismaBetterSqlite3({ url: process.env["DATABASE_URL"] });
const prisma = new PrismaClient({adapter: adapter});

export { prisma };
