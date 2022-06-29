import { Permission, Role } from "../@types/api";
import { useAuthContext } from "../contexts/AuthContext";

interface UseCanParams {
  permissions?: Permission[];
  roles?: Role[];
}

export function useCan({ permissions, roles }: UseCanParams): boolean {
  const { user, isAuthenticated } = useAuthContext();

  if (!isAuthenticated || !user) {
    return false;
  }

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
