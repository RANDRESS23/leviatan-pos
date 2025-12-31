"use client";

import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUsers } from "./users-provider";

export function UsersPrimaryButtons({
  isSuperAdmin,
}: {
  isSuperAdmin: boolean;
}) {
  const { setOpen } = useUsers();

  return (
    <div className="w-full flex flex-col md:flex-row md:justify-end gap-2">
      <Button className="space-x-1" onClick={() => setOpen("add")}>
        <span>{isSuperAdmin ? "Registrar CEO" : "Registrar usuario"}</span>{" "}
        <UserPlus size={18} />
      </Button>
    </div>
  );
}
