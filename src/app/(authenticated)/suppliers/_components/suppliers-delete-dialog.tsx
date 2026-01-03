"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { type Supplier } from "../_data/schema";
import { deleteSupplierById } from "../_actions/supplier";
import { toast } from "sonner";

type SupplierDeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: Supplier;
  onShoot: () => void;
};

export function SuppliersDeleteDialog({
  open,
  onOpenChange,
  currentRow,
  onShoot,
}: SupplierDeleteDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState("");

  const handleDelete = async () => {
    try {
      setIsLoading(true);

      if (value.trim() !== currentRow.nombre) return;

      const { statusCode, message } = await deleteSupplierById(currentRow.id);

      if (statusCode === 200) {
        toast.success(message);
        onShoot();
        onOpenChange(false);
      } else toast.error(message);
    } catch (error) {
      console.log(error);

      toast.error("¡Error al eliminar el proveedor!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      isLoading={isLoading}
      disabled={value.trim() !== currentRow.nombre}
      title={
        <span className="text-destructive">
          <AlertTriangle
            className="me-1 inline-block stroke-destructive"
            size={18}
          />{" "}
          Eliminar proveedor
        </span>
      }
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            ¿Estás seguro de que deseas eliminar a{" "}
            <span className="font-bold">{currentRow.nombre}</span>?
            <br />
            Esta acción eliminará permanentemente al proveedor con el tipo{" "}
            <span className="font-bold">
              {currentRow.tipoProveedor.toUpperCase()}
            </span>{" "}
            del sistema, debido a que este proveedor no cuenta con compras en el
            sistema.
          </p>

          <Label className="flex flex-col justify-start items-start my-2">
            Nombre del proveedor:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Escribe el nombre del proveedor para confirmar la eliminación."
            />
          </Label>

          <Alert variant="destructive">
            <AlertTitle>¡Advertencia!</AlertTitle>
            <AlertDescription>
              Ten cuidado, esta operación no se puede deshacer.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={isLoading ? "Eliminando proveedor..." : "Eliminar proveedor"}
      cancelBtnText="Cancelar"
      destructive
    />
  );
}
