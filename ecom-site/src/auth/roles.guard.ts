import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {

        // Read roles from @Roles() decorator
        const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
        context.getHandler(),
        context.getClass(),
        ]);

        // If no roles defined on route, allow by default
        if (!requiredRoles) {
            return true;
        }

        // Get user from request
        const { user } = context.switchToHttp().getRequest();

        if (!user) {
            throw new ForbiddenException('User not found in request');
        }

        // Match user role with allowed roles
        if (!requiredRoles.includes(user.role)) {
            throw new ForbiddenException('You do not have permission to perform this action');
        }

        return true; // Allow access
    }
}
