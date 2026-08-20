"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { api } from "@/lib/api";
import { useAuth } from "./AuthContext";

export interface Restaurant {
  _id: number;
  name: string;
  city: string;
  address: string;
  cuisine: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiMenuItem {
  _id: number;
  restaurantId: number;
  name: string;
  price: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

interface RestaurantContextType {
  restaurants: Restaurant[];
  selectedRestaurant: Restaurant | null;
  menuItems: ApiMenuItem[];
  loading: boolean;
  selectRestaurant: (restaurant: Restaurant) => void;
  refreshRestaurants: () => Promise<void>;
  refreshMenuItems: () => Promise<void>;
  addRestaurant: (data: {
    name: string;
    city: string;
    address: string;
    cuisine: string;
    rating?: number;
  }) => Promise<void>;
  updateRestaurant: (
    id: number,
    data: {
      name?: string;
      city?: string;
      address?: string;
      cuisine?: string;
      rating?: number;
    },
  ) => Promise<void>;
  deleteRestaurant: (id: number) => Promise<void>;
  addMenuItem: (
    name: string,
    price: number,
    isAvailable?: boolean,
  ) => Promise<void>;
  updateMenuItem: (
    id: number,
    data: { name?: string; price?: number; isAvailable?: boolean },
  ) => Promise<void>;
  deleteMenuItem: (id: number) => Promise<void>;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(
  undefined,
);

export function RestaurantProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token } = useAuth();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<ApiMenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshRestaurants = useCallback(async () => {
    try {
      const data = await api.get<Restaurant[]>("/restaurants");
      setRestaurants(data);
      setSelectedRestaurant((current) => {
        if (!data.length) return null;
        if (!current) return data[0];
        const exists = data.some(
          (restaurant) => restaurant._id === current._id,
        );
        return exists ? current : data[0];
      });
    } catch {
      console.error("Failed to fetch restaurants");
    }
  }, []);

  const refreshMenuItems = useCallback(async () => {
    if (!selectedRestaurant) {
      setMenuItems([]);
      return;
    }
    try {
      const data = await api.get<ApiMenuItem[]>(
        `/restaurants/${selectedRestaurant._id}/menu`,
      );
      setMenuItems(data);
    } catch {
      console.error("Failed to fetch menu items");
      setMenuItems([]);
    }
  }, [selectedRestaurant]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await refreshRestaurants();
      setLoading(false);
    };
    load();
  }, [refreshRestaurants]);

  useEffect(() => {
    if (selectedRestaurant) {
      refreshMenuItems();
    }
  }, [selectedRestaurant, refreshMenuItems]);

  const selectRestaurant = useCallback((restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
  }, []);

  const addRestaurant = useCallback(
    async (data: {
      name: string;
      city: string;
      address: string;
      cuisine: string;
      rating?: number;
    }) => {
      if (!token) return;
      await api.post("/restaurants", data, token);
      await refreshRestaurants();
    },
    [token, refreshRestaurants],
  );

  const updateRestaurant = useCallback(
    async (
      id: number,
      data: {
        name?: string;
        city?: string;
        address?: string;
        cuisine?: string;
        rating?: number;
      },
    ) => {
      if (!token) return;
      await api.put(`/restaurants/${id}`, data, token);
      await refreshRestaurants();
    },
    [token, refreshRestaurants],
  );

  const deleteRestaurant = useCallback(
    async (id: number) => {
      if (!token) return;
      await api.delete(`/restaurants/${id}`, token);
      await refreshRestaurants();
    },
    [token, refreshRestaurants],
  );

  const addMenuItem = useCallback(
    async (name: string, price: number, isAvailable = true) => {
      if (!selectedRestaurant || !token) return;
      await api.post(
        `/restaurants/${selectedRestaurant._id}/menu`,
        { name, price, isAvailable },
        token,
      );
      await refreshMenuItems();
    },
    [selectedRestaurant, token, refreshMenuItems],
  );

  const updateMenuItem = useCallback(
    async (
      id: number,
      data: { name?: string; price?: number; isAvailable?: boolean },
    ) => {
      if (!token) return;
      await api.put(`/restaurants/menu/${id}`, data, token);
      await refreshMenuItems();
    },
    [token, refreshMenuItems],
  );

  const deleteMenuItem = useCallback(
    async (id: number) => {
      if (!token) return;
      await api.delete(`/restaurants/menu/${id}`, token);
      await refreshMenuItems();
    },
    [token, refreshMenuItems],
  );

  return (
    <RestaurantContext.Provider
      value={{
        restaurants,
        selectedRestaurant,
        menuItems,
        loading,
        selectRestaurant,
        refreshRestaurants,
        refreshMenuItems,
        addRestaurant,
        updateRestaurant,
        deleteRestaurant,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error("useRestaurant must be used within a RestaurantProvider");
  }
  return context;
}
