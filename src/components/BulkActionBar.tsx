import { ArrowRight, X } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface BulkActionBarProps {
  selectedCount: number;
  onMove: () => void;
  onCancel: () => void;
  onToggleSelectAll: () => void;
  areAllSelected: boolean;
}

export const BulkActionBar = ({
  selectedCount,
  onMove,
  onCancel,
  onToggleSelectAll,
  areAllSelected,
}: BulkActionBarProps) => {
  return (
    <Card className="fixed bottom-4 left-4 right-4 safe-bottom z-40 rounded-2xl border shadow-xl">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-5 w-5" />
          </Button>
          <div>
            <span className="font-semibold block">
              {selectedCount} item{selectedCount !== 1 ? "s" : ""} selected
            </span>
            <Button variant="link" className="p-0 h-auto text-xs" onClick={onToggleSelectAll}>
              {areAllSelected ? "Deselect All" : "Select All"}
            </Button>
          </div>
        </div>
        <Button onClick={onMove} size="lg">
          <ArrowRight className="h-5 w-5 mr-2" />
          Move
        </Button>
      </div>
    </Card>
  );
};