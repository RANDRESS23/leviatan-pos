"use client";

import { Grid2X2Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompanies } from "./companies-provider";

export function CompaniesPrimaryButtons() {
  const { setOpen } = useCompanies();
  return (
    <div className="flex gap-2">
      <Button className="space-x-1" onClick={() => setOpen("add")}>
        <span>Registrar empresa</span> <Grid2X2Plus size={18} />
      </Button>
    </div>
  );
}
