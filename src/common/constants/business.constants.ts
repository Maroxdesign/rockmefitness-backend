export const BUSINESS_CREATED = 'Business Created';
export const BUSINESS_UPDATED = 'Business Updated';
export const BUSINESS_APPROVED = 'Business Approved';

export const BUSINESS_ACCOUNT_GENERATED = 'Business account created';

export const ACCOUNT_UPDATED = 'Account Updated';

export const VERIFICATION_UPDATED = 'Verification Updated';

export const MERMAT_UPDATED = 'Mermat Updated';

export const PARTICULAR_OF_DIRECTOR_UPDATED = 'Director Particular Updated';

export const PARTICULAR_OF_SHAREHOLDER_UPDATED =
  'ShareHolder Particular Updated';

export const UTILITY_BILL_UPDATED = 'Utility Bill Updated';

export enum BusinessType {
  NEW = 'NEW',
  REGISTERED = 'REGISTERED',
  FREELANCER = 'FREELANCER',
}

export enum VerificationEnum {
  PENDING = 'PENDING',
  IN_REVIEW = 'IN REVIEW',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  REJECTED = 'REJECTED',
}

export enum IdTypeEnum {
  NIN = 'NIN',
  DRIVER_LICENSE = 'DRIVER LICENSE',
  INTERNATIONAL_PASSPORT = 'INTERNATIONAL PASSPORT',
}
