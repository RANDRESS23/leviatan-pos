import { ConfigDrawer } from "@/components/config-drawer";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { Search } from "@/components/search";
import { ThemeSwitch } from "@/components/theme-switch";
import { RolesAndPermissionsDialogs } from "./_components/roles-and-permissions-dialogs";
import { RolesAndPermissionsPrimaryButtons } from "./_components/roles-and-permissions-primary-buttons";
import { RolesAndPermissionsProvider } from "./_components/roles-and-permissions-provider";
import { RolesAndPermissionsTable } from "./_components/roles-and-permissions-table";
import { getRolesAndPermissions } from "./_actions/rolesAndPermissions";
import { type Metadata } from "next";
import { createClientForServer } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { User } from "@/context/auth-provider";
import { getUserByAuthId } from "@/actions/user";
import { APP_URLS } from "@/components/layout/data/sidebar-data";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Leviatan POS | Gestión de roles y permisos",
  };
}

export default async function RolesAndPermissions() {
  const supabase = await createClientForServer();
  const { data } = await supabase.auth.getUser();

  if (!data.user) return redirect("/sign-in");

  const { usuario } = await getUserByAuthId(data.user.id);
  const permisosUser = (usuario as User)?.rol.permisos.map(
    (p) => p.permiso.codigo
  );

  if (!permisosUser.includes("ROLES_PERMISOS")) {
    const firstPermission = permisosUser[0];
    return redirect(
      APP_URLS[firstPermission as keyof typeof APP_URLS] || "/dashboard"
    );
  }

  const { roles, permisos } = await getRolesAndPermissions(data.user.id);

  return (
    <RolesAndPermissionsProvider>
      <Header fixed>
        <Search />
        <div className="ms-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Lista de roles
            </h2>
            <p className="text-muted-foreground">
              Gestiona todos los roles y permisos aqui.
            </p>
          </div>
          <RolesAndPermissionsPrimaryButtons />
        </div>
        <RolesAndPermissionsTable data={roles} permisos={permisos} />
      </Main>

      <RolesAndPermissionsDialogs permisos={permisos} />
    </RolesAndPermissionsProvider>
  );
}
