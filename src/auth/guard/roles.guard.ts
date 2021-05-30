import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Role } from '../../users/type/role';

const matchRoles = (roles: Role[], userRole: Role) => {
  return roles.some((role) => role === userRole);
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    _context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<Role[]>('roles', _context.getHandler());
    console.log('Roles', roles);
    if (!roles) {
      return true;
    }
    const request = _context.switchToHttp().getRequest();
    return matchRoles(roles, request.user.role);
  }
}
