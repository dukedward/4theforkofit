import React, { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { useAuth } from "@/lib/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Upload, Loader2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { listItems, createItem, deleteItem, updateItem } from "../api/menuItem";
import { CATEGORIES } from "@/lib/categories";
import { getItemSizes } from "@/lib/getItemSizes";
import { getItemSauces } from "@/lib/getItemSauces";

const emptyItem = {
  name: "",
  description: "",
  price: "",
  category: "Entrees",
  image_url: "",
  featured: false,
  has_sizes: false,
  size_options: [],
  has_sauces: false,
  sauce_options: [],
  available: true,
};

export default function AdminMenu() {
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(emptyItem);
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const sizes = form.size_options || getItemSizes(form) || [];
  const sauces = form.sauce_options || getItemSauces(form) || [];
  const hasSizes = !!form.has_sizes;
  const hasSauces = !!form.has_sauces;

  const {
    data: items = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-menu-items"],
    queryFn: () => listItems("-created_date"),
  });

  const createMutation = useMutation({
    mutationFn: (data) => createItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-menu-items"] });
      closeDialog();
      toast({ title: "Item created!" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-menu-items"] });
      closeDialog();
      toast({ title: "Item updated!" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-menu-items"] });
      toast({ title: "Item deleted" });
    },
  });

  const openCreate = () => {
    setEditingItem(null);
    setForm(emptyItem);
    setDialogOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setForm({
      name: item.name || "",
      description: item.description || "",
      price: item.price || "",
      category: item.category || "Entrees",
      image_url: item.image_url || "",
      featured: item.featured || false,
      has_sizes: item.has_sizes || false,
      has_sauces: item.has_sauces || false,
      available: item.available !== false,
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingItem(null);
    setForm(emptyItem);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // if (!user) {
    //   toast.error("You must be signed in to upload images.");
    //   return;
    // }

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be 5MB or smaller.");
      return;
    }
    try {
      setUploading(true);

      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const fileName = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
      const storageRef = ref(storage, `/images/${fileName}`);

      await uploadBytes(storageRef, file, {
        contentType: file.type,
      });

      const fileUrl = await getDownloadURL(storageRef);

      setForm((prev) => ({
        ...prev,
        image_url: fileUrl,
      }));

      toast.success("Image uploaded successfully.");
    } catch (error) {
      toast.error("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...form, price: parseFloat(form.price) };
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  // console.log("Items error:", error);

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-secondary/30 py-10 md:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Site
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">
                Menu Management
              </h1>
              <p className="font-body text-muted-foreground mt-1">
                Add, edit, and manage your menu items.
              </p>
            </div>
            <div className="flex gap-3">
              <Link to="/admin/orders">
                <Button variant="outline" className="font-body">
                  View Orders
                </Button>
              </Link>
              <Button
                onClick={openCreate}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-body"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Item
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <p className="font-body text-muted-foreground text-center py-10">
            Loading menu items...
          </p>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-body text-muted-foreground mb-4">
              No menu items yet.
            </p>
            <Button
              onClick={openCreate}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-body"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Your First Item
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {CATEGORIES.map((cat) => {
              const catItems = items.filter((i) => i.category === cat);
              if (catItems.length === 0) return null;
              return (
                <div key={cat}>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-3 mt-6">
                    {cat}
                  </h3>
                  <div className="space-y-2">
                    {catItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 bg-card rounded-lg border border-border/50 p-4 hover:shadow-sm transition-shadow"
                      >
                        {item.image_url && (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-14 h-14 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-display font-semibold text-foreground truncate">
                              {item.name}
                            </h4>
                            {item.featured && (
                              <Badge className="bg-primary/10 text-primary text-xs">
                                Featured
                              </Badge>
                            )}
                            {!item.available && (
                              <Badge variant="secondary" className="text-xs">
                                Hidden
                              </Badge>
                            )}
                          </div>
                          <p className="font-body text-xs text-muted-foreground truncate">
                            {item.description}
                          </p>
                        </div>
                        <span className="font-body text-primary font-semibold">
                          ${item.price?.toFixed(2)}
                        </span>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openEdit(item)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => deleteMutation.mutate(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editingItem ? "Edit Item" : "Add New Item"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label className="font-body">Name *</Label>
              <Input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="font-body"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-body">Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="font-body"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-body">Price *</Label>
                <Input
                  required
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="font-body"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-body">Category *</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm({ ...form, category: v })}
                >
                  <SelectTrigger className="font-body">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c} className="font-body">
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label className="font-body">Image</Label>
              {form.image_url && (
                <img
                  src={form.image_url}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-lg mb-2"
                />
              )}
              <label className="flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                {uploading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Upload className="w-5 h-5 text-muted-foreground" />
                )}
                <span className="font-body text-sm text-muted-foreground">
                  {uploading ? "Uploading..." : "Click to upload image"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
              </label>
            </div>

            <div className="flex-col items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={form.available}
                    onCheckedChange={(v) => setForm({ ...form, available: v })}
                  />
                  <Label className="font-body text-sm">Available</Label>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={form.featured}
                    onCheckedChange={(v) => setForm({ ...form, featured: v })}
                  />
                  <Label className="font-body text-sm">Featured</Label>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={form.has_sizes}
                    onCheckedChange={(v) => setForm({ ...form, has_sizes: v })}
                  />
                  <Label className="font-body text-sm">Has Sizes</Label>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={form.has_sauces}
                    onCheckedChange={(v) => setForm({ ...form, has_sauces: v })}
                  />
                  <Label className="font-body text-sm">Has Sauces</Label>
                </div>
                <div></div>
              </div>
              <div>
                {hasSizes && (
                  <div className="space-y-2 border border-border rounded-lg p-4">
                    <Label className="font-body font-semibold">
                      Portion Sizes
                    </Label>
                    {sizes.map((s, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <Input
                          placeholder="Label (e.g. 10pc, 1 Rack)"
                          value={s.size}
                          onChange={(e) => {
                            const sizes = [...sizes];
                            sizes[i] = {
                              ...sizes[i],
                              size: e.target.value,
                            };
                            setForm({ ...form, has_sizes: sizes });
                          }}
                          className="font-body"
                        />
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="Price"
                          value={s.price}
                          onChange={(e) => {
                            const sizes = [...sizes];
                            sizes[i] = {
                              ...sizes[i],
                              price: parseFloat(e.target.value) || 0,
                            };
                            setForm({ ...form, has_sizes: sizes });
                          }}
                          className="font-body w-28"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-destructive h-8 w-8"
                          onClick={() =>
                            setForm({
                              ...form,
                              has_sizes: sizes.filter((_, j) => j !== i),
                            })
                          }
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="font-body"
                      onClick={() =>
                        setForm({
                          ...form,
                          has_sizes: [...sizes, { size: "", price: 0 }],
                        })
                      }
                    >
                      <Plus className="w-3 h-3 mr-1" /> Add Size
                    </Button>
                  </div>
                )}

                {hasSauces && (
                  <div className="space-y-2 border border-border rounded-lg p-4">
                    <Label className="font-body font-semibold">
                      Available Sauces
                    </Label>
                    {sauces.map((sauce, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <Input
                          placeholder="Sauce name"
                          value={sauce}
                          onChange={(e) => {
                            const sauces = [...sauces];
                            sauces[i] = e.target.value;
                            setForm({ ...form, has_sauces: sauces });
                          }}
                          className="font-body"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-destructive h-8 w-8"
                          onClick={() =>
                            setForm({
                              ...form,
                              has_sauces: sauces.filter((_, j) => j !== i),
                            })
                          }
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="font-body"
                      onClick={() =>
                        setForm({ ...form, has_sauces: [...sauces, ""] })
                      }
                    >
                      <Plus className="w-3 h-3 mr-1" /> Add Sauce
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSaving}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-body"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {editingItem ? "Save Changes" : "Add Item"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
