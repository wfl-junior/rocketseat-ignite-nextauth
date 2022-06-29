import { Fragment } from "react";
import { Permission, Role } from "../@types/api";
import { useCan } from "../hooks/useCan";

interface CanProps {
  children: React.ReactNode;
  permissions?: Permission[];
  roles?: Role[];
}

export const Can: React.FC<CanProps> = ({ children, permissions, roles }) => {
  const userCanSeeComponent = useCan({ permissions, roles });

  if (!userCanSeeComponent) {
    return null;
  }

  return <Fragment>{children}</Fragment>;
};
