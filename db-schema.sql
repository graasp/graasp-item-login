-- maybe remove this from here since graasp core is passing it as a plugin option
-- so maybe graasp core should INSERT this in the DB
INSERT INTO "tag" ("id", "name", "nested")
VALUES ('6230a72d-59c2-45c2-a8eb-e2a01a3ac05b', 'item-login', 'fail');

CREATE TABLE "item_member_login" (
  -- delete row if item is deleted
  "item_id" uuid REFERENCES "item" ("id") ON DELETE CASCADE,
  -- delete row if member is deleted
  "member_id" uuid REFERENCES "member" ("id") ON DELETE CASCADE,
  "created_at" timestamp NOT NULL DEFAULT (NOW() AT TIME ZONE 'utc'),
  PRIMARY KEY ("item_id", "member_id")
);
