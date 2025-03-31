import { Database as DB } from 'bun:sqlite';

export abstract class Database {
	private static db = new DB(':memory:');
	static isInitialized = false;

	static getClient() {
		if (!Database.isInitialized) {
			Database.initialize();
			Database.isInitialized = true;
		}
		return Database.db;
	}

	static initialize() {
		this.db.exec(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT NOT NULL,
        description TEXT,
        status TEXT NOT NULL CHECK (status IN ('completed', 'pending')),
        due TEXT NOT NULL
      );
    `);
	}
}
