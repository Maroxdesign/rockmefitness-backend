export interface IPaystackPayment {
  email: string;
  amount: number;
  callback_url?: string;
}

export interface IPaystackPaymentMetadata {
  orderId: string;
  userId: string;
}