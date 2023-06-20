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
