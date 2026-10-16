import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductById, getProducts } from '@/lib/api/products';
import { ProductImage } from '@/components/products/ProductImage';
import { Badge } from '@/components/ui/Badge';
import { AddToCartButton } from '@/components/cart/AddToCartButton';

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Pre-renderizado estático de productos activos para LCP ultrarrápido y SEO 100%
 */
export async function generateStaticParams() {
  try {
    const products = await getProducts();
    return products.map((product) => ({
      id: product.id.toString(),
    }));
  } catch (error) {
    console.error('Error generando static params:', error);
    return [];
  }
}

/**
 * Generación dinámica de metadatos SEO con datos reales del backend
 * Utiliza getProductById memoizado con React cache para evitar doble fetch
 */
export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const numericId = parseInt(id, 10);

  if (isNaN(numericId) || numericId <= 0) {
    return {
      title: 'Producto no encontrado',
      description: 'El identificador de producto proporcionado es inválido.',
    };
  }

  const product = await getProductById(numericId);

  if (!product) {
    return {
      title: 'Producto no encontrado | KeeyShop',
      description: 'El producto solicitado no existe o no se encuentra activo en el catálogo corporativo.',
    };
  }

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(parseFloat(product.price));

  return {
    title: `${product.name} (${formattedPrice})`,
    description:
      product.description ||
      `Adquiere ${product.name} al precio de ${formattedPrice} con garantía oficial y envío asegurado en KeeyShop.`,
    openGraph: {
      title: `${product.name} | KeeyShop`,
      description: product.description || `Disponible por ${formattedPrice} en KeeyShop.`,
      type: 'website',
    },
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const numericId = parseInt(id, 10);

  if (isNaN(numericId) || numericId <= 0) {
    notFound();
  }

  const product = await getProductById(numericId);

  if (!product) {
    notFound();
  }

  const isAvailable = product.stock > 0 && product.active;
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(parseFloat(product.price));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 mb-8 flex-wrap">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          Inicio
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-blue-600 transition-colors">
          Catálogo
        </Link>
        <span>/</span>
        <span className="font-semibold text-slate-800 truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left: Product Image */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
          <ProductImage
            productId={product.id}
            productName={product.name}
            priority={true}
            aspectRatio="square"
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="rounded-xl"
          />
        </div>

        {/* Right: Product Details */}
        <div className="flex flex-col bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between gap-4">
            {isAvailable ? (
              <Badge variant="success">Disponible ({product.stock} unidades)</Badge>
            ) : (
              <Badge variant="danger">Agotado actualmente</Badge>
            )}
            <span className="text-xs font-mono text-slate-400">SKU: PROD-{product.id.toString().padStart(5, '0')}</span>
          </div>

          <h1 className="mt-3 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {product.name}
          </h1>

          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-3xl font-black text-blue-600">{formattedPrice}</span>
            <span className="text-xs text-slate-500 font-medium">IVA incluido • Facturación A/B</span>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Especificaciones &amp; Descripción</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {product.description ||
                'Producto tecnológico de alto desempeño con especificaciones de grado comercial y garantía oficial directa de KeeyShop.'}
            </p>
          </div>

          {/* Value Propositions */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 py-4 border-y border-slate-100 text-xs text-slate-600">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                ✓
              </span>
              <span>Garantía oficial de 12 meses</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                📦
              </span>
              <span>Envío express coordinado</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                🔒
              </span>
              <span>Pago cifrado con Stripe</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
                ⚡
              </span>
              <span>Stock auditado en tiempo real</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <AddToCartButton
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  stock: product.stock,
                  active: product.active,
                }}
              />
            </div>

            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 hover:bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors"
            >
              ← Volver al Catálogo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
