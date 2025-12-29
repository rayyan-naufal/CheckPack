import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
// import { JeepSqlite } from 'jeep-sqlite'; 
import { defineCustomElements as jeepSqlite } from "jeep-sqlite/loader";

// Define the custom element for web usage
// customElements.define('jeep-sqlite', JeepSqlite);
jeepSqlite(window);

const DB_NAME = 'packcheck_db';
const sqlite = new SQLiteConnection(CapacitorSQLite);

let db: SQLiteDBConnection | null = null;

export const database = {
    async init(): Promise<void> {
        try {
            if (db) return; // Already initialized

            // Web platform specific initialization
            if (Capacitor.getPlatform() === "web") {
                const jeepSqlite = document.createElement('jeep-sqlite');
                document.body.appendChild(jeepSqlite);
                await customElements.whenDefined('jeep-sqlite');
                await sqlite.initWebStore();
            }

            // Create connection
            const ret = await sqlite.checkConnectionsConsistency();
            const isConnected = (await sqlite.isConnection(DB_NAME, false)).result;

            if (ret.result && isConnected) {
                db = await sqlite.retrieveConnection(DB_NAME, false);
            } else {
                db = await sqlite.createConnection(DB_NAME, false, "no-encryption", 1, false);
            }

            if (db) {
                await db.open();
                await this.createTables();
            }
        } catch (err) {
            console.error("Failed to initialize database", err);
            throw err;
        }
    },

    async createTables(): Promise<void> {
        if (!db) return;

        const schema = `
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        icon TEXT,
        color TEXT
      );

      CREATE TABLE IF NOT EXISTS locations (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        icon TEXT,
        color TEXT
      );

      CREATE TABLE IF NOT EXISTS items (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT,
        location TEXT,
        note TEXT,
        image_path TEXT
      );
    `;

        await db.execute(schema);
    },

    getDB(): SQLiteDBConnection {
        if (!db) {
            throw new Error("Database not initialized. Call init() first.");
        }
        return db;
    },
};
