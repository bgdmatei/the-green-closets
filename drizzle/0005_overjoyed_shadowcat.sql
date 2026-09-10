-- Convert the moment to a calendar day in UTC. Without a USING clause Postgres
-- would use the session's timezone for the cast, which is exactly the drift the
-- new column type is meant to remove.
ALTER TABLE "posts" ALTER COLUMN "published_at" SET DATA TYPE date USING ("published_at" AT TIME ZONE 'UTC')::date;