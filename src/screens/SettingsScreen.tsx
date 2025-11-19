import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { storage } from "@/data/storage";
import { inventoryLogic } from "@/logic/inventoryLogic";
import { Category, Location } from "@/types";
import { toast } from "sonner";

export const SettingsScreen = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState<"add" | "edit">("add");
  const [editType, setEditType] = useState<"category" | "location">("category");
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", icon: "" });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setCategories(storage.getCategories());
    setLocations(storage.getLocations());
  };

  const openAddDialog = (type: "category" | "location") => {
    setEditMode("add");
    setEditType(type);
    setFormData({ name: "", icon: "" });
    setDialogOpen(true);
  };

  const openEditDialog = (type: "category" | "location", item: Category | Location) => {
    setEditMode("edit");
    setEditType(type);
    setEditId(item.id);
    setFormData({ name: item.name, icon: item.icon });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error("Please enter a name");
      return;
    }

    if (editMode === "add") {
      const newItem = {
        id: inventoryLogic.generateId(),
        name: formData.name,
        icon: formData.icon || "📦",
      };

      if (editType === "category") {
        storage.addCategory(newItem);
        toast.success("Category added");
      } else {
        storage.addLocation(newItem);
        toast.success("Location added");
      }
    } else if (editId) {
      if (editType === "category") {
        storage.updateCategory(editId, formData);
        toast.success("Category updated");
      } else {
        storage.updateLocation(editId, formData);
        toast.success("Location updated");
      }
    }

    loadData();
    setDialogOpen(false);
  };

  const handleDelete = (type: "category" | "location", id: string) => {
    if (window.confirm("Are you sure you want to delete this?")) {
      if (type === "category") {
        storage.deleteCategory(id);
        toast.success("Category deleted");
      } else {
        storage.deleteLocation(id);
        toast.success("Location deleted");
      }
      loadData();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="safe-top bg-card border-b sticky top-0 z-30 shadow-sm">
        <div className="flex items-center justify-between px-4 py-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="touch-target"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Settings</h1>
          <div className="w-10" />
        </div>
      </header>

      {/* Content */}
      <div className="px-4 py-6">
        <Tabs defaultValue="categories" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="locations">Locations</TabsTrigger>
          </TabsList>

          <TabsContent value="categories" className="space-y-3">
            <Button
              onClick={() => openAddDialog("category")}
              className="w-full h-12"
              size="lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Category
            </Button>

            {categories.map((cat) => (
              <Card key={cat.id} className="mobile-card p-4">
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
          </TabsContent>

          <TabsContent value="locations" className="space-y-3">
            <Button
              onClick={() => openAddDialog("location")}
              className="w-full h-12"
              size="lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Location
            </Button>

            {locations.map((loc) => (
              <Card key={loc.id} className="mobile-card p-4">
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
          </TabsContent>
        </Tabs>
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
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
