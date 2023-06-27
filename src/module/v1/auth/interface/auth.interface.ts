import { UserDocument } from '../../user/schema/user.schema';

export interface IAuthResponse {
  accessToken: string;
  user: UserDocument;
}
