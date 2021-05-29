import { User } from '../../users/type/user';

export interface JwtPayload {
  email: User['email'];
  role: User['role'];
  sub: User['id'];
  iat: number;
  exp: number;
}
