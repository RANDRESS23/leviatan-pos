"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/data-table";
import { LongText } from "@/components/long-text";
import { callTypes } from "../_data/schema";
import { type Client } from "../_data/schema";
import { DataTableRowActions } from "./data-table-row-actions";

export const clientsColumns: ColumnDef<Client>[] = [
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
    id: "documento",
    accessorKey: "documento",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="N° Documento" />
    ),
    cell: ({ row }) => {
      const { numeroDocumento, tipoDocumento } = row.original;

      return (
        <div className="flex flex-col items-start">
          <span className="text-sm capitalize">{numeroDocumento}</span>
          <span className="text-xs text-muted-foreground">
            {tipoDocumento.tipoDocumento}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.original.tipoDocumentoId);
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "nombre",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre" />
    ),
    cell: ({ row }) => {
      const {
        primer_nombre,
        segundo_nombre,
        primer_apellido,
        segundo_apellido,
      } = row.original;
      const fullName = `${primer_nombre} ${segundo_nombre ? `${segundo_nombre} ` : ""}${primer_apellido}${segundo_apellido ? ` ${segundo_apellido}` : ""}`;
      return <LongText className="max-w-36 ps-3">{fullName}</LongText>;
    },
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Correo electrónico" />
    ),
    cell: ({ row }) => (
      <LongText className="max-w-36 ps-3">{row.getValue("email")}</LongText>
    ),
  },
  {
    accessorKey: "telefono",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Teléfono" />
    ),
    cell: ({ row }) => (
      <div className="whitespace-nowrap">{row.getValue("telefono")}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "activo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => {
      const { activo } = row.original;
      const status = activo ? "ACTIVO" : "INACTIVO";
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
