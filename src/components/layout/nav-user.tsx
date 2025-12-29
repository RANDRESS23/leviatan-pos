import { Link } from "next-view-transitions";
import { ChevronsUpDown, LogOut, ShieldUser } from "lucide-react";
import useDialogState from "@/hooks/use-dialog-state";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { SignOutDialog } from "@/components/sign-out-dialog";
import { useAuth } from "@/hooks/use-auth";

export function NavUser() {
  const { isMobile } = useSidebar();
  const [open, setOpen] = useDialogState();
  const { user, authUser } = useAuth();
  const isSuperAdmin =
    authUser?.email === process.env.NEXT_PUBLIC_EMAIL_SUPER_ADMIN;
  const permisos = user?.rol.permisos.map((p) => p.permiso.codigo);

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  {/* <AvatarImage
                    src={user.avatar}
                    alt={
                      user?.primer_nombre
                        ? `${user.primer_nombre} ${user.primer_apellido}`
                        : "Raúl Quimbaya"
                    }
                  /> */}
                  <AvatarFallback className="rounded-lg">
                    {user?.primer_nombre
                      ? `${user.primer_nombre.charAt(0)?.toUpperCase()}${user.primer_apellido.charAt(0)?.toUpperCase()}`
                      : "RQ"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-start text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user?.primer_nombre
                      ? `${user.primer_nombre} ${user.primer_apellido}`
                      : "Raúl Quimbaya"}
                  </span>
                  <span className="truncate text-xs">
                    {user?.email || authUser?.email || "usuario@ejemplo.com"}
                  </span>
                </div>
                <ChevronsUpDown className="ms-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-start text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    {/* <AvatarImage
                      src={user.avatar}
                      alt={
                        user?.primer_nombre
                          ? `${user.primer_nombre} ${user.primer_apellido}`
                          : "Raúl Quimbaya"
                      }
                    /> */}
                    <AvatarFallback className="rounded-lg">
                      {user?.primer_nombre
                        ? `${user.primer_nombre.charAt(0)?.toUpperCase()}${user.primer_apellido.charAt(0)?.toUpperCase()}`
                        : "RQ"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-start text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {user?.primer_nombre
                        ? `${user.primer_nombre} ${user.primer_apellido}`
                        : "Raúl Quimbaya"}
                    </span>
                    <span className="truncate text-xs">
                      {user?.email || authUser?.email || "usuario@ejemplo.com"}
                    </span>
                  </div>
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
        </SidebarMenuItem>
      </SidebarMenu>

      <SignOutDialog open={!!open} onOpenChange={setOpen} />
    </>
  );
}
