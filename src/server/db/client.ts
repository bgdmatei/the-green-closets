import "server-only";

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import { getDatabaseEnv } from "@/lib/env.server";
import * as schema from "./schema";

/**
 * The database handle.
 *
 * Uses Neon's HTTP driver rather than a TCP pool. Netlify runs this app's
 * server code as serverless functions, where a pooled TCP client either has to
 * be carefully cached across invocations or it exhausts the connection limit.
 * An HTTP driver has no connection to keep alive, so that whole class of
 * problem does not arise.
 *
 * Created lazily and memoised: importing this module must not require a
 * database, so that a build which only touches static pages still works.
 */
let cached: ReturnType<typeof createClient> | null = null;

const createClient = () => {
  const sql = neon(getDatabaseEnv().DATABASE_URL);
  return drizzle(sql, { schema });
};

export const getDb = () => {
  cached ??= createClient();
  return cached;
};

export type Database = ReturnType<typeof createClient>;
