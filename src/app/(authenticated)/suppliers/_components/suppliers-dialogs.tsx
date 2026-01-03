"use client";

import { SuppliersActionDialog } from "./suppliers-action-dialog";
import { useSuppliers } from "./suppliers-provider";
import { SuppliersImportDialog } from "./suppliers-import-dialog";
import { useConfetti } from "@/hooks/use-confetti";
import Realistic from "react-canvas-confetti/dist/presets/realistic";
import { SuppliersDeleteDialog } from "./suppliers-delete-dialog";

export function SuppliersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useSuppliers();
  const { onInitHandler, onShoot } = useConfetti();

  return (
    <>
      <SuppliersActionDialog
        key="user-add"
        open={open === "add"}
        onOpenChange={() => setOpen("add")}
        onShoot={onShoot}
      />

      <SuppliersImportDialog
        key="suppliers-import"
        open={open === "import"}
        onOpenChange={() => setOpen("import")}
        onShoot={onShoot}
      />

      {currentRow && (
        <>
          <SuppliersActionDialog
            key={`user-edit-${currentRow.id}`}
            open={open === "edit"}
            onOpenChange={() => {
              setOpen("edit");
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
            currentRow={currentRow}
            onShoot={onShoot}
          />

          <SuppliersDeleteDialog
            key={`user-delete-${currentRow.id}`}
            open={open === "delete"}
            onOpenChange={() => {
              setOpen("delete");
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
            currentRow={currentRow}
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
