import * as React from "react";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "./ui/drawer";
import { Location } from "@/types";
import { cn, getColorClasses } from "@/lib/utils";

interface LocationPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locations: Location[];
  onPick: (locationName: string) => void;
  selectedCount: number;
}

export const LocationPicker = ({
  open,
  onOpenChange,
  locations,
  onPick,
  selectedCount,
}: LocationPickerProps) => {
  const [confirmLocation, setConfirmLocation] = React.useState<Location | null>(null);

  // Reset state when drawer closes
  React.useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => setConfirmLocation(null), 300); // Wait for animation
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handlePick = (location: Location) => {
    setConfirmLocation(location);
  };

  const handleConfirm = () => {
    if (confirmLocation) {
      onPick(confirmLocation.name);
      onOpenChange(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle className="text-center text-xl">
              {confirmLocation ? "Confirm Move" : "Move Items To..."}
            </DrawerTitle>
            <DrawerDescription className="text-center">
              {confirmLocation
                ? `Are you sure you want to move ${selectedCount} item${selectedCount !== 1 ? "s" : ""} to ${confirmLocation.name}?`
                : "Select a new location for the selected items."}
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-4 pb-0">
            {confirmLocation ? (
              <div className="flex flex-col gap-4">
                <div
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 p-6 rounded-lg border-2 bg-accent/50",
                    getColorClasses(confirmLocation.color)
                  )}
                >
                  <span className="text-5xl">{confirmLocation.icon}</span>
                  <span className="font-medium text-lg">{confirmLocation.name}</span>
                </div>
                <Button onClick={handleConfirm} size="lg" className="w-full text-lg h-12">
                  Confirm Move
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {locations.map((loc) => (
                  <Button
                    key={loc.id}
                    variant="outline"
                    className={cn(
                      "h-24 flex flex-col items-center justify-center gap-2 border-2 hover:border-primary/50 hover:bg-accent mobile-transition",
                      "active:scale-95",
                      getColorClasses(loc.color)
                    )}
                    onClick={() => handlePick(loc)}
                  >
                    <span className="text-3xl">{loc.icon}</span>
                    <span className="font-medium truncate w-full text-center px-2">
                      {loc.name}
                    </span>
                  </Button>
                ))}
              </div>
            )}
          </div>

          <DrawerFooter>
            {confirmLocation ? (
              <Button
                variant="outline"
                className="w-full h-12 text-base"
                onClick={() => setConfirmLocation(null)}
              >
                Back
              </Button>
            ) : (
              <DrawerClose asChild>
                <Button variant="outline" className="w-full h-12 text-base">
                  Cancel
                </Button>
              </DrawerClose>
            )}
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default LocationPicker;
