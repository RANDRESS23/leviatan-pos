"use client";

import { CompaniesActionDialog } from "./companies-action-dialog";
import { useCompanies } from "./companies-provider";
import { useConfetti } from "@/hooks/use-confetti";
import Realistic from "react-canvas-confetti/dist/presets/realistic";

export function CompaniesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useCompanies();
  const { onInitHandler, onShoot } = useConfetti();

  return (
    <>
      <CompaniesActionDialog
        key="company-add"
        open={open === "add"}
        onOpenChange={() => setOpen("add")}
        onShoot={onShoot}
      />

      {currentRow && (
        <>
          <CompaniesActionDialog
            key={`company-edit-${currentRow.id}`}
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
