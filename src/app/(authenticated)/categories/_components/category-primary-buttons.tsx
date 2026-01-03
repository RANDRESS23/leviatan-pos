"use client";

import { BookmarkPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCategory } from "./category-provider";

export function CategoryPrimaryButtons() {
  const { setOpen } = useCategory();

  return (
    <div className="w-full flex flex-col md:flex-row md:justify-end gap-2">
      <Button className="space-x-1" onClick={() => setOpen("add")}>
        <span>Registrar categoría</span> <BookmarkPlus size={18} />
      </Button>
    </div>
  );
}
