import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { JwtAuthRefreshGuard } from './guard/jwt-auth-refresh.guard';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { LocalAuthGuard } from './guard/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: any) {
    return req.user;
  }

  // TODO register
  @Post('register')
  async register() {
    return { foo: 'bar' };
  }

  // TODO forget password
  @HttpCode(HttpStatus.OK)
  @Post('password/restore')
  async restore() {
    return { baz: 'bar' };
  }

  // TODO confirm register
  @HttpCode(HttpStatus.OK)
  @Post('confirm')
  async confirm() {
    return { message: 'success' };
  }

  // TODO
  // Создание пароля после восстановления
  @HttpCode(HttpStatus.OK)
  @Post('password/new')
  async newPassword() {
    return { message: 'Password new redirect to login page' };
  }

  // TODO change password
  // Пользователь сам изменяет пароль в ЛК
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('password/change')
  async changePassword() {
    return { message: 'Password changed' };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken, accessTokenCookie, refreshTokenCookie } =
      await this.authService.login(req.user);
    res.setHeader('Set-cookie', [accessTokenCookie, refreshTokenCookie]);
    res.send({ accessToken, refreshToken });
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthRefreshGuard)
  @Post('refresh')
  async refreshToken(
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, accessTokenCookie } = await this.authService.refresh(
      req.user,
    );
    res.setHeader('Set-cookie', accessTokenCookie);
    res.send({ accessToken });
  }
}
