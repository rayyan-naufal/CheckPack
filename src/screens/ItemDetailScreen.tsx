import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { storage } from "@/data/storage";
import { inventoryLogic } from "@/logic/inventoryLogic";
import { Item, Category, Location } from "@/types";
import { toast } from "sonner";

export const ItemDetailScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isNewItem = id === "new";

  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    location: "",
    note: "",
  });

  useEffect(() => {
    setCategories(storage.getCategories());
    setLocations(storage.getLocations());

    if (!isNewItem && id) {
      const items = storage.getItems();
      const item = items.find((i) => i.id === id);
      if (item) {
        setFormData({
          name: item.name,
          category: item.category,
          location: item.location,
          note: item.note,
        });
      }
    }
  }, [id, isNewItem]);

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error("Please enter an item name");
      return;
    }
    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }
    if (!formData.location) {
      toast.error("Please select a location");
      return;
    }

    if (isNewItem) {
      const newItem: Item = {
        id: inventoryLogic.generateId(),
        name: formData.name,
        category: formData.category,
        location: formData.location,
        note: formData.note,
      };
      storage.addItem(newItem);
      toast.success("Item added successfully");
    } else if (id) {
      storage.updateItem(id, formData);
      toast.success("Item updated successfully");
    }

    navigate("/");
  };

  const handleDelete = () => {
    if (id && !isNewItem) {
      if (window.confirm("Are you sure you want to delete this item?")) {
        storage.deleteItem(id);
        toast.success("Item deleted");
        navigate("/");
      }
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
          <h1 className="text-xl font-semibold">
            {isNewItem ? "Add Item" : "Edit Item"}
          </h1>
          <div className="w-10" />
        </div>
      </header>

      {/* Form */}
      <div className="px-4 py-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Item Name *</Label>
          <Input
            id="name"
            placeholder="Enter item name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="h-12 text-base"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger className="h-12 text-base">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.name}>
                  {cat.icon} {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <Select
            value={formData.location}
            onValueChange={(value) => setFormData({ ...formData, location: value })}
          >
            <SelectTrigger className="h-12 text-base">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((loc) => (
                <SelectItem key={loc.id} value={loc.name}>
                  {loc.icon} {loc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="note">Note (Optional)</Label>
          <Textarea
            id="note"
            placeholder="Add any additional details..."
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            rows={4}
            className="text-base resize-none"
          />
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-4">
          <Button
            onClick={handleSave}
            className="w-full h-12 text-base"
            size="lg"
          >
            <Save className="h-5 w-5 mr-2" />
            Save Item
          </Button>

          {!isNewItem && (
            <Button
              onClick={handleDelete}
              variant="destructive"
              className="w-full h-12 text-base"
              size="lg"
            >
              <Trash2 className="h-5 w-5 mr-2" />
              Delete Item
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
