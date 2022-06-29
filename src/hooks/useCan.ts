import { Permission, Role } from "../@types/api";
import { useAuthContext } from "../contexts/AuthContext";
import { validateUserPermissionsAndRoles } from "../utils/validateUserPermissionsAndRoles";

interface UseCanParams {
  permissions?: Permission[];
  roles?: Role[];
}

export function useCan({ permissions, roles }: UseCanParams): boolean {
  const { user } = useAuthContext();

  if (!user) {
    return false;
  }

  return validateUserPermissionsAndRoles({ user, permissions, roles });
}
