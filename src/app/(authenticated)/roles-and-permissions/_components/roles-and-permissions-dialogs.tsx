"use client";

import { Permission } from "../_data/schema";
import { RolesAndPermissionsActionDialog } from "./roles-and-permissions-action-dialog";
import { useRolesAndPermissions } from "./roles-and-permissions-provider";

export function RolesAndPermissionsDialogs({
  permisos,
}: {
  permisos: Permission[];
}) {
  const { open, setOpen, currentRow, setCurrentRow } = useRolesAndPermissions();
  return (
    <>
      <RolesAndPermissionsActionDialog
        key="company-add"
        open={open === "add"}
        onOpenChange={() => setOpen("add")}
        permisos={permisos}
      />

      {currentRow && (
        <>
          <RolesAndPermissionsActionDialog
            key={`company-edit-${currentRow.id}`}
            open={open === "edit"}
            onOpenChange={() => {
              setOpen("edit");
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
            currentRow={currentRow}
            permisos={permisos}
          />
        </>
      )}
    </>
  );
}
