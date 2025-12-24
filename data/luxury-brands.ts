export const LUXURY_BRANDS = [
  'Louis Vuitton',
  'Gucci',
  'Chanel',
  'Hermès',
  'Prada',
  'Dior',
  'Balenciaga',
  'Saint Laurent',
  'Fendi',
  'Bottega Veneta',
  'Burberry',
  'Givenchy',
  'Valentino',
  'Celine',
  'Loewe',
  'Versace',
  'Dolce & Gabbana',
  'Alexander McQueen',
  'Tom Ford',
  'Off-White',
  'Other',
].sort();

export const ITEM_CATEGORIES = [
  'Handbags',
  'Shoes',
  'Clothing',
  'Accessories',
  'Jewelry',
  'Watches',
  'Sunglasses',
  'Belts',
  'Scarves',
  'Wallets',
].sort();

export interface BrandInfo {
  name: string;
  averageResaleRate: number; // percentage of original price
  popularItems: string[];
}

// Brand-specific data (could be used for more sophisticated pricing)
export const BRAND_DATA: Record<string, BrandInfo> = {
  'Hermès': {
    name: 'Hermès',
    averageResaleRate: 0.85,
    popularItems: ['Birkin', 'Kelly', 'Constance'],
  },
  'Chanel': {
    name: 'Chanel',
    averageResaleRate: 0.75,
    popularItems: ['Classic Flap', '2.55', 'Boy Bag'],
  },
  'Louis Vuitton': {
    name: 'Louis Vuitton',
    averageResaleRate: 0.65,
    popularItems: ['Neverfull', 'Speedy', 'Alma'],
  },
  'Gucci': {
    name: 'Gucci',
    averageResaleRate: 0.60,
    popularItems: ['Marmont', 'Dionysus', 'Jackie'],
  },
};
