"use client";

import { UsersActionDialog } from "./users-action-dialog";
import { useUsers } from "./users-provider";
import { useConfetti } from "@/hooks/use-confetti";
import Realistic from "react-canvas-confetti/dist/presets/realistic";

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
  const { onInitHandler, onShoot } = useConfetti();

  return (
    <>
      <UsersActionDialog
        key="user-add"
        open={open === "add"}
        onOpenChange={() => setOpen("add")}
        empresas={empresas}
        roles={roles}
        isSuperAdmin={isSuperAdmin}
        onShoot={onShoot}
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
            onShoot={onShoot}
          />
        </>
      )}
      <Realistic
        onInit={onInitHandler}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 9999,
        }}
      />
    </>
  );
}
