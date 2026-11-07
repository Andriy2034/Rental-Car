export interface Car {
  id: string;
  year: number;
  brand: string;
  model: string;
  type: string;
  img: string;
  description: string;
  fuelConsumption: number;
  engine: string;
  rentalPrice: string;
  rentalCompany: string;
  rentalConditions: string[];
  mileage: number;
  stockNumber?: number;
  features: string[];
  location: { country: string; city: string; address: string };
}
export interface Filters {
  brand: string;
  price: string;
  minMileage: string;
  maxMileage: string;
}
export interface CarsPage {
  cars: Car[];
  totalCars: number;
  totalPages: number;
  page: number;
}
export interface FilterMetadata {
  brands: string[];
  price: { min: number; max: number };
}
export const emptyFilters: Filters = { brand: '', price: '', minMileage: '', maxMileage: '' };
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://car-rental-api.goit.study';
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, init);
  if (!response.ok) {
    let message = 'Something went wrong. Please try again.';
    try {
      const data = await response.json();
      if (typeof data.message === 'string') message = data.message;
    } catch {
    }
    throw new ApiError(response.status, message);
  }
  return response.json() as Promise<T>;
}
export function carsQuery(filters: Filters, page: number) {
  const query = new URLSearchParams({ page: String(page), perPage: '12' });
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== '') query.set(key, value);
  });
  return `/cars?${query}`;
}
export function nextPage(last: CarsPage) {
  return last.page < last.totalPages ? last.page + 1 : undefined;
}
export const mileage = (value: number) => new Intl.NumberFormat('en-US').format(value);
export function bookingPayload(name: string, email: string, date: string, comment: string) {
  return {
    name: name.trim(),
    email: email.trim(),
    comment: [`Preferred booking date: ${date}`, comment.trim()].filter(Boolean).join('\n'),
  };
}
