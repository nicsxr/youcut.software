`CREATE TABLE "tasks" (
	"id"	TEXT NOT NULL UNIQUE,
	"status"	INTEGER NOT NULL DEFAULT 0,
	"format"	TEXT NOT NULL,
	"url"	TEXT,
	PRIMARY KEY("id")
);`