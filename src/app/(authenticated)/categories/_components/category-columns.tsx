"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/data-table";
import { LongText } from "@/components/long-text";
import { callTypes, type Category } from "../_data/schema";
import { DataTableRowActions } from "./data-table-row-actions";

export const categoryColumns: ColumnDef<Category>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => {
      return <LongText className="max-w-36">{row.getValue("id")}</LongText>;
    },
    meta: { className: "w-36" },
    enableSorting: false,
  },
  {
    accessorKey: "nombre",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre" />
    ),
    cell: ({ row }) => (
      <div className="w-fit ps-2 text-nowrap">{row.getValue("nombre")}</div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "activa",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => {
      const { activa } = row.original;
      const status = activa ? "ACTIVO" : "INACTIVO";
      const badgeColor = callTypes.get(status);
      return (
        <div className="flex space-x-2">
          <Badge variant="outline" className={cn("capitalize", badgeColor)}>
            {status}
          </Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Acciones" />
    ),
    cell: DataTableRowActions,
    enableHiding: false,
    enableSorting: false,
  },
];
