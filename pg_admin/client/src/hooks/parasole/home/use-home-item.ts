// hooks/parasole/home/use-home-item.ts
import { useState } from "react";
import { toast } from "sonner";
import { HomePageItem, HomePageItemFormData } from "@/types/parasole/home/home";

// Sample initial data
const initialItems: HomePageItem[] = [
  {
    id: 1,
    title: "Welcome to Parasole Footwear",
    description: "Premium footwear designed for comfort and style. Explore our sustainable collection.",
    imageUrl: "/sample-images/hero-image.jpg",
    status: "active"
  },
  {
    id: 2,
    title: "Summer Collection 2025",
    description: "Lightweight and breathable footwear for the warmer months. Perfect for outdoor adventures.",
    imageUrl: "/sample-images/summer-collection.jpg",
    status: "active"
  },
  {
    id: 3,
    title: "About Our Materials",
    description: "We use eco-friendly materials sourced from sustainable suppliers around the world.",
    imageUrl: "/sample-images/materials.jpg",
    status: "inactive"
  }
];

export function useHomeItem() {
  const [items, setItems] = useState<HomePageItem[]>(initialItems);
  const [isLoading, setIsLoading] = useState(false);

  // Add new item
  const addItem = async (data: HomePageItemFormData): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newItem: HomePageItem = {
        ...data,
        id: Math.max(0, ...items.map(item => item.id)) + 1,
      };
      
      setItems(prevItems => [...prevItems, newItem]);
      
      toast.success("New Item Added", {
        description: `"${newItem.title}" has been created successfully.`,
        position: "top-right"
      });
      
      setIsLoading(false);
      return true;
    } catch (error) {
      toast.error("Failed to add item", {
        description: "There was a problem creating the item. Please try again.",
        position: "top-right"
      });
      
      setIsLoading(false);
      return false;
    }
  };

  // Update existing item
  const updateItem = async (id: number, data: HomePageItemFormData): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setItems(prevItems => 
        prevItems.map(item => 
          item.id === id ? { ...item, ...data } : item
        )
      );
      
      toast.success("Item Updated Successfully", {
        description: `Changes to "${data.title}" have been saved.`,
        position: "top-right"
      });
      
      setIsLoading(false);
      return true;
    } catch (error) {
      toast.error("Failed to update item", {
        description: "There was a problem updating the item. Please try again.",
        position: "top-right"
      });
      
      setIsLoading(false);
      return false;
    }
  };

  // Delete an item
  const deleteItem = async (id: number): Promise<boolean> => {
    const itemToDelete = items.find(item => item.id === id);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setItems(prevItems => prevItems.filter(item => item.id !== id));
      
      toast.error("Item Deleted", {
        description: `"${itemToDelete?.title}" has been permanently removed.`,
        position: "top-right"
      });
      
      return true;
    } catch (error) {
      toast.error("Failed to delete item", {
        description: "There was a problem deleting the item. Please try again.",
        position: "top-right"
      });
      
      return false;
    }
  };

  // Toggle item status
  const toggleItemStatus = async (id: number): Promise<boolean> => {
    try {
      const item = items.find(item => item.id === id);
      if (!item) return false;
      
      const newStatus = item.status === "active" ? "inactive" : "active";
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setItems(prevItems => 
        prevItems.map(item => 
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
      
      toast.success(`Status changed to ${newStatus.toUpperCase()}`, {
        description: `Item "${item.title}" is now ${newStatus}.`,
        position: "top-right"
      });
      
      return true;
    } catch (error) {
      toast.error("Failed to update status", {
        description: "There was a problem updating the status. Please try again.",
        position: "top-right"
      });
      
      return false;
    }
  };

  return {
    items,
    isLoading,
    addItem,
    updateItem,
    deleteItem,
    toggleItemStatus
  };
}