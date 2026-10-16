import React from 'react';
import Image from 'next/image';
import { getProductImage } from '@/lib/constants/product-images';

export interface ProductImageProps {
  productId: number;
  productName: string;
  className?: string;
  priority?: boolean;
  aspectRatio?: 'square' | 'video' | 'portrait';
  sizes?: string;
}

export function ProductImage({
  productId,
  productName,
  className = '',
  priority = false,
  aspectRatio = 'square',
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw',
}: ProductImageProps) {
  const imageInfo = getProductImage(productId, productName);

  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
  }[aspectRatio];

  return (
    <div className={`relative overflow-hidden bg-slate-50 border border-slate-100 rounded-lg ${aspectClasses} ${className}`}>
      <Image
        src={imageInfo.src}
        alt={imageInfo.alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover transition-transform duration-300 hover:scale-105"
      />
    </div>
  );
}
