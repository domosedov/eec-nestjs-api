import { IsString, IsEmail, IsEnum } from 'class-validator';
import { Role } from '../type/role';

export class CreateUserDto {
  @IsEmail()
  readonly email: string;

  @IsString()
  readonly password: string;

  @IsEnum(Role)
  readonly role: Role;
}
