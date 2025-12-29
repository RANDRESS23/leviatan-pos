"use client";

import { UsersActionDialog } from "./users-action-dialog";
import { useUsers } from "./users-provider";

type UsersDialogsProps = {
  empresas: { id: string; nombre: string }[];
  roles: { id: string; nombre: string }[];
  isSuperAdmin: boolean;
};

export function UsersDialogs({
  empresas,
  roles,
  isSuperAdmin,
}: UsersDialogsProps) {
  const { open, setOpen, currentRow, setCurrentRow } = useUsers();
  return (
    <>
      <UsersActionDialog
        key="user-add"
        open={open === "add"}
        onOpenChange={() => setOpen("add")}
        empresas={empresas}
        roles={roles}
        isSuperAdmin={isSuperAdmin}
      />

      {currentRow && (
        <>
          <UsersActionDialog
            key={`user-edit-${currentRow.id}`}
            open={open === "edit"}
            onOpenChange={() => {
              setOpen("edit");
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
            currentRow={currentRow}
            empresas={empresas}
            roles={roles}
            isSuperAdmin={isSuperAdmin}
          />
        </>
      )}
    </>
  );
}
