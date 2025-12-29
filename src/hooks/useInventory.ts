import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { storage } from "@/data/storage";
import { Item, Category, Location, AppState } from "@/types";
import { toast } from "sonner";
import { Capacitor } from "@capacitor/core";
import { Share } from "@capacitor/share";
import { Filesystem, Directory } from "@capacitor/filesystem";

// Keys
export const QUERY_KEYS = {
    items: ["items"],
    categories: ["categories"],
    locations: ["locations"],
    all: ["inventory_data"],
};

// Helper for error handling
const handleError = (error: unknown, message: string) => {
    console.error(message, error);
    toast.error(message);
};

// --- Items Hooks ---

export const useItems = () => {
    return useQuery({
        queryKey: QUERY_KEYS.items,
        queryFn: () => storage.getItems(),
    });
};

export const useItem = (id: string) => {
    return useQuery({
        queryKey: QUERY_KEYS.items,
        queryFn: () => storage.getItems(),
        select: (items) => items.find((item) => item.id === id),
    });
};

export const useAddItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (item: Item) => storage.addItem(item),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.items });
            toast.success("Item added");
        },
        onError: (error) => handleError(error, "Failed to add item"),
    });
};

export const useUpdateItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: Partial<Item> }) =>
            storage.updateItem(id, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.items });
            toast.success("Item updated");
        },
        onError: (error) => handleError(error, "Failed to update item"),
    });
};

// Bulk update hook
export const useSaveItems = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (items: Item[]) => storage.saveItems(items),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.items });
            toast.success("Items updated");
        },
        onError: (error) => handleError(error, "Failed to update items"),
    });
};

export const useDeleteItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => storage.deleteItem(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.items });
            toast.success("Item deleted");
        },
        onError: (error) => handleError(error, "Failed to delete item"),
    });
};

// --- Categories Hooks ---

export const useCategories = () => {
    return useQuery({
        queryKey: QUERY_KEYS.categories,
        queryFn: () => storage.getCategories(),
    });
};

export const useAddCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (category: Category) => storage.addCategory(category),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories });
            toast.success("Category added");
        },
        onError: (error) => handleError(error, "Failed to add category"),
    });
};

export const useUpdateCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: Partial<Category> }) =>
            storage.updateCategory(id, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories });
            // Invalidate items too because of cascading renaming
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.items });
            toast.success("Category updated");
        },
        onError: (error) => handleError(error, "Failed to update category"),
    });
};

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => storage.deleteCategory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories });
            // Invalidate items too because of orphan handling
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.items });
            toast.success("Category deleted");
        },
        onError: (error) => handleError(error, "Failed to delete category"),
    });
};

// --- Locations Hooks ---

export const useLocations = () => {
    return useQuery({
        queryKey: QUERY_KEYS.locations,
        queryFn: () => storage.getLocations(),
    });
};

export const useAddLocation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (location: Location) => storage.addLocation(location),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.locations });
            toast.success("Location added");
        },
        onError: (error) => handleError(error, "Failed to add location"),
    });
};

export const useUpdateLocation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: Partial<Location> }) =>
            storage.updateLocation(id, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.locations });
            // Invalidate items too because of cascading renaming
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.items });
            toast.success("Location updated");
        },
        onError: (error) => handleError(error, "Failed to update location"),
    });
};

export const useDeleteLocation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => storage.deleteLocation(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.locations });
            // Invalidate items too because of orphan handling
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.items });
            toast.success("Location deleted");
        },
        onError: (error) => handleError(error, "Failed to delete location"),
    });
};

// --- Data Management Hooks ---

export const useImportData = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: AppState) => storage.saveData(data),
        onSuccess: () => {
            queryClient.invalidateQueries();
            toast.success("Data restored successfully!");
        },
        onError: (error) => handleError(error, "Failed to import data"),
    });
};

export const useExportExcel = () => {
    return useMutation({
        mutationFn: async () => {
            const fileName = `PackCheck_Export_${new Date().toISOString().split("T")[0]}.xlsx`;

            if (Capacitor.getPlatform() === "web") {
                const blob = await storage.exportToExcel();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = fileName;
                a.click();
                window.URL.revokeObjectURL(url);
            } else {
                const base64Data = await storage.exportToExcelBase64();
                const result = await Filesystem.writeFile({
                    path: fileName,
                    data: base64Data,
                    directory: Directory.Documents
                });

                toast.success(`Saved to Documents/${fileName}`);
            }
        },
        onSuccess: () => {
            if (Capacitor.getPlatform() === "web") {
                toast.success("Excel file exported!");
            }
        },
        onError: (error) => handleError(error, "Failed to export Excel"),
    });
};

export const useImportExcel = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (file: File) => storage.importFromExcel(file),
        onSuccess: () => {
            queryClient.invalidateQueries();
            toast.success("Data imported from Excel successfully!");
        },
        onError: (error) => handleError(error, "Failed to import Excel"),
    });
};
