import React, { createContext, useContext, useState, useCallback } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addItem = useCallback((menuItem, quantity = 1) => {
    setItems((prev) => {
      const cartKey = `${menuItem.id}-${menuItem.selected_size || "default"}`;

      const existing = prev.find((i) => i.cart_key === cartKey);

      if (existing) {
        return prev.map((i) =>
          i.cart_key === cartKey
            ? { ...i, quantity: i.quantity + quantity }
            : i,
        );
      }

      return [
        ...prev,
        {
          cart_key: cartKey,
          menu_item_id: menuItem.id,
          name: menuItem.display_name || menuItem.name,
          base_name: menuItem.name,
          selected_size: menuItem.selected_size || null,
          selected_sauce: menuItem.selected_sauce || null,
          price: menuItem.price,
          quantity,
          image_url: menuItem.image_url,
        },
      ];
    });
  }, []);

  const removeItem = useCallback((cartKey) => {
    setItems((prev) => prev.filter((i) => i.cart_key !== cartKey));
  }, []);

  const updateQuantity = useCallback((cartKey, quantity) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.cart_key !== cartKey));
      return;
    }

    setItems((prev) =>
      prev.map((i) => (i.cart_key === cartKey ? { ...i, quantity } : i)),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
