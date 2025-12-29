import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

// Curated list of 10 distinct colors + Slate
export const COLORS = [
    "slate",
    "red",
    "orange",
    "amber",
    "green",
    "teal",
    "blue",
    "indigo",
    "purple",
    "pink",
];

// Explicit mapping to ensure Tailwind scans these classes
const COLOR_CLASSES: Record<string, string> = {
    slate: "bg-slate-500",
    red: "bg-red-500",
    orange: "bg-orange-500",
    amber: "bg-amber-500",
    green: "bg-green-500",
    teal: "bg-teal-500",
    blue: "bg-blue-500",
    indigo: "bg-indigo-500",
    purple: "bg-purple-500",
    pink: "bg-pink-500",
};

interface ColorPickerProps {
    selectedColor?: string;
    onSelect: (color: string) => void;
}

export const ColorPicker = ({ selectedColor, onSelect }: ColorPickerProps) => {
    return (
        <div className="grid grid-cols-5 gap-4">
            {COLORS.map((color) => {
                const bgClass = COLOR_CLASSES[color] || "bg-slate-500";

                return (
                    <button
                        key={color}
                        type="button"
                        onClick={() => onSelect(color)}
                        className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-sm",
                            bgClass,
                            selectedColor === color
                                ? "ring-4 ring-offset-2 ring-primary scale-110 shadow-md"
                                : "hover:scale-110 hover:shadow-md opacity-90 hover:opacity-100"
                        )}
                        aria-label={`Select ${color}`}
                    >
                        {selectedColor === color && <Check className="w-6 h-6 text-white stroke-[3]" />}
                    </button>
                );
            })}
        </div>
    );
};
