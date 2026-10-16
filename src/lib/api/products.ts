import { cache } from 'react';
import { apiFetch } from './client';
import { ApiError } from '@/types/api';
import type { Product } from '@/types/product';

/**
 * Obtener todos los productos activos del catálogo
 * Utiliza revalidación de Next.js con tag 'products'
 */
export async function getProducts(): Promise<Product[]> {
  try {
    return await apiFetch<Product[]>('/products', {
      next: {
        tags: ['products'],
        revalidate: 3600, // 1 hora de revalidación en segundo plano
      },
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Error inesperado al cargar productos', 500);
  }
}

/**
 * Obtener el detalle de un producto por ID con memoización de React (cache)
 * para evitar doble fetch entre generateMetadata() y page.tsx
 */
export const getProductById = cache(async (id: number): Promise<Product | null> => {
  if (isNaN(id) || id <= 0) {
    return null;
  }

  try {
    return await apiFetch<Product>(`/products/${id}`, {
      next: {
        tags: [`product-${id}`],
        revalidate: 3600,
      },
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
});
