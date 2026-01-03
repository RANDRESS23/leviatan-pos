"use client";

import { CategoryActionDialog } from "./category-action-dialog";
import { useCategory } from "./category-provider";
import { useConfetti } from "@/hooks/use-confetti";
import Realistic from "react-canvas-confetti/dist/presets/realistic";

export function CategoryDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useCategory();
  const { onInitHandler, onShoot } = useConfetti();

  return (
    <>
      <CategoryActionDialog
        key="company-add"
        open={open === "add"}
        onOpenChange={() => setOpen("add")}
        onShoot={onShoot}
      />

      {currentRow && (
        <>
          <CategoryActionDialog
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
