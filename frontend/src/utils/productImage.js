export const DEFAULT_PRODUCT_IMAGE = '/images/products/default-product.svg';

export const slugifyProductName = (name) => {
  return String(name || 'product')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const getStaticProductImagePath = (name) => {
  const slug = slugifyProductName(name);
  return `/images/products/${slug}.svg`;
};

export const getProductPrimaryImage = (product) => {
  if (product?.image && String(product.image).startsWith('/images/')) {
    return product.image;
  }

  if (Array.isArray(product?.images) && product.images.length > 0) {
    const first = product.images.find((img) => typeof img === 'string' && img.trim());
    if (first) return first;
  }

  return getStaticProductImagePath(product?.name);
};
