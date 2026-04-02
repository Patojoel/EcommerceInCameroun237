import { useCartStore } from "@/store/cartStore";
import { Product } from "@/types";

export function useCart() {
  const {
    items,
    isOpen,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
  } = useCartStore();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const addProduct = (product: Product, quantity: number = 1) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] ?? "",
      slug: product.slug,
      stock: product.stock,
      quantity,
    });
  };

  const isInCart = (productId: string): boolean => {
    return items.some((item) => item.productId === productId);
  };

  const getItemQuantity = (productId: string): number => {
    return items.find((item) => item.productId === productId)?.quantity ?? 0;
  };

  return {
    items,
    isOpen,
    totalItems,
    totalPrice,
    addItem,
    addProduct,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    isInCart,
    getItemQuantity,
  };
}
