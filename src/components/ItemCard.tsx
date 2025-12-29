import { useRef } from "react";
import { Item, Category, Location } from "@/types";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { cn, getCategoryBadgeColor, getColorClasses } from "@/lib/utils";
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

  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const startPos = useRef({ x: 0, y: 0 });

  const handleStart = (x: number, y: number) => {
    startPos.current = { x, y };
    pressTimer.current = setTimeout(() => {
      if (onLongPress) {
        onLongPress();
        // Haptic feedback (if supported)
        if (window.navigator.vibrate) {
          window.navigator.vibrate(50);
        }
      }
    }, 500);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX, e.clientY);
  };

  const handleMove = (x: number, y: number) => {
    if (!pressTimer.current) return;
    const moveX = Math.abs(x - startPos.current.x);
    const moveY = Math.abs(y - startPos.current.y);

    // If moved more than 10px, cancel the long press
    if (moveX > 10 || moveY > 10) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  };

  const handleEnd = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
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
        "mobile-card p-4 mobile-transition cursor-pointer relative overflow-hidden",
        "active:scale-[0.98] select-none", // Removed touch-none to allow scrolling
        "border-border/50 shadow-sm hover:shadow-md hover:border-primary/20", // Enhanced border and shadow
        isSelected && "ring-2 ring-primary bg-accent/50 border-primary"
      )}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
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
            <Badge
              variant="outline"
              className={cn("text-xs border-0", getCategoryBadgeColor(item.category))}
            >
              {category?.icon} {item.category}
            </Badge>
            <Badge
              variant="outline"
              className={cn("text-xs border-0", getColorClasses(location?.color))}
            >
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
