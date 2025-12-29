"use client";

import React, { useState } from "react";
import useDialogState from "@/hooks/use-dialog-state";
import { type Role } from "../_data/schema";

type RolesAndPermissionsDialogType = "add" | "edit";

type RolesAndPermissionsContextType = {
  open: RolesAndPermissionsDialogType | null;
  setOpen: (str: RolesAndPermissionsDialogType | null) => void;
  currentRow: Role | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<Role | null>>;
};

const RolesAndPermissionsContext =
  React.createContext<RolesAndPermissionsContextType | null>(null);

export function RolesAndPermissionsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useDialogState<RolesAndPermissionsDialogType>(null);
  const [currentRow, setCurrentRow] = useState<Role | null>(null);

  return (
    <RolesAndPermissionsContext
      value={{ open, setOpen, currentRow, setCurrentRow }}
    >
      {children}
    </RolesAndPermissionsContext>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRolesAndPermissions = () => {
  const rolesAndPermissionsContext = React.useContext(
    RolesAndPermissionsContext
  );

  if (!rolesAndPermissionsContext) {
    throw new Error(
      "useRolesAndPermissions has to be used within <RolesAndPermissionsContext>"
    );
  }

  return rolesAndPermissionsContext;
};
