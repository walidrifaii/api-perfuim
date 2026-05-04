import { BadRequestException } from '@nestjs/common';
import { Product } from './schemas/product.schema';

export function assertDistinctSizes(
  sizePrices: { size: string; price: number }[],
): void {
  const trimmed = sizePrices.map((r) => (r.size ?? '').trim());
  if (trimmed.some((s) => !s)) {
    throw new BadRequestException('Each size entry must have a non-empty size');
  }
  if (new Set(trimmed).size !== trimmed.length) {
    throw new BadRequestException('Duplicate sizes are not allowed');
  }
}

/** Resolves line unit price and canonical size label from the ordered size string. */
export function resolveVariantForOrder(
  p: Product,
  requestedSize?: string,
): { unitPrice: number; sizeLabel: string } {
  const variants = p.sizePrices ?? [];
  if (variants.length === 0) {
    throw new BadRequestException(`Product "${p.name}" has no size/price variants`);
  }
  const size = (requestedSize ?? '').trim();
  if (!size && variants.length === 1) {
    const v = variants[0];
    return { unitPrice: v.price, sizeLabel: v.size };
  }
  const match = variants.find((v) => v.size.trim() === size);
  if (!match) {
    if (!size) {
      throw new BadRequestException(`Size is required for product ${p.name}`);
    }
    throw new BadRequestException(
      `Invalid size "${requestedSize}" for product ${p.name}`,
    );
  }
  return { unitPrice: match.price, sizeLabel: match.size };
}
