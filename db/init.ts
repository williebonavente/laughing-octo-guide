import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.resolve(__dirname, '../../users.db');

export const db = new Database(dbPath);

export function initDB() {
    const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL, 
        password TEXT NOT NULL,
        level TEXT,
        goal TEXT,
        layout TEXT
    );
    `;

    db.exec(createUsersTable);
    console.log('[DB] SQLite database initialized.');
}
