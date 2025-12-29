import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Pencil, Trash2, Download, Upload, FileJson, Copy, ChevronRight, Boxes, MapPin, Database, FileSpreadsheet, FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { storage } from "@/data/storage";
import { inventoryLogic } from "@/logic/inventoryLogic";
import { Category, Location, AppState } from "@/types";
import { toast } from "sonner";
import { ColorPicker } from "@/components/ColorPicker";
import {
  useCategories, useLocations,
  useAddCategory, useUpdateCategory, useDeleteCategory,
  useAddLocation, useUpdateLocation, useDeleteLocation,
  useImportData, useExportExcel, useImportExcel
} from "@/hooks/useInventory";

export const SettingsScreen = () => {
  const navigate = useNavigate();
  const { section } = useParams<{ section?: "categories" | "locations" | "data" }>();

  // React Query Hooks
  const { data: categories = [] } = useCategories();
  const { data: locations = [] } = useLocations();

  const addCategoryMutation = useAddCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  const addLocationMutation = useAddLocation();
  const updateLocationMutation = useUpdateLocation();
  const deleteLocationMutation = useDeleteLocation();

  const importDataMutation = useImportData();
  const exportExcelMutation = useExportExcel();
  const importExcelMutation = useImportExcel();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState<"add" | "edit">("add");
  const [editType, setEditType] = useState<"category" | "location">("category");
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", icon: "", color: "" });

  // Backup State
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importData, setImportData] = useState("");

  const openAddDialog = (type: "category" | "location") => {
    setEditMode("add");
    setEditType(type);
    setFormData({ name: "", icon: "", color: "" });
    setDialogOpen(true);
  };

  const openEditDialog = (type: "category" | "location", item: Category | Location) => {
    setEditMode("edit");
    setEditType(type);
    setEditId(item.id);
    setFormData({ name: item.name, icon: item.icon, color: item.color || "" });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Please enter a name");
      return;
    }

    if (editMode === "add") {
      const newItem = {
        id: inventoryLogic.generateId(),
        name: formData.name,
        icon: formData.icon || "📦",
        color: formData.color,
      };

      if (editType === "category") {
        await addCategoryMutation.mutateAsync(newItem);
      } else {
        await addLocationMutation.mutateAsync(newItem);
      }
    } else if (editId) {
      if (editType === "category") {
        await updateCategoryMutation.mutateAsync({ id: editId, updates: formData });
      } else {
        await updateLocationMutation.mutateAsync({ id: editId, updates: formData });
      }
    }

    setDialogOpen(false);
  };

  const handleDelete = async (type: "category" | "location", id: string) => {
    if (window.confirm("Are you sure you want to delete this?")) {
      if (type === "category") {
        await deleteCategoryMutation.mutateAsync(id);
      } else {
        await deleteLocationMutation.mutateAsync(id);
      }
    }
  };

  const handleExport = async () => {
    try {
      const data = await storage.getData();
      const jsonString = JSON.stringify(data, null, 2);
      await navigator.clipboard.writeText(jsonString);
      toast.success("Data copied to clipboard!");
    } catch (error) {
      toast.error("Failed to export data");
      console.error(error);
    }
  };

  const handleImport = async () => {
    try {
      if (!importData.trim()) {
        toast.error("Please paste valid JSON data");
        return;
      }

      const parsedData: AppState = JSON.parse(importData);

      // Basic validation
      if (!Array.isArray(parsedData.items) || !Array.isArray(parsedData.categories) || !Array.isArray(parsedData.locations)) {
        throw new Error("Invalid data format");
      }

      await importDataMutation.mutateAsync(parsedData);
      setImportDialogOpen(false);
      setImportData("");
      toast.success("Data restored successfully!");
    } catch (error: any) {
      if (error instanceof SyntaxError) {
        toast.error("Format JSON tidak valid. Pastikan copy-paste sudah benar.");
      } else {
        toast.error("Gagal menyimpan ke database: " + error.message);
      }
      console.error(error);
    }
  };

  const handleBack = () => {
    if (section) {
      navigate("/settings");
    } else {
      navigate("/");
    }
  };

  const getTitle = () => {
    if (!section) return "Settings";
    switch (section) {
      case "categories": return "Categories";
      case "locations": return "Locations";
      case "data": return "Data Management";
      default: return "Settings";
    }
  };

  // Helper component for settings menu item
  const SettingsMenuItem = ({
    icon: Icon,
    label,
    onClick,
    className
  }: {
    icon: any,
    label: string,
    onClick: () => void,
    className?: string
  }) => (
    <Button
      variant="ghost"
      className={`w-full justify-between h-14 text-lg font-normal px-4 ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <Icon className="h-5 w-5 text-muted-foreground" />
        <span>{label}</span>
      </div>
      <ChevronRight className="h-5 w-5 text-muted-foreground/50" />
    </Button>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="safe-top bg-header-gradient sticky top-0 z-30 shadow-sm">
        <div className="flex items-center justify-between px-4 py-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="touch-target"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold capitalize">{getTitle()}</h1>
          <div className="w-10" />
        </div>
      </header>

      {/* Content */}
      <div className="px-4 py-6">
        {/* Main Settings Menu */}
        {!section && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-sm font-medium text-muted-foreground px-4">Content</h2>
              <Card className="p-1 space-y-1">
                <SettingsMenuItem
                  icon={Boxes}
                  label="Categories"
                  onClick={() => navigate("/settings/categories")}
                />
                <SettingsMenuItem
                  icon={MapPin}
                  label="Locations"
                  onClick={() => navigate("/settings/locations")}
                />
              </Card>
            </div>

            <div className="space-y-2">
              <h2 className="text-sm font-medium text-muted-foreground px-4">System</h2>
              <Card className="p-1">
                <SettingsMenuItem
                  icon={Database}
                  label="Data Management"
                  onClick={() => navigate("/settings/data")}
                />
              </Card>
            </div>
          </div>
        )}

        {/* Categories Section */}
        {section === "categories" && (
          <div className="space-y-3">
            <Button
              onClick={() => openAddDialog("category")}
              className="w-full h-12"
              size="lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Category
            </Button>

            {categories.map((cat) => (
              <Card key={cat.id} className="p-4 border-none shadow-sm bg-card/50 hover:bg-accent/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{cat.icon}</span>
                    <span className="font-medium">{cat.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog("category", cat)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete("category", cat.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Locations Section */}
        {section === "locations" && (
          <div className="space-y-3">
            <Button
              onClick={() => openAddDialog("location")}
              className="w-full h-12"
              size="lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Location
            </Button>

            {locations.map((loc) => (
              <Card key={loc.id} className="p-4 border-none shadow-sm bg-card/50 hover:bg-accent/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{loc.icon}</span>
                    <span className="font-medium">{loc.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog("location", loc)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete("location", loc.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Data Section */}
        {section === "data" && (
          <div className="space-y-4">
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Download className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Export Data</h3>
                  <p className="text-sm text-muted-foreground">Copy your data to clipboard</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button onClick={handleExport} variant="outline">
                  <Copy className="h-4 w-4 mr-2" />
                  JSON to Clipboard
                </Button>
                <Button onClick={() => exportExcelMutation.mutate()} variant="outline" disabled={exportExcelMutation.isPending}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  {exportExcelMutation.isPending ? "Exporting..." : "Export Excel"}
                </Button>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-full">
                  <Upload className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Import Data</h3>
                  <p className="text-sm text-muted-foreground">Restore from JSON or Excel (Overwrites data)</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button onClick={() => setImportDialogOpen(true)} variant="outline">
                  <FileJson className="h-4 w-4 mr-2" />
                  Import JSON
                </Button>
                <div className="relative">
                  <input
                    type="file"
                    id="excel-import"
                    className="hidden"
                    accept=".xlsx, .xls"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        importExcelMutation.mutate(file);
                        e.target.value = ""; // Reset
                      }
                    }}
                  />
                  <Button
                    onClick={() => document.getElementById("excel-import")?.click()}
                    className="w-full"
                    variant="outline"
                    disabled={importExcelMutation.isPending}
                  >
                    <FileUp className="h-4 w-4 mr-2" />
                    {importExcelMutation.isPending ? "Importing..." : "Import Excel"}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editMode === "add" ? "Add" : "Edit"}{" "}
              {editType === "category" ? "Category" : "Location"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">Icon (emoji)</Label>
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="📦"
                maxLength={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Color</Label>
              <ColorPicker
                selectedColor={formData.color}
                onSelect={(color) => setFormData({ ...formData, color })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Data</DialogTitle>
            <DialogDescription>
              Paste your JSON data here. WARNING: This will replace all your current items, categories, and locations.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Textarea
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              placeholder='{"items": [], ...}'
              className="min-h-[200px] font-mono text-xs"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setImportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleImport} variant="destructive">
              Restore Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
