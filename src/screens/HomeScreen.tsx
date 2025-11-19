import { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/SearchBar";
import { FilterChips } from "@/components/FilterChips";
import { ItemCard } from "@/components/ItemCard";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { BulkActionBar } from "@/components/BulkActionBar";
import { storage } from "@/data/storage";
import { inventoryLogic } from "@/logic/inventoryLogic";
import { Item, Category, Location } from "@/types";
import { useNavigate } from "react-router-dom";

export const HomeScreen = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState<string | null>(null);
  
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Initialize storage and load data
  useEffect(() => {
    storage.initialize();
    loadData();
  }, []);

  const loadData = () => {
    setItems(storage.getItems());
    setCategories(storage.getCategories());
    setLocations(storage.getLocations());
  };

  // Filter items
  const filteredItems = (() => {
    let result = inventoryLogic.searchItems(items, searchQuery);
    result = inventoryLogic.filterItems(result, categoryFilter, locationFilter);
    return result;
  })();

  // Get counts for filters
  const categoryCounts = inventoryLogic.getCategoryCounts(items);
  const locationCounts = inventoryLogic.getLocationCounts(items);

  const handleCategoryFilter = (category: string) => {
    setCategoryFilter(category || null);
  };

  const handleLocationFilter = (location: string) => {
    setLocationFilter(location || null);
  };

  const handleItemClick = (item: Item) => {
    navigate(`/item/${item.id}`);
  };

  const handleLongPress = (itemId: string) => {
    setSelectionMode(true);
    setSelectedIds([itemId]);
  };

  const toggleSelection = (itemId: string) => {
    setSelectedIds((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const handleBulkMove = () => {
    // This would open a location picker dialog
    // For now, we'll just show a placeholder
    alert("Location picker would open here");
  };

  const cancelSelection = () => {
    setSelectionMode(false);
    setSelectedIds([]);
  };

  const uniqueLocations = Array.from(new Set(items.map((i) => i.location))).length;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="safe-top bg-card border-b sticky top-0 z-30 shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-2xl font-bold">My Stuff</h1>
              <p className="text-sm text-muted-foreground">
                {items.length} items in {uniqueLocations} location{uniqueLocations !== 1 ? "s" : ""}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/settings")}
              className="touch-target"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
          
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search your items..."
          />
        </div>

        {/* Filters */}
        <div className="px-4 pb-4 space-y-4">
          <FilterChips
            label="Categories"
            chips={categories.map((cat) => ({
              id: cat.id,
              label: cat.name,
              icon: cat.icon,
              count: categoryCounts[cat.name] || 0,
            }))}
            activeChip={categoryFilter}
            onChipClick={handleCategoryFilter}
          />
          
          <FilterChips
            label="Locations"
            chips={locations.map((loc) => ({
              id: loc.id,
              label: loc.name,
              icon: loc.icon,
              count: locationCounts[loc.name] || 0,
            }))}
            activeChip={locationFilter}
            onChipClick={handleLocationFilter}
          />
        </div>
      </header>

      {/* Items List */}
      <div className="px-4 py-4 space-y-3">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No items found</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              categories={categories}
              locations={locations}
              onClick={() => handleItemClick(item)}
              onLongPress={() => handleLongPress(item.id)}
              isSelectionMode={selectionMode}
              isSelected={selectedIds.includes(item.id)}
              onSelectToggle={() => toggleSelection(item.id)}
            />
          ))
        )}
      </div>

      {/* FAB */}
      {!selectionMode && (
        <FloatingActionButton onClick={() => navigate("/item/new")} />
      )}

      {/* Bulk Action Bar */}
      {selectionMode && (
        <BulkActionBar
          selectedCount={selectedIds.length}
          onMove={handleBulkMove}
          onCancel={cancelSelection}
        />
      )}
    </div>
  );
};
