import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export type UserRole = 'user' | 'moderator' | 'admin';

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
export const AdminOnly = () => Roles('admin');
export const ModeratorOnly = () => Roles('moderator', 'admin');
