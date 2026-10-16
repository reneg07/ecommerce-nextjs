import React from 'react';
import Link from 'next/link';
import type { Product } from '@/types/product';
import { ProductImage } from './ProductImage';
import { Badge } from '@/components/ui/Badge';

export interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const isAvailable = product.stock > 0 && product.active;
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(parseFloat(product.price));

  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs hover:shadow-md hover:border-blue-400/80 transition-all duration-200">
      <div>
        <Link href={`/products/${product.id}`} className="block overflow-hidden rounded-lg">
          <ProductImage
            productId={product.id}
            productName={product.name}
            priority={priority}
            aspectRatio="square"
          />
        </Link>

        <div className="mt-3.5 flex items-center justify-between gap-2">
          {isAvailable ? (
            <Badge variant="success">En stock ({product.stock})</Badge>
          ) : (
            <Badge variant="danger">Agotado</Badge>
          )}
          <span className="text-[11px] font-mono text-slate-400">ID #{product.id}</span>
        </div>

        <h3 className="mt-2 text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
          <Link href={`/products/${product.id}`}>{product.name}</Link>
        </h3>

        <p className="mt-1 text-xs text-slate-600 line-clamp-2 min-h-[2rem] leading-relaxed">
          {product.description || 'Dispositivo tecnológico con garantía oficial.'}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="block text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Precio</span>
          <span className="text-base font-extrabold text-slate-900">{formattedPrice}</span>
        </div>

        <Link
          href={`/products/${product.id}`}
          aria-label={`Ver detalle de ${product.name}`}
          className="inline-flex items-center justify-center rounded-lg bg-slate-50 hover:bg-blue-600 hover:text-white border border-slate-200 hover:border-blue-600 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors"
        >
          Ver detalle →
        </Link>
      </div>
    </article>
  );
}
