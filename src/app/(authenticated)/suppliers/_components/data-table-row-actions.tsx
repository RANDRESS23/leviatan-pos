"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { type Row } from "@tanstack/react-table";
import { FolderPen, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type Supplier } from "../_data/schema";
import { useSuppliers } from "./suppliers-provider";
import { useState } from "react";
import { getSupplierById } from "../_actions/supplier";

type DataTableRowActionsProps = {
  row: Row<Supplier>;
};

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const [isAvailableToDelete, setIsAvailableToDelete] = useState(false);
  const { setOpen, setCurrentRow } = useSuppliers();

  const searchSupplier = async () => {
    const { hasPurchases } = await getSupplierById(row.original.id);

    if (!hasPurchases) {
      setIsAvailableToDelete(true);
    }
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
            onClick={searchSupplier}
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Abrir menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(row.original);
              setOpen("edit");
            }}
            className="cursor-pointer"
          >
            Editar
            <DropdownMenuShortcut>
              <FolderPen size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          {isAvailableToDelete ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setCurrentRow(row.original);
                  setOpen("delete");
                }}
                className="text-red-500! cursor-pointer"
              >
                Eliminar
                <DropdownMenuShortcut>
                  <Trash2 size={16} />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="opacity-70" disabled>
                Verificando...
                <DropdownMenuShortcut>
                  <Loader2 className="animate-spin" size={16} />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
