import { AppState, Item, Category, Location } from "@/types";
import { seedItems, seedCategories, seedLocations } from "./seedData";

const STORAGE_KEY = "inventory_app_data";

export const storage = {
  // Initialize storage with seed data if empty
  initialize(): void {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (!existing) {
      const initialState: AppState = {
        items: seedItems,
        categories: seedCategories,
        locations: seedLocations,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialState));
    }
  },

  // Get all data
  getData(): AppState {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      this.initialize();
      return this.getData();
    }
    return JSON.parse(data);
  },

  // Save all data
  saveData(state: AppState): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  },

  // Items
  getItems(): Item[] {
    return this.getData().items;
  },

  saveItems(items: Item[]): void {
    const state = this.getData();
    state.items = items;
    this.saveData(state);
  },

  addItem(item: Item): void {
    const items = this.getItems();
    items.push(item);
    this.saveItems(items);
  },

  updateItem(id: string, updates: Partial<Item>): void {
    const items = this.getItems();
    const index = items.findIndex((item) => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updates };
      this.saveItems(items);
    }
  },

  deleteItem(id: string): void {
    const items = this.getItems().filter((item) => item.id !== id);
    this.saveItems(items);
  },

  // Categories
  getCategories(): Category[] {
    return this.getData().categories;
  },

  saveCategories(categories: Category[]): void {
    const state = this.getData();
    state.categories = categories;
    this.saveData(state);
  },

  addCategory(category: Category): void {
    const categories = this.getCategories();
    categories.push(category);
    this.saveCategories(categories);
  },

  updateCategory(id: string, updates: Partial<Category>): void {
    const categories = this.getCategories();
    const index = categories.findIndex((cat) => cat.id === id);
    if (index !== -1) {
      categories[index] = { ...categories[index], ...updates };
      this.saveCategories(categories);
    }
  },

  deleteCategory(id: string): void {
    const categories = this.getCategories().filter((cat) => cat.id !== id);
    this.saveCategories(categories);
  },

  // Locations
  getLocations(): Location[] {
    return this.getData().locations;
  },

  saveLocations(locations: Location[]): void {
    const state = this.getData();
    state.locations = locations;
    this.saveData(state);
  },

  addLocation(location: Location): void {
    const locations = this.getLocations();
    locations.push(location);
    this.saveLocations(locations);
  },

  updateLocation(id: string, updates: Partial<Location>): void {
    const locations = this.getLocations();
    const index = locations.findIndex((loc) => loc.id === id);
    if (index !== -1) {
      locations[index] = { ...locations[index], ...updates };
      this.saveLocations(locations);
    }
  },

  deleteLocation(id: string): void {
    const locations = this.getLocations().filter((loc) => loc.id !== id);
    this.saveLocations(locations);
  },
};
