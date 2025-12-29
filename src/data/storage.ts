import { database } from "./database";
import { migration } from "./migration_v2";
import { AppState, Item, Category, Location } from "@/types";
import { seedItems, seedCategories, seedLocations } from "./seedData";
import * as XLSX from "xlsx";

export const storage = {
  // Initialize storage
  async initialize(): Promise<void> {
    try {
      await database.init();
      const db = database.getDB();
      // Check if data exists, if not seed
      const { values } = await db.query("SELECT count(*) as count FROM items");
      const count = values?.[0]?.count || 0;

      if (count === 0) {
        // Attempt migration first
        await migration.migrateFromPreferences();

        // Re-check count after migration
        const { values: newValues } = await db.query("SELECT count(*) as count FROM items");
        const newCount = newValues?.[0]?.count || 0;

        // If still empty, seed
        if (newCount === 0) {
          await this.seedData();
        }
      }
    } catch (error) {
      console.error("Storage init failed", error);
    }
  },

  async seedData() {
    // Seed Categories
    for (const cat of seedCategories) {
      await this.addCategory(cat);
    }
    // Seed Locations
    for (const loc of seedLocations) {
      await this.addLocation(loc);
    }
    // Seed Items
    for (const item of seedItems) {
      await this.addItem(item);
    }
  },

  // Get all data (for export/backup)
  async getData(): Promise<AppState> {
    await database.init();
    const db = database.getDB();
    const { values: items } = await db.query("SELECT * FROM items");
    const { values: categories } = await db.query("SELECT * FROM categories");
    const { values: locations } = await db.query("SELECT * FROM locations");

    return {
      items: (items || []) as Item[],
      categories: (categories || []) as Category[],
      locations: (locations || []) as Location[],
    };
  },

  // Bulk Import/Restore
  async saveData(state: AppState): Promise<void> {
    await database.init();
    const db = database.getDB();
    // Transactional wipe and replace
    // Note: In a real app we might want to merge, but overwrite is the current spec
    await db.execute("DELETE FROM items; DELETE FROM categories; DELETE FROM locations;");

    for (const cat of state.categories) await this.addCategory(cat);
    for (const loc of state.locations) await this.addLocation(loc);
    for (const item of state.items) await this.addItem(item);
  },

  // Items
  async getItems(): Promise<Item[]> {
    await database.init();
    const db = database.getDB();
    const { values } = await db.query("SELECT * FROM items");
    return (values || []) as Item[];
  },

  async saveItems(items: Item[]): Promise<void> {
    // This is used for bulk updates (e.g. moving items)
    // We can loop through them.
    for (const item of items) {
      await this.updateItem(item.id, item);
    }
  },

  async addItem(item: Item): Promise<void> {
    await database.init();
    const db = database.getDB();
    await db.run("INSERT OR REPLACE INTO items (id, name, category, location, note, image_path) VALUES (?, ?, ?, ?, ?, ?)",
      [item.id, item.name, item.category, item.location, item.note || "", ""]);
  },

  async updateItem(id: string, updates: Partial<Item>): Promise<void> {
    await database.init();
    const db = database.getDB();
    // Construct dynamic query
    const keys = Object.keys(updates).filter(k => k !== 'id');
    if (keys.length === 0) return;

    const setClause = keys.map(k => `${k} = ?`).join(", ");
    const values = keys.map(k => (updates as any)[k]);
    values.push(id);

    await db.run(`UPDATE items SET ${setClause} WHERE id = ?`, values);
  },

  async deleteItem(id: string): Promise<void> {
    await database.init();
    const db = database.getDB();
    await db.run("DELETE FROM items WHERE id = ?", [id]);
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    await database.init();
    const db = database.getDB();
    const { values } = await db.query("SELECT * FROM categories");
    return (values || []) as Category[];
  },

  async addCategory(category: Category): Promise<void> {
    await database.init();
    const db = database.getDB();
    await db.run("INSERT OR REPLACE INTO categories (id, name, icon, color) VALUES (?, ?, ?, ?)",
      [category.id, category.name, category.icon, category.color || ""]);
  },

  async updateCategory(id: string, updates: Partial<Category>): Promise<void> {
    await database.init();
    const db = database.getDB();

    // Check if name changed for cascading
    if (updates.name) {
      const { values } = await db.query("SELECT name FROM categories WHERE id = ?", [id]);
      const oldName = values?.[0]?.name;
      if (oldName && oldName !== updates.name) {
        // Cascade update items
        await db.run("UPDATE items SET category = ? WHERE category = ?", [updates.name, oldName]);
      }
    }

    const keys = Object.keys(updates).filter(k => k !== 'id');
    if (keys.length === 0) return;

    const setClause = keys.map(k => `${k} = ?`).join(", ");
    const values = keys.map(k => (updates as any)[k]);
    values.push(id);

    await db.run(`UPDATE categories SET ${setClause} WHERE id = ?`, values);
  },

  async deleteCategory(id: string): Promise<void> {
    await database.init();
    const db = database.getDB();

    // Get name for orphan handling
    const { values } = await db.query("SELECT name FROM categories WHERE id = ?", [id]);
    const name = values?.[0]?.name;

    await db.run("DELETE FROM categories WHERE id = ?", [id]);

    if (name) {
      await db.run("UPDATE items SET category = 'Uncategorized' WHERE category = ?", [name]);
    }
  },

  // Locations
  async getLocations(): Promise<Location[]> {
    await database.init();
    const db = database.getDB();
    const { values } = await db.query("SELECT * FROM locations");
    return (values || []) as Location[];
  },

  async addLocation(location: Location): Promise<void> {
    await database.init();
    const db = database.getDB();
    await db.run("INSERT OR REPLACE INTO locations (id, name, icon, color) VALUES (?, ?, ?, ?)",
      [location.id, location.name, location.icon, location.color || ""]);
  },

  async updateLocation(id: string, updates: Partial<Location>): Promise<void> {
    await database.init();
    const db = database.getDB();

    // Check if name changed for cascading
    if (updates.name) {
      const { values } = await db.query("SELECT name FROM locations WHERE id = ?", [id]);
      const oldName = values?.[0]?.name;
      if (oldName && oldName !== updates.name) {
        // Cascade update items
        await db.run("UPDATE items SET location = ? WHERE location = ?", [updates.name, oldName]);
      }
    }

    const keys = Object.keys(updates).filter(k => k !== 'id');
    if (keys.length === 0) return;

    const setClause = keys.map(k => `${k} = ?`).join(", ");
    const values = keys.map(k => (updates as any)[k]);
    values.push(id);

    await db.run(`UPDATE locations SET ${setClause} WHERE id = ?`, values);
  },

  async deleteLocation(id: string): Promise<void> {
    await database.init();
    const db = database.getDB();

    // Get name for orphan handling
    const { values } = await db.query("SELECT name FROM locations WHERE id = ?", [id]);
    const name = values?.[0]?.name;

    await db.run("DELETE FROM locations WHERE id = ?", [id]);

    if (name) {
      await db.run("UPDATE items SET location = 'Unassigned' WHERE location = ?", [name]);
    }
  },

  // --- Excel Export / Import ---

  _createWorkbook(data: AppState): XLSX.WorkBook {
    const wb = XLSX.utils.book_new();

    // Items Sheet
    const itemsWs = XLSX.utils.json_to_sheet(data.items);
    XLSX.utils.book_append_sheet(wb, itemsWs, "Items");

    // Categories Sheet
    const categoriesWs = XLSX.utils.json_to_sheet(data.categories);
    XLSX.utils.book_append_sheet(wb, categoriesWs, "Categories");

    // Locations Sheet
    const locationsWs = XLSX.utils.json_to_sheet(data.locations);
    XLSX.utils.book_append_sheet(wb, locationsWs, "Locations");

    return wb;
  },

  async exportToExcel(): Promise<Blob> {
    const data = await this.getData();
    const wb = this._createWorkbook(data);
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    return new Blob([wbout], { type: "application/octet-stream" });
  },

  async exportToExcelBase64(): Promise<string> {
    const data = await this.getData();
    const wb = this._createWorkbook(data);
    return XLSX.write(wb, { bookType: "xlsx", type: "base64" });
  },

  async importFromExcel(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });

          const newState: AppState = {
            items: [],
            categories: [],
            locations: [],
          };

          // Parse sheets
          if (workbook.SheetNames.includes("Items")) {
            newState.items = XLSX.utils.sheet_to_json(workbook.Sheets["Items"]) as Item[];
          }
          if (workbook.SheetNames.includes("Categories")) {
            newState.categories = XLSX.utils.sheet_to_json(workbook.Sheets["Categories"]) as Category[];
          }
          if (workbook.SheetNames.includes("Locations")) {
            newState.locations = XLSX.utils.sheet_to_json(workbook.Sheets["Locations"]) as Location[];
          }

          // Validation
          if (newState.items.length === 0 && newState.categories.length === 0 && newState.locations.length === 0) {
            throw new Error("Excel file is empty or has invalid sheet names (Expected: Items, Categories, Locations)");
          }

          await this.saveData(newState);
          resolve();
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsArrayBuffer(file);
    });
  },
};