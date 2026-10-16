import React, { Suspense } from 'react';
import Link from 'next/link';
import { getProducts } from '@/lib/api/products';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductSkeletonGrid } from '@/components/products/ProductSkeleton';
import type { Product } from '@/types/product';

async function FeaturedProductsList() {
  let featuredProducts: Product[] = [];
  try {
    const products = await getProducts();
    featuredProducts = products.slice(0, 4);
  } catch {
    featuredProducts = [];
  }

  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {featuredProducts.map((product, idx) => (
        <ProductCard key={product.id} product={product} priority={idx === 0} />
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="flex flex-col gap-14 pb-20">
      {/* Hero Section - Clean, editorial and corporate */}
      <section className="bg-white border-b border-slate-200/90 pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/70 text-xs font-semibold text-blue-700 mb-6">
            <span>Tienda Oficial</span>
            <span className="text-blue-300">•</span>
            <span>Hardware &amp; Tecnología para Profesionales</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
            Tecnología y Rendimiento para tus Proyectos Críticos
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Equipos ultrabook, periféricos ergonómicos y monitores de alta fidelidad con inventario garantizado en tiempo real y facturación segura.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-sm font-semibold shadow-xs transition-colors"
            >
              Explorar Catálogo de Productos →
            </Link>
            <Link
              href="/orders"
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 px-6 py-3 text-sm font-semibold transition-colors"
            >
              Consultar Órdenes
            </Link>
          </div>
        </div>
      </section>

      {/* Institutional Highlights - Clean corporate trust pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 rounded-xl border border-slate-200/90 bg-white shadow-xs">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-base font-bold mb-3">
              🛡️
            </div>
            <h2 className="text-sm font-bold text-slate-900">Garantía Directa</h2>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              12 meses de cobertura integral del fabricante en todos los dispositivos.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-200/90 bg-white shadow-xs">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-base font-bold mb-3">
              📦
            </div>
            <h2 className="text-sm font-bold text-slate-900">Envío Prioritario</h2>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              Despacho rápido y empaquetado seguro con trazabilidad en línea.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-200/90 bg-white shadow-xs">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-base font-bold mb-3">
              💳
            </div>
            <h2 className="text-sm font-bold text-slate-900">Pagos Protegidos</h2>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              Pasarela de pago cifrada de nivel bancario a través de Stripe.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-200/90 bg-white shadow-xs">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-base font-bold mb-3">
              ⚡
            </div>
            <h2 className="text-sm font-bold text-slate-900">Stock en Tiempo Real</h2>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              Sincronización transaccional inmediata con nuestra base de datos.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Catalog Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-end justify-between mb-6 pb-3 border-b border-slate-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Catálogo Seleccionado
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              Productos Destacados
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >
            Ver todos los productos →
          </Link>
        </div>

        <Suspense fallback={<ProductSkeletonGrid count={4} />}>
          <FeaturedProductsList />
        </Suspense>
      </section>
    </div>
  );
}
