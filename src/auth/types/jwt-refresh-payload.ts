import { User } from '../../users/type/user';

export interface JwtRefreshPayload {
  sub: User['id'];
  token: User['token'];
  iat: number;
  exp: number;
}
