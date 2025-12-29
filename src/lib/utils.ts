import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getCategoryBadgeColor = (categoryName?: string) => {
  if (!categoryName) return "bg-secondary text-secondary-foreground";
  const colorMap = {
    "Gadgets": "bg-blue-50 text-blue-800 hover:bg-blue-100",
    "Personal": "bg-orange-50 text-orange-800 hover:bg-orange-100",
    "Apparel": "bg-green-50 text-green-800 hover:bg-green-100",
    "Camera": "bg-yellow-50 text-yellow-800 hover:bg-yellow-100",
    "Other": "bg-gray-100 text-gray-800 hover:bg-gray-200",
    "Train": "bg-red-50 text-red-800 hover:bg-red-100",
  };
  return colorMap[categoryName as keyof typeof colorMap] || "bg-secondary text-secondary-foreground";
};

export const getColorClasses = (color?: string) => {
  if (!color) return "bg-secondary text-secondary-foreground border-transparent";

  // Map simple color names to Tailwind classes
  // We use a comprehensive map to ensure Tailwind scans these classes
  const colorMap: Record<string, string> = {
    slate: "bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200",
    gray: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200",
    zinc: "bg-zinc-100 text-zinc-800 border-zinc-200 hover:bg-zinc-200",
    neutral: "bg-neutral-100 text-neutral-800 border-neutral-200 hover:bg-neutral-200",
    stone: "bg-stone-100 text-stone-800 border-stone-200 hover:bg-stone-200",
    red: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200",
    orange: "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200",
    amber: "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200",
    yellow: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200",
    lime: "bg-lime-100 text-lime-800 border-lime-200 hover:bg-lime-200",
    green: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
    emerald: "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200",
    teal: "bg-teal-100 text-teal-800 border-teal-200 hover:bg-teal-200",
    cyan: "bg-cyan-100 text-cyan-800 border-cyan-200 hover:bg-cyan-200",
    sky: "bg-sky-100 text-sky-800 border-sky-200 hover:bg-sky-200",
    blue: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
    indigo: "bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200",
    violet: "bg-violet-100 text-violet-800 border-violet-200 hover:bg-violet-200",
    purple: "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200",
    fuchsia: "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200 hover:bg-fuchsia-200",
    pink: "bg-pink-100 text-pink-800 border-pink-200 hover:bg-pink-200",
    rose: "bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-200",
  };

  return colorMap[color] || "bg-secondary text-secondary-foreground border-transparent";
};
