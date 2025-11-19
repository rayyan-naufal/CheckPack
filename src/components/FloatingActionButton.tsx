import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface FloatingActionButtonProps {
  onClick: () => void;
  className?: string;
}

export const FloatingActionButton = ({ onClick, className }: FloatingActionButtonProps) => {
  return (
    <Button
      size="lg"
      className={cn(
        "fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-xl z-50",
        "active:scale-95 mobile-transition",
        className
      )}
      onClick={onClick}
    >
      <Plus className="h-6 w-6" />
    </Button>
  );
};
