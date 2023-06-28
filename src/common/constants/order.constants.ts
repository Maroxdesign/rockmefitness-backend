export interface ICompleteOrder {
  orderId: string;
}

export interface IDriverRejectOrder {
  orderId: string;
  driverId: string;
}

export interface IDriverAcceptOrder {
  orderId: string;
  driverId: string;
}

export enum PickupType {
  NOW = 'NOW',
  SCHEDULE = 'SCHEDULE',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
}