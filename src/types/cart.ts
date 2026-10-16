export interface CartItem {
  productId: number;
  name: string;
  price: string;
  quantity: number;
  stock: number;
  image: string;
}

export interface CartStore {
  items: CartItem[];
  addItem: (
    product: {
      id: number;
      name: string;
      price: string;
      stock: number;
      image?: string;
    },
    quantity?: number
  ) => boolean;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  incrementQuantity: (productId: number) => void;
  decrementQuantity: (productId: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
}
