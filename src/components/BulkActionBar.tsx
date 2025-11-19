import { ArrowRight, X } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface BulkActionBarProps {
  selectedCount: number;
  onMove: () => void;
  onCancel: () => void;
}

export const BulkActionBar = ({ selectedCount, onMove, onCancel }: BulkActionBarProps) => {
  return (
    <Card className="fixed bottom-0 left-0 right-0 safe-bottom z-40 rounded-t-2xl rounded-b-none border-t shadow-xl">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-5 w-5" />
          </Button>
          <span className="font-semibold">
            {selectedCount} item{selectedCount !== 1 ? "s" : ""} selected
          </span>
        </div>
        <Button onClick={onMove} size="lg">
          <ArrowRight className="h-5 w-5 mr-2" />
          Move
        </Button>
      </div>
    </Card>
  );
};
