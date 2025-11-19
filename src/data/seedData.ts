import { Item, Category, Location } from "@/types";

export const seedItems: Item[] = [
  { id: "1", category: "Apparel", name: "Smart watch", location: "Jakarta", note: "rope belt" },
  { id: "2", category: "Apparel", name: "Dompet", location: "Jakarta", note: "bekasi to jakarta" },
  { id: "3", category: "Gadgets", name: "Laptop", location: "Jakarta", note: "" },
  { id: "4", category: "Gadgets", name: "Laptop Charger", location: "Jakarta", note: "" },
  { id: "5", category: "Personal", name: "Perfume", location: "Jakarta", note: "" },
  { id: "6", category: "Gadgets", name: "Powerbank", location: "Bekasi", note: "" },
  { id: "7", category: "Camera", name: "Camera", location: "Jakarta", note: "" },
  { id: "8", category: "Camera", name: "Lens cleaning kit", location: "Jakarta", note: "" },
];

export const seedCategories: Category[] = [
  { id: "cat-1", name: "Apparel", icon: "👕" },
  { id: "cat-2", name: "Gadgets", icon: "📱" },
  { id: "cat-3", name: "Personal", icon: "💼" },
  { id: "cat-4", name: "Camera", icon: "📷" },
];

export const seedLocations: Location[] = [
  { id: "loc-1", name: "Jakarta", icon: "🏙️" },
  { id: "loc-2", name: "Bekasi", icon: "🏠" },
  { id: "loc-3", name: "Travel Bag", icon: "🎒" },
];
