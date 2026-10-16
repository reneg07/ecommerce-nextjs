import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getProducts } from '@/lib/api/products';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ProductSkeletonGrid } from '@/components/products/ProductSkeleton';

export const metadata: Metadata = {
  title: 'Catálogo de Productos',
  description: 'Explora nuestra selección completa de hardware, computadoras y accesorios de alto rendimiento.',
};

/**
 * Componente asíncrono para streaming granular con Suspense
 */
async function ProductsList() {
  const products = await getProducts();
  return <ProductGrid products={products} />;
}

export default function ProductsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          Inicio
        </Link>
        <span>/</span>
        <span className="font-semibold text-slate-800">Catálogo</span>
      </nav>

      {/* Header */}
      <div className="mb-8 pb-5 border-b border-slate-200 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Equipamiento &amp; Dispositivos
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Catálogo Oficial de Productos
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600 max-w-2xl">
            Laptops, monitores y periféricos con certificación de origen, control estricto de inventario y envío coordinado.
          </p>
        </div>
      </div>

      {/* Suspense granular alrededor del listado asíncrono */}
      <Suspense fallback={<ProductSkeletonGrid count={8} />}>
        <ProductsList />
      </Suspense>
    </div>
  );
}
