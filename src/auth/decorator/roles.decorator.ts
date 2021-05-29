import { SetMetadata } from '@nestjs/common';
import { Role } from '../../users/type/role';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
