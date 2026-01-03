"use client";

import { ClientsActionDialog } from "./clients-action-dialog";
import { useClients } from "./clients-provider";
import { type TypeDocument } from "../_data/schema";
import { ClientsImportDialog } from "./clients-import-dialog";
import { useConfetti } from "@/hooks/use-confetti";
import Realistic from "react-canvas-confetti/dist/presets/realistic";
import { ClientsDeleteDialog } from "./clients-delete-dialog";

type ClientsDialogsProps = {
  tiposDocumento: TypeDocument[];
};

export function ClientsDialogs({ tiposDocumento }: ClientsDialogsProps) {
  const { open, setOpen, currentRow, setCurrentRow } = useClients();
  const { onInitHandler, onShoot } = useConfetti();

  return (
    <>
      <ClientsActionDialog
        key="user-add"
        open={open === "add"}
        onOpenChange={() => setOpen("add")}
        tiposDocumento={tiposDocumento}
        onShoot={onShoot}
      />

      <ClientsImportDialog
        key="clients-import"
        open={open === "import"}
        onOpenChange={() => setOpen("import")}
        onShoot={onShoot}
      />

      {currentRow && (
        <>
          <ClientsActionDialog
            key={`user-edit-${currentRow.id}`}
            open={open === "edit"}
            onOpenChange={() => {
              setOpen("edit");
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
            currentRow={currentRow}
            tiposDocumento={tiposDocumento}
            onShoot={onShoot}
          />

          <ClientsDeleteDialog
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
