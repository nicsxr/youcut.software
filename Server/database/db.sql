`CREATE TABLE "tasks" (
            "id"	INTEGER NOT NULL UNIQUE,
            "status"	INTEGER NOT NULL DEFAULT 0,
            PRIMARY KEY("id" AUTOINCREMENT)
        );`