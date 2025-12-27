"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/data-table";
import { LongText } from "@/components/long-text";
import { callTypes } from "../_data/schema";
import { CompanyStatus, type Company } from "../_data/schema";
import { DataTableRowActions } from "./data-table-row-actions";

export const companiesColumns: ColumnDef<Company>[] = [
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
    accessorKey: "emailContacto",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Correo eletrónico" />
    ),
    cell: ({ row }) => (
      <LongText className="max-w-36 ps-3">
        {row.getValue("emailContacto") || "N/A"}
      </LongText>
    ),
  },
  {
    accessorKey: "telefono",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Teléfono" />
    ),
    cell: ({ row }) => (
      <div className="whitespace-nowrap">
        {row.getValue("telefono") || "N/A"}
      </div>
    ),
    enableSorting: false,
  },
  {
    id: "estado",
    accessorKey: "estado.codigo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => {
      const { estado } = row.original;
      const badgeColor = callTypes.get(estado.codigo as CompanyStatus);

      return (
        <div className="flex space-x-2">
          <Badge variant="outline" className={cn("capitalize", badgeColor)}>
            {estado.codigo}
          </Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const estado = row.getValue(id);
      return value.includes(estado);
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "moduloRestaurante",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Módulo restaurante" />
    ),
    cell: ({ row }) => {
      const { moduloRestaurante } = row.original;
      const status = moduloRestaurante ? "ACTIVO" : "INACTIVO";
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
