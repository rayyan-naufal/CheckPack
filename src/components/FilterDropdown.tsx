import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, getColorClasses } from "@/lib/utils";
import { Category, Location } from "@/types";

interface FilterDropdownProps {
  locations: Location[];
  categories: Category[];
  categoryCounts: Record<string, number>;
  locationCounts: Record<string, number>;
  selectedLocation: string | null;
  selectedCategory: string | null;
  onLocationChange: (location: string) => void;
  onCategoryChange: (category: string) => void;
}

export function FilterDropdown({
  locations,
  categories,
  categoryCounts,
  locationCounts,
  selectedLocation,
  selectedCategory,
  onLocationChange,
  onCategoryChange,
}: FilterDropdownProps) {

  const getCategoryColorClasses = (categoryName: string, isSelected: boolean) => {
    const colorMap = {
      "Gadgets": {
        selected: "bg-blue-500 hover:bg-blue-600 text-white border-blue-500",
        unselected: "bg-blue-50 hover:bg-blue-100 text-blue-800 border-blue-200"
      },
      "Personal": {
        selected: "bg-orange-500 hover:bg-orange-600 text-white border-orange-500",
        unselected: "bg-orange-50 hover:bg-orange-100 text-orange-800 border-orange-200"
      },
      "Apparel": {
        selected: "bg-green-500 hover:bg-green-600 text-white border-green-500",
        unselected: "bg-green-50 hover:bg-green-100 text-green-800 border-green-200"
      },
      "Camera": {
        selected: "bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500",
        unselected: "bg-yellow-50 hover:bg-yellow-100 text-yellow-800 border-yellow-200"
      },
      "Other": {
        selected: "bg-gray-500 hover:bg-gray-600 text-white border-gray-500",
        unselected: "bg-gray-50 hover:bg-gray-100 text-gray-800 border-gray-200"
      },
      "Train": {
        selected: "bg-red-500 hover:bg-red-600 text-white border-red-500",
        unselected: "bg-red-50 hover:bg-red-100 text-red-800 border-red-200"
      }
    };

    const defaultColors = {
      selected: "bg-primary text-primary-foreground",
      unselected: "bg-card hover:bg-muted"
    };

    const category = colorMap[categoryName as keyof typeof colorMap] || defaultColors;
    return isSelected ? category.selected : category.unselected;
  };

  const handleSelect = (e: Event) => {
    e.preventDefault();
  }

  return (
    <div className="flex gap-2.5 overflow-x-auto whitespace-nowrap p-0">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="rounded-full">
            Filter
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 max-h-[60vh] overflow-y-auto" onCloseAutoFocus={handleSelect}>
          <DropdownMenuLabel>Locations</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={selectedLocation || ""}
            onValueChange={onLocationChange}
          >
            <DropdownMenuRadioItem value="">All Locations</DropdownMenuRadioItem>
            {locations.map((location) => (
              <DropdownMenuRadioItem
                key={location.id}
                value={location.name}
                className="py-3"
              >
                <Badge
                  variant={selectedLocation === location.name ? "default" : "outline"}
                  className={cn(
                    "touch-target px-4 cursor-pointer whitespace-nowrap mobile-transition w-full justify-between",
                    selectedLocation === location.name
                      ? "bg-primary text-primary-foreground"
                      : getColorClasses(location.color)
                  )}
                >
                  <span className="flex items-center">
                    {location.icon && <span className="mr-1.5">{location.icon}</span>}
                    {location.name}
                  </span>
                  <span className="ml-1.5 text-xs opacity-70">({locationCounts[location.name] || 0})</span>
                </Badge>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>

          <DropdownMenuSeparator />

          <DropdownMenuLabel>Categories</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={selectedCategory || ""}
            onValueChange={onCategoryChange}
          >
            <DropdownMenuRadioItem value="">All Categories</DropdownMenuRadioItem>
            {categories.map((category) => (
              <DropdownMenuRadioItem
                key={category.id}
                value={category.name}
                className="py-3"
              >
                <Badge
                  className={cn(
                    "touch-target px-4 cursor-pointer whitespace-nowrap mobile-transition w-full justify-between border",
                    getCategoryColorClasses(category.name, selectedCategory === category.name)
                  )}
                >
                  <span className="flex items-center">
                    {category.icon && <span className="mr-1.5">{category.icon}</span>}
                    {category.name}
                  </span>
                  <span className="ml-1.5 text-xs opacity-70">({categoryCounts[category.name] || 0})</span>
                </Badge>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {(selectedLocation || selectedCategory) && (
        <div className="flex items-center gap-2">
          {selectedLocation && (
            <Button variant="outline" className="rounded-full" onClick={() => onLocationChange("")}>
              Location: {selectedLocation} &times;
            </Button>
          )}
          {selectedCategory && (
            <Button variant="outline" className="rounded-full" onClick={() => onCategoryChange("")}>
              Category: {selectedCategory} &times;
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
