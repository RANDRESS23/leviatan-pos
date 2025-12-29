import { ConfigDrawer } from "@/components/config-drawer";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { Search } from "@/components/search";
import { ThemeSwitch } from "@/components/theme-switch";
import { UsersDialogs } from "./_components/users-dialogs";
import { UsersPrimaryButtons } from "./_components/users-primary-buttons";
import { UsersProvider } from "./_components/users-provider";
import { UsersTable } from "./_components/users-table";
import { Metadata } from "next";
import { getUsers } from "./_actions/user";
import { createClientForServer } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getUserByAuthId } from "@/actions/user";
import { User } from "@/context/auth-provider";
import { APP_URLS } from "@/components/layout/data/sidebar-data";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Leviatan POS | Gestión de usuarios",
  };
}

export default async function Users() {
  const supabase = await createClientForServer();
  const { data } = await supabase.auth.getUser();

  if (!data.user) return redirect("/sign-in");

  const { usuario } = await getUserByAuthId(data.user.id);
  const permisosUser = (usuario as User)?.rol.permisos.map(
    (p) => p.permiso.codigo
  );

  if (!permisosUser.includes("USUARIOS")) {
    const firstPermission = permisosUser[0];
    return redirect(
      APP_URLS[firstPermission as keyof typeof APP_URLS] || "/dashboard"
    );
  }

  const isSuperAdmin = data.user.id === process.env.ID_SUPER_ADMIN;
  const { usuarios, empresas, roles } = await getUsers(
    data.user.id,
    isSuperAdmin
  );

  return (
    <UsersProvider>
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
              Lista de {isSuperAdmin ? "CEOS" : "usuarios"}
            </h2>
            <p className="text-muted-foreground">
              Gestiona los {isSuperAdmin ? "CEOS" : "usuarios"} aqui.
            </p>
          </div>
          <UsersPrimaryButtons isSuperAdmin={isSuperAdmin} />
        </div>
        <UsersTable data={usuarios} roles={roles} />
      </Main>

      <UsersDialogs
        empresas={empresas}
        roles={roles}
        isSuperAdmin={isSuperAdmin}
      />
    </UsersProvider>
  );
}
