import { Permission, Role, User } from "../@types/api";

interface ValidateUserPermissionsAndRolesParams {
  user: User;
  permissions?: Permission[];
  roles?: Role[];
}

export function validateUserPermissionsAndRoles({
  user,
  permissions,
  roles,
}: ValidateUserPermissionsAndRolesParams) {
  if (permissions && permissions.length > 0) {
    const hasAllPermissions = permissions.every(permission => {
      return user.permissions.includes(permission);
    });

    if (!hasAllPermissions) {
      return false;
    }
  }

  if (roles && roles.length > 0) {
    const hasAllRoles = roles.some(permission => {
      return user.roles.includes(permission);
    });

    if (!hasAllRoles) {
      return false;
    }
  }

  return true;
}
