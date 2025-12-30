"use client";

import { Download, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useClients } from "./clients-provider";

export function ClientsPrimaryButtons() {
  const { setOpen } = useClients();

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        className="space-x-1"
        onClick={() => setOpen("import")}
      >
        <span>Importar clientes</span> <Download size={18} />
      </Button>
      <Button className="space-x-1" onClick={() => setOpen("add")}>
        <span>Registrar cliente</span> <UserPlus size={18} />
      </Button>
    </div>
  );
}
