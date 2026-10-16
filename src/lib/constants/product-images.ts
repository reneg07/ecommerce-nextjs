export interface ProductImageInfo {
  src: string;
  alt: string;
}

/**
 * Mapeo determinístico de imágenes locales para los productos del seeder oficial
 */
const SEEDED_PRODUCTS_MAP: Record<number, string> = {
  1: '/images/products/laptop.svg',
  2: '/images/products/smartphone.svg',
  3: '/images/products/headphones.svg',
  4: '/images/products/monitor.svg',
  5: '/images/products/keyboard.svg',
  6: '/images/products/mouse.svg',
  7: '/images/products/tablet.svg',
};

/**
 * Retorna la ruta de imagen determinística según ID y palabras clave del nombre
 */
export function getProductImage(id: number, name?: string): ProductImageInfo {
  const fallbackAlt = name || `Producto #${id}`;

  if (SEEDED_PRODUCTS_MAP[id]) {
    return {
      src: SEEDED_PRODUCTS_MAP[id],
      alt: fallbackAlt,
    };
  }

  const lower = (name || '').toLowerCase();
  if (lower.includes('laptop') || lower.includes('notebook') || lower.includes('portátil')) {
    return { src: '/images/products/laptop.svg', alt: fallbackAlt };
  }
  if (lower.includes('smartphone') || lower.includes('teléfono') || lower.includes('celular') || lower.includes('phone')) {
    return { src: '/images/products/smartphone.svg', alt: fallbackAlt };
  }
  if (lower.includes('auricular') || lower.includes('audífono') || lower.includes('headphone') || lower.includes('sonido')) {
    return { src: '/images/products/headphones.svg', alt: fallbackAlt };
  }
  if (lower.includes('monitor') || lower.includes('pantalla') || lower.includes('display')) {
    return { src: '/images/products/monitor.svg', alt: fallbackAlt };
  }
  if (lower.includes('teclado') || lower.includes('keyboard')) {
    return { src: '/images/products/keyboard.svg', alt: fallbackAlt };
  }
  if (lower.includes('mouse') || lower.includes('ratón')) {
    return { src: '/images/products/mouse.svg', alt: fallbackAlt };
  }
  if (lower.includes('tablet') || lower.includes('ipad')) {
    return { src: '/images/products/tablet.svg', alt: fallbackAlt };
  }

  return {
    src: '/images/products/placeholder.svg',
    alt: fallbackAlt,
  };
}
