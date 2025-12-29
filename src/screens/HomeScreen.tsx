import { useState } from "react";
import { Virtuoso } from "react-virtuoso";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/SearchBar";
import { FilterDropdown } from "@/components/FilterDropdown";
import { ItemCard } from "@/components/ItemCard";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { BulkActionBar } from "@/components/BulkActionBar";
import { inventoryLogic } from "@/logic/inventoryLogic";
import { Item } from "@/types";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LocationPicker } from "@/components/LocationPicker";
import { useItems, useCategories, useLocations, useSaveItems } from "@/hooks/useInventory";

export const HomeScreen = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // React Query Hooks
  const { data: items = [] } = useItems();
  const { data: categories = [] } = useCategories();
  const { data: locations = [] } = useLocations();
  const { mutateAsync: saveItems } = useSaveItems();

  const [searchQuery, setSearchQuery] = useState("");

  // Read filters from URL
  const categoryFilter = searchParams.get("category");
  const locationFilter = searchParams.get("location");

  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [locationPickerOpen, setLocationPickerOpen] = useState(false);

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
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (category) {
        newParams.set("category", category);
      } else {
        newParams.delete("category");
      }
      return newParams;
    });
  };

  const handleLocationFilter = (location: string) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (location) {
        newParams.set("location", location);
      } else {
        newParams.delete("location");
      }
      return newParams;
    });
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
    setLocationPickerOpen(true);
  };

  const handlePickLocation = async (locationName: string) => {
    // Determine new state optimistically or just compute it
    const updatedItems = items.map(item => {
      if (selectedIds.includes(item.id)) {
        return { ...item, location: locationName };
      }
      return item;
    });

    await saveItems(updatedItems);

    setSelectionMode(false);
    setSelectedIds([]);
  };

  const cancelSelection = () => {
    setSelectionMode(false);
    setSelectedIds([]);
  };

  const areAllSelected =
    filteredItems.length > 0 && selectedIds.length === filteredItems.length;

  const handleToggleSelectAll = () => {
    if (areAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredItems.map((item) => item.id));
    }
  };

  const uniqueLocations = Array.from(new Set(items.map((i) => i.location))).length;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="safe-top bg-header-gradient sticky top-0 z-30 shadow-sm">
        <div className="px-4 py-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                My Stuff
              </h1>
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
        <div className="px-4 pb-0 space-y-0">
          <FilterDropdown
            categories={categories}
            locations={locations}
            categoryCounts={categoryCounts}
            locationCounts={locationCounts}
            selectedCategory={categoryFilter}
            selectedLocation={locationFilter}
            onCategoryChange={handleCategoryFilter}
            onLocationChange={handleLocationFilter}
          />
        </div>
      </header>

      {/* Items List */}
      <div className="px-4 py-4 min-h-[calc(100vh-140px)]">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <span className="text-3xl">📦</span>
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">No items found</h3>
              <p className="text-muted-foreground max-w-[250px]">
                {searchQuery
                  ? "Try adjusting your search or filters"
                  : "Start adding your stuff to keep track of it!"}
              </p>
            </div>
            {!searchQuery && (
              <Button onClick={() => navigate("/item/new")}>
                Add First Item
              </Button>
            )}
          </div>
        ) : (
          <Virtuoso
            useWindowScroll
            data={filteredItems}
            itemContent={(index, item) => (
              <div className="mb-3">
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
              </div>
            )}
          />
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
          onToggleSelectAll={handleToggleSelectAll}
          areAllSelected={areAllSelected}
        />
      )}

      <LocationPicker
        open={locationPickerOpen}
        onOpenChange={setLocationPickerOpen}
        locations={locations}
        onPick={handlePickLocation}
        selectedCount={selectedIds.length}
      />
    </div>
  );
};
