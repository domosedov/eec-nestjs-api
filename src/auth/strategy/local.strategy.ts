import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { User } from '../../users/type/user';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(
    email: User['email'],
    password: User['password'],
  ): Promise<Omit<User, 'password'>> {
    const user = await this.authService.validateUser({ email, password });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
