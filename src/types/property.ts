export interface Property {
  id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  type: 'house' | 'apartment' | 'condo' | 'townhouse';
  image: string;
  images?: string[];
  description: string;
  yearBuilt?: number;
  parking?: number;
  featured?: boolean;
}








