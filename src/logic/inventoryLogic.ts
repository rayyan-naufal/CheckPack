import { Item } from "@/types";

export const inventoryLogic = {
  // Filter items by search query
  searchItems(items: Item[], query: string): Item[] {
    if (!query.trim()) return items;
    
    const lowerQuery = query.toLowerCase();
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(lowerQuery) ||
        item.category.toLowerCase().includes(lowerQuery) ||
        item.location.toLowerCase().includes(lowerQuery) ||
        item.note.toLowerCase().includes(lowerQuery)
    );
  },

  // Filter by category and location
  filterItems(
    items: Item[],
    categoryFilter: string | null,
    locationFilter: string | null
  ): Item[] {
    let filtered = [...items];

    if (categoryFilter) {
      filtered = filtered.filter((item) => item.category === categoryFilter);
    }

    if (locationFilter) {
      filtered = filtered.filter((item) => item.location === locationFilter);
    }

    return filtered;
  },

  // Get item count by location
  getLocationCounts(items: Item[]): Record<string, number> {
    const counts: Record<string, number> = {};
    items.forEach((item) => {
      counts[item.location] = (counts[item.location] || 0) + 1;
    });
    return counts;
  },

  // Get item count by category
  getCategoryCounts(items: Item[]): Record<string, number> {
    const counts: Record<string, number> = {};
    items.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  },

  // Bulk transfer items
  bulkTransferItems(items: Item[], itemIds: string[], newLocation: string): Item[] {
    return items.map((item) =>
      itemIds.includes(item.id) ? { ...item, location: newLocation } : item
    );
  },

  // Transfer all items from one location to another
  transferAllByLocation(items: Item[], fromLocation: string, toLocation: string): Item[] {
    return items.map((item) =>
      item.location === fromLocation ? { ...item, location: toLocation } : item
    );
  },

  // Generate unique ID
  generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },
};
