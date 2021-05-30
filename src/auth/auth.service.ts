import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuid } from 'uuid';
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

    // TODO add bcrypt hash password compare
    if (user && user.password === password) {
      return user;
    }

    return null;
  }

  async login(user: User) {
    const payload = { sub: user.id };
    const token = uuid();

    const accessToken = this.getAccessToken(payload);
    const refreshToken = this.getRefreshToken({ ...payload, token });
    const accessTokenCookie = this.getAccessTokenCookie(accessToken);
    const refreshTokenCookie = this.getRefreshTokenCookie(refreshToken);

    await this.userService.updateUserToken(user.id, token);

    return {
      accessToken,
      accessTokenCookie,
      refreshToken,
      refreshTokenCookie,
    };
  }

  async refresh(user: User) {
    const payload = { sub: user.id };
    const accessToken = this.getAccessToken(payload);
    const accessTokenCookie = this.getAccessTokenCookie(accessToken);
    return { accessToken, accessTokenCookie };
  }

  getAccessToken(payload: Record<string, any>) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: `${this.configService.get<number>('JWT_EXPIRATION_TIME')}m`,
    });
  }

  getRefreshToken(payload: Record<string, any>) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: `${this.configService.get<number>(
        'JWT_REFRESH_EXPIRATION_TIME',
      )}m`,
    });
  }

  getAccessTokenCookie(token: string) {
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get<string>(
      'JWT_EXPIRATION_TIME',
    )}`;
  }

  getRefreshTokenCookie(token: string) {
    return `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get<string>(
      'JWT_REFRESH_EXPIRATION_TIME',
    )}`;
  }
}
