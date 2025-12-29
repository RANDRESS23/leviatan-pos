"use client";

import { Link } from "next-view-transitions";
import useDialogState from "@/hooks/use-dialog-state";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignOutDialog } from "@/components/sign-out-dialog";
import { useAuth } from "@/hooks/use-auth";
import { LogOut, ShieldUser } from "lucide-react";

export function ProfileDropdown() {
  const [open, setOpen] = useDialogState();
  const { user, authUser } = useAuth();
  const isSuperAdmin =
    authUser?.email === process.env.NEXT_PUBLIC_EMAIL_SUPER_ADMIN;
  const permisos = user?.rol.permisos.map((p) => p.permiso.codigo);

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/avatars/01.png" alt="@shadcn" />
              <AvatarFallback>
                {user?.primer_nombre
                  ? `${user.primer_nombre.charAt(0)?.toUpperCase()}${user.primer_apellido.charAt(0)?.toUpperCase()}`
                  : "RQ"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col gap-1.5">
              <p className="text-sm leading-none font-medium">
                {user?.primer_nombre
                  ? `${user.primer_nombre} ${user.primer_apellido}`
                  : "Raúl Quimbaya"}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email || authUser?.email || "usuario@ejemplo.com"}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {!isSuperAdmin && permisos?.includes("ROLES_PERMISOS") && (
            <>
              <DropdownMenuGroup>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/roles-and-permissions">
                    <ShieldUser />
                    Roles y Permisos
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setOpen(true)}
            className="cursor-pointer"
          >
            <LogOut />
            Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SignOutDialog open={!!open} onOpenChange={setOpen} />
    </>
  );
}
