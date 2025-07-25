'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Types for planner items (can be extended as needed)
export type PlannerItem = {
  id: string; // unique identifier (e.g., destination or tournament id)
  type: "destination" | "tournament";
  name: string;
  details: any; // can be more specific if you have types
};

// Context value type
type PreFlopPlannerContextType = {
  items: PlannerItem[];
  addItem: (item: PlannerItem) => void;
  removeItem: (id: string) => void;
  sendToTripDesigner: (id: string) => void;
};

const PreFlopPlannerContext = createContext<PreFlopPlannerContextType | undefined>(undefined);

export const usePreFlopPlanner = () => {
  const ctx = useContext(PreFlopPlannerContext);
  if (!ctx) throw new Error("usePreFlopPlanner must be used within PreFlopPlannerProvider");
  return ctx;
};

export const PreFlopPlannerProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<PlannerItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('preflop_planner_items') : null;
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch {}
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('preflop_planner_items', JSON.stringify(items));
    }
  }, [items]);

  const addItem = (item: PlannerItem) => {
    setItems((prev) => (prev.find((i) => i.id === item.id && i.type === item.type) ? prev : [...prev, item]));
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const sendToTripDesigner = (id: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (!item) return prev;
      // Add to trip designer items in localStorage
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('trip_designer_items');
        let tripItems: any[] = [];
        if (stored) {
          try {
            tripItems = JSON.parse(stored);
          } catch {}
        }
        if (!tripItems.find((i) => i.id === item.id && i.type === item.type)) {
          tripItems.push(item);
          localStorage.setItem('trip_designer_items', JSON.stringify(tripItems));
        }
      }
      // Remove from planner
      return prev.filter((i) => i.id !== id);
    });
  };

  return (
    <PreFlopPlannerContext.Provider value={{ items, addItem, removeItem, sendToTripDesigner }}>
      {children}
    </PreFlopPlannerContext.Provider>
  );
}; 