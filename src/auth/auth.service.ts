import { Injectable } from '@nestjs/common';
import { User } from 'src/users/type/user';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async validateUser({ email, password }: Pick<User, 'email' | 'password'>) {
    const user = await this.userService.findByEmail(email);

    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
  }
}
