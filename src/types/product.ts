/**
 * Esquema de Producto obtenido del catálogo de Laravel
 * Coincide 100% con App\Http\Resources\ProductResource
 */
export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: string;
  stock: number;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}
