"use client";

import { CompaniesActionDialog } from "./companies-action-dialog";
import { useCompanies } from "./companies-provider";

export function CompaniesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useCompanies();
  return (
    <>
      <CompaniesActionDialog
        key="company-add"
        open={open === "add"}
        onOpenChange={() => setOpen("add")}
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
          />
        </>
      )}
    </>
  );
}
