"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/data-table";
import { LongText } from "@/components/long-text";
import { callTypes, SupplierStatus } from "../_data/schema";
import { type Supplier } from "../_data/schema";
import { DataTableRowActions } from "./data-table-row-actions";

export const suppliersColumns: ColumnDef<Supplier>[] = [
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
    id: "nit",
    accessorKey: "nit",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="NIT" />
    ),
    cell: ({ row }) => {
      const { nit } = row.original;

      return (
        <div className="flex flex-col items-start">
          <span className="text-sm capitalize">{nit || "N/A"}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.original.nit);
    },
    enableSorting: false,
  },
  {
    accessorKey: "nombre",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre" />
    ),
    cell: ({ row }) => {
      const { nombre } = row.original;

      return <LongText className="max-w-36 ps-3">{nombre}</LongText>;
    },
    enableHiding: false,
  },
  {
    accessorKey: "tipoProveedor",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo proveedor" />
    ),
    cell: ({ row }) => {
      const { tipoProveedor } = row.original;
      const status: SupplierStatus = tipoProveedor as SupplierStatus;
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
    accessorKey: "descripcion",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Descripción" />
    ),
    cell: ({ row }) => {
      return (
        <LongText className="max-w-36">{row.getValue("descripcion")}</LongText>
      );
    },
    meta: { className: "w-36" },
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
