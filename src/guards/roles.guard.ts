import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // Se não houver roles exigidas, libera a rota
    }

    const { user } = context.switchToHttp().getRequest();

    // Verificando a role do usuário
    if (!user.role || !requiredRoles.includes(user.role.name)) {
      throw new ForbiddenException('Acesso negado.');
    }

    return true;
  }
}
