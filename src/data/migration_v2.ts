import { Preferences } from '@capacitor/preferences';
import { database } from './database';
import { AppState } from '@/types';

const STORAGE_KEY = "inventory_app_data";
const MIGRATION_KEY = "sqlite_migration_complete";

export const migration = {
    async migrateFromPreferences(): Promise<void> {
        const db = database.getDB();

        // Check if migration already done
        const { value: isMigrated } = await Preferences.get({ key: MIGRATION_KEY });
        if (isMigrated === "true") return;

        // Check if there is data to migrate
        const { value: jsonString } = await Preferences.get({ key: STORAGE_KEY });
        if (!jsonString) {
            // No old data, just mark migration as done to skip future checks
            await Preferences.set({ key: MIGRATION_KEY, value: "true" });
            return;
        }

        try {
            const data: AppState = JSON.parse(jsonString);
            console.log("Migrating data...", data);

            // Migrate Categories
            for (const cat of data.categories) {
                await db.run(
                    "INSERT OR IGNORE INTO categories (id, name, icon, color) VALUES (?, ?, ?, ?)",
                    [cat.id, cat.name, cat.icon, cat.color || ""]
                );
            }

            // Migrate Locations
            for (const loc of data.locations) {
                await db.run(
                    "INSERT OR IGNORE INTO locations (id, name, icon, color) VALUES (?, ?, ?, ?)",
                    [loc.id, loc.name, loc.icon, loc.color || ""]
                );
            }

            // Migrate Items
            for (const item of data.items) {
                await db.run(
                    "INSERT OR IGNORE INTO items (id, name, category, location, note, image_path) VALUES (?, ?, ?, ?, ?, ?)",
                    [item.id, item.name, item.category, item.location, item.note || "", ""]
                );
            }

            // Mark migration as complete
            await Preferences.set({ key: MIGRATION_KEY, value: "true" });

            console.log("Migration successful");

        } catch (error) {
            console.error("Migration failed:", error);
        }
    }
};
