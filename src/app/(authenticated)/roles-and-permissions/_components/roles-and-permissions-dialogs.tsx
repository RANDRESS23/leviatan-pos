"use client";

import { Permission } from "../_data/schema";
import { RolesAndPermissionsActionDialog } from "./roles-and-permissions-action-dialog";
import { useRolesAndPermissions } from "./roles-and-permissions-provider";
import { useConfetti } from "@/hooks/use-confetti";
import Realistic from "react-canvas-confetti/dist/presets/realistic";

export function RolesAndPermissionsDialogs({
  permisos,
}: {
  permisos: Permission[];
}) {
  const { open, setOpen, currentRow, setCurrentRow } = useRolesAndPermissions();
  const { onInitHandler, onShoot } = useConfetti();

  return (
    <>
      <RolesAndPermissionsActionDialog
        key="company-add"
        open={open === "add"}
        onOpenChange={() => setOpen("add")}
        permisos={permisos}
        onShoot={onShoot}
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
