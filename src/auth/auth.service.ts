import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as R from 'ramda';

import { User } from '../users/type/user';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser({ email, password }: Pick<User, 'email' | 'password'>) {
    const user = await this.userService.findByEmail(email);

    if (user && user.password === password) {
      const result = R.omit(['password'], user);
      return result;
    }

    return null;
  }

  async login(user: Omit<User, 'password'>) {
    const payload = { email: user.email, role: user.role, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    return {
      body: {
        accessToken,
        ...user,
      },
      cookie: this.getCookieWithJwt(accessToken),
    };
  }

  getCookieWithJwt(token: string) {
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get<string>(
      'JWT_EXPIRATION_TIME',
    )}`;
  }
}
