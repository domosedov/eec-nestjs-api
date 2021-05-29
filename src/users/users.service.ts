import { BadRequestException, Injectable } from '@nestjs/common';
import type { User } from './type/user';
import { Role } from './type/role';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private readonly users: User[];

  constructor() {
    this.users = [
      { id: 1, email: 'test1@test.com', password: '2001', role: Role.ADMIN },
      { id: 2, email: 'test2@test.com', password: '2002', role: Role.GUEST },
      { id: 3, email: 'test3@test.com', password: '2003', role: Role.GUEST },
      { id: 4, email: 'test4@test.com', password: '2004', role: Role.GUEST },
    ];
  }

  async findOne(id: User['id']) {
    return this.users.find((user) => user.id === id);
  }

  async findAll() {
    return this.users;
  }

  async create(dto: CreateUserDto) {
    return [...this.users, { id: Date.now(), ...dto }];
  }

  async delete(id: User['id']) {
    const index = this.users.findIndex((user) => user.id === id);
    if (index !== -1) this.users.splice(index, 1);
  }

  async update(id: User['id'], dto: UpdateUserDto) {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) throw new BadRequestException('User not found');
    const user = this.users[userIndex];
    const updatedUser = { ...user, ...dto };
    this.users.splice(userIndex, 1, updatedUser);
    return updatedUser;
  }
}
