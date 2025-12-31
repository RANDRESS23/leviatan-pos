"use client";

import { ShieldUser } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRolesAndPermissions } from "./roles-and-permissions-provider";

export function RolesAndPermissionsPrimaryButtons() {
  const { setOpen } = useRolesAndPermissions();

  return (
    <div className="w-full flex flex-col md:flex-row md:justify-end gap-2">
      <Button className="space-x-1" onClick={() => setOpen("add")}>
        <span>Registrar rol</span> <ShieldUser size={18} />
      </Button>
    </div>
  );
}
