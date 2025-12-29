"use client";

import { useTransitionRouter } from "next-view-transitions";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

interface SignOutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SignOutDialog({ open, onOpenChange }: SignOutDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useTransitionRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();

      if (error) {
        return toast.error("¡Error al cerrar sesión!");
      }

      toast.success("¡Cierre de sesión exitosamente!");
      router.push("/sign-in");
    } catch (error) {
      console.log({ error });
      toast.error("¡Error al cerrar sesión!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Cerrar sesión"
      desc="¿Estás seguro de que quieres cerrar sesión? Necesitarás iniciar sesión de nuevo para acceder a tu cuenta."
      confirmText={isLoading ? "Cerrando sesión.." : "Cerrar sesión"}
      cancelBtnText="Cancelar"
      destructive
      disabled={isLoading}
      handleConfirm={handleSignOut}
      className="sm:max-w-sm"
    />
  );
}
