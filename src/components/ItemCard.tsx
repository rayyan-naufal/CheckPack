import { Item, Category, Location } from "@/types";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { Checkbox } from "./ui/checkbox";

interface ItemCardProps {
  item: Item;
  categories: Category[];
  locations: Location[];
  onClick: () => void;
  onLongPress?: () => void;
  isSelectionMode?: boolean;
  isSelected?: boolean;
  onSelectToggle?: () => void;
}

export const ItemCard = ({
  item,
  categories,
  locations,
  onClick,
  onLongPress,
  isSelectionMode = false,
  isSelected = false,
  onSelectToggle,
}: ItemCardProps) => {
  const category = categories.find((c) => c.name === item.category);
  const location = locations.find((l) => l.name === item.location);

  let pressTimer: NodeJS.Timeout;

  const handleTouchStart = () => {
    pressTimer = setTimeout(() => {
      if (onLongPress) {
        onLongPress();
        // Haptic feedback (if supported)
        if (window.navigator.vibrate) {
          window.navigator.vibrate(50);
        }
      }
    }, 500);
  };

  const handleTouchEnd = () => {
    clearTimeout(pressTimer);
  };

  const handleClick = () => {
    if (isSelectionMode && onSelectToggle) {
      onSelectToggle();
    } else {
      onClick();
    }
  };

  return (
    <Card
      className={cn(
        "mobile-card p-4 mobile-transition cursor-pointer active:scale-[0.98]",
        isSelected && "ring-2 ring-primary bg-accent/50"
      )}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
    >
      <div className="flex items-start gap-3">
        {isSelectionMode && (
          <Checkbox
            checked={isSelected}
            onCheckedChange={onSelectToggle}
            className="mt-1"
          />
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-base truncate">{item.name}</h3>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant="secondary" className="text-xs">
              {category?.icon} {item.category}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {location?.icon} {item.location}
            </Badge>
          </div>

          {item.note && (
            <p className="text-sm text-muted-foreground line-clamp-2">{item.note}</p>
          )}
        </div>
      </div>
    </Card>
  );
};
