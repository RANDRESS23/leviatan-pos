"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/data-table";
import { LongText } from "@/components/long-text";
import { callTypes, RoleStatus, type Role } from "../_data/schema";
import { DataTableRowActions } from "./data-table-row-actions";

export const rolesAndPermissionsColumns: ColumnDef<Role>[] = [
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
    accessorKey: "descripcion",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Descripción" />
    ),
    cell: ({ row }) => (
      <div className="whitespace-nowrap">
        {row.getValue("descripcion") || "N/A"}
      </div>
    ),
    enableSorting: false,
  },
  {
    id: "permisos",
    accessorKey: "permisos",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Permisos" />
    ),
    cell: ({ row }) => {
      const { permisos } = row.original;

      return (
        <div className="flex flex-wrap gap-1">
          {permisos.map((permiso) => {
            const badgeColor = callTypes.get(
              permiso.permiso.codigo as RoleStatus
            );

            return (
              <Badge
                key={permiso.permisoId}
                variant="outline"
                className={cn("capitalize text-xs", badgeColor)}
              >
                {permiso.permiso.codigo}
              </Badge>
            );
          })}
        </div>
      );
    },
    meta: { className: "max-w-[40rem]" },
    filterFn: (row, id, value) => {
      const permisos = row.getValue(id) as any[];
      if (!value || value.length === 0) return true;

      return permisos.some((permiso: any) => value.includes(permiso.permisoId));
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
