import { environment } from '../config/environment';

export const vtpassAuth = () => {
  const token = `${environment.VT_PASS.USERNAME}:${environment.VT_PASS.PASSWORD}`;
  return Buffer.from(token).toString('base64');
};
