"use client";

import React, { useState } from "react";
import useDialogState from "@/hooks/use-dialog-state";
import { type Category } from "../_data/schema";

type CategoryDialogType = "add" | "edit" | "delete";

type CategoryContextType = {
  open: CategoryDialogType | null;
  setOpen: (str: CategoryDialogType | null) => void;
  currentRow: Category | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<Category | null>>;
};

const CategoryContext = React.createContext<CategoryContextType | null>(null);

export function CategoryProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<CategoryDialogType>(null);
  const [currentRow, setCurrentRow] = useState<Category | null>(null);

  return (
    <CategoryContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </CategoryContext>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCategory = () => {
  const categoryContext = React.useContext(CategoryContext);

  if (!categoryContext) {
    throw new Error("useCategory has to be used within <CategoryContext>");
  }

  return categoryContext;
};
