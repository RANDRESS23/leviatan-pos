"use client";

import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

interface SignOutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SignOutDialog({ open, onOpenChange }: SignOutDialogProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return toast.error("¡Error al cerrar sesión!");
      }

      toast.success("¡Cierre de sesión exitosamente!");
      router.push("/sign-in");
    } catch (error) {
      console.log({ error });
      toast.error("¡Error al cerrar sesión!");
    }
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Sign out"
      desc="Are you sure you want to sign out? You will need to sign in again to access your account."
      confirmText="Sign out"
      destructive
      handleConfirm={handleSignOut}
      className="sm:max-w-sm"
    />
  );
}
