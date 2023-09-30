export interface IPaystackPayment {
  email: string;
  amount: number;
  callback_url?: string;
}

export interface IPaystackPaymentMetadata {
  orderId: string;
  userId: string;
}

export const TOKEN_GENERATED_SUCCESSFULLY = 'Token successfully generated';
