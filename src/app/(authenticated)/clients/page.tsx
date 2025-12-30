import { ConfigDrawer } from "@/components/config-drawer";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { Search } from "@/components/search";
import { ThemeSwitch } from "@/components/theme-switch";
import { ClientsDialogs } from "./_components/clients-dialogs";
import { ClientsPrimaryButtons } from "./_components/clients-primary-buttons";
import { Metadata } from "next";
import { getClients } from "./_actions/client";
import { createClientForServer } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getUserByAuthId } from "@/actions/user";
import { User } from "@/context/auth-provider";
import { APP_URLS } from "@/components/layout/data/sidebar-data";
import { ClientsProvider } from "./_components/clients-provider";
import { ClientsTable } from "./_components/clients-table";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Leviatan POS | Gestión de clientes",
  };
}

export default async function Clients() {
  const supabase = await createClientForServer();
  const { data } = await supabase.auth.getUser();

  if (!data.user) return redirect("/sign-in");

  const { usuario } = await getUserByAuthId(data.user.id);
  const permisosUser = (usuario as User)?.rol.permisos.map(
    (p) => p.permiso.codigo
  );

  if (!permisosUser.includes("CLIENTES")) {
    const firstPermission = permisosUser[0];
    return redirect(
      APP_URLS[firstPermission as keyof typeof APP_URLS] || "/dashboard"
    );
  }

  const { clientes, tiposDocumento } = await getClients(data.user.id);

  return (
    <ClientsProvider>
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
              Lista de clientes
            </h2>
            <p className="text-muted-foreground">
              Gestiona los clientes de la empresa aquí.
            </p>
          </div>
          <ClientsPrimaryButtons />
        </div>
        <ClientsTable data={clientes} tiposDocumento={tiposDocumento} />
      </Main>

      <ClientsDialogs tiposDocumento={tiposDocumento} />
    </ClientsProvider>
  );
}
