"use client";

import { useState, useEffect } from "react";
import type { Session, YogaClass, Instructor } from "@/types/domain";

export interface DemoCartItem {
  sessionId: string;
  className: string;
  instructorId: string;
  instructorName: string;
  startsAt: string;
  price: number;
}

const CART_KEY = "ananda-demo-cart";

export function useDemoCart() {
  const [items, setItems] = useState<DemoCartItem[]>([]);
  const [isReady, setIsReady] = useState(false);

  // Load from local storage
  useEffect(() => {
    const load = () => {
      try {
        const stored = window.localStorage.getItem(CART_KEY);
        if (stored) {
          setItems(JSON.parse(stored));
        } else {
          setItems([]);
        }
      } catch {
        setItems([]);
      }
      setIsReady(true);
    };

    load();
    window.addEventListener("ananda-demo-cart-change", load);
    return () => window.removeEventListener("ananda-demo-cart-change", load);
  }, []);

  const saveItems = (newItems: DemoCartItem[]) => {
    window.localStorage.setItem(CART_KEY, JSON.stringify(newItems));
    window.dispatchEvent(new Event("ananda-demo-cart-change"));
  };

  const addItem = (item: DemoCartItem) => {
    setItems((prev) => {
      if (prev.some((i) => i.sessionId === item.sessionId)) return prev;
      const newItems = [...prev, item];
      saveItems(newItems);
      return newItems;
    });
  };

  const removeItem = (sessionId: string) => {
    setItems((prev) => {
      const newItems = prev.filter((i) => i.sessionId !== sessionId);
      saveItems(newItems);
      return newItems;
    });
  };

  const clearCart = () => {
    saveItems([]);
  };

  const hasItem = (sessionId: string) => items.some((i) => i.sessionId === sessionId);

  const totalAmount = items.reduce((sum, item) => sum + item.price, 0);

  return {
    items,
    isReady,
    addItem,
    removeItem,
    clearCart,
    hasItem,
    totalAmount,
  };
}
