export const WALLET_WALLET_TRANSFER = 'Transfer was processed successfully';
export const FUNDS_REVERSED = 'Funds reversed';

export enum ActivityEnum {
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
}

export enum TxnTypeEnum {
  BANK_TRANSFER = 'BANK_TRANSFER',
  VAULT = 'VAULT',
  WALLET = 'WALLET',
}

export enum PaymentGatewayEnum {
  VAULT = 'VAULT',
  WALLET = 'WALLET',
  PROVIDUS = 'PROVIDUS',
  SAGE = 'SAGE',
  KUDA = 'KUDA',
}

export const TxnDesc = {
  topUp: 'Bank Transfer',
  vault: 'Vault Created',
  VaultRedeemed: 'Vault Redeemed',
  dataPurchase: 'Data purchase',
  airtimePurchase: 'Airtime purchase',
  tvSubscription: 'TV Subscription purchase',
  electricity: 'Electricity purchase',
  wallet2Wallet: 'Figur to Figur transfer',
  wallet2Bank: 'Bank transfer',
  nipCommission: 'NIP commission',
  airtime2Cash: 'Airtime to cash',
  sellGiftCard: 'Sell Giftcard',
  buyGiftCard: 'Giftcard purchase',
};

export enum PurposeEnum {
  POWER = 'POWER',
  GIFTCARD = 'GIFTCARD',
  AIRTIME = 'AIRTIME',
  DATA = 'DATA',
  CABLE = 'CABLE',
  WALLET = 'WALLET',
  TRANSFER = 'TRANSFER',
  VAULT = 'VAULT',
  CHEAP_DATA = 'CHEAP DATA',
  AIRTIME_TO_CASH = 'AIRTIME TO CASH',
}

export enum StatusEnum {
  PROCESSING = 'PROCESSING',
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  INITIATED = 'INITIATED',
  REFUNDED = 'REVERSAL',
}
