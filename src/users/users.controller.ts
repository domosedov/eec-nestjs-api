import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { Role } from './type/role';
import { Roles } from '../auth/decorator/roles.decorator';
import { RolesGuard } from '../auth/guard/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Roles(Role.ADMIN)
  @Get('/')
  async getUsers() {
    return this.userService.findAll();
  }

  @Roles(Role.ADMIN)
  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.userService.findOne(parseInt(id));
  }

  @Roles(Role.ADMIN)
  @Post('/')
  async createUser(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.delete(parseInt(id));
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(parseInt(id), dto);
  }
}
