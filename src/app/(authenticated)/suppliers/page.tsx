import { ConfigDrawer } from "@/components/config-drawer";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { Search } from "@/components/search";
import { ThemeSwitch } from "@/components/theme-switch";
import { SuppliersDialogs } from "./_components/suppliers-dialogs";
import { SuppliersPrimaryButtons } from "./_components/suppliers-primary-buttons";
import { Metadata } from "next";
import { getSuppliers } from "./_actions/supplier";
import { createClientForServer } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getUserByAuthId } from "@/actions/user";
import { User } from "@/context/auth-provider";
import { APP_URLS } from "@/components/layout/data/sidebar-data";
import { SuppliersProvider } from "./_components/suppliers-provider";
import { SuppliersTable } from "./_components/suppliers-table";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Leviatan POS | Gestión de proveedores",
  };
}

export default async function Suppliers() {
  const supabase = await createClientForServer();
  const { data } = await supabase.auth.getUser();

  if (!data.user) return redirect("/sign-in");

  const { usuario } = await getUserByAuthId(data.user.id);
  const permisosUser = (usuario as User)?.rol.permisos.map(
    (p) => p.permiso.codigo
  );

  if (!permisosUser.includes("PROVEEDORES")) {
    const firstPermission = permisosUser[0];
    return redirect(
      APP_URLS[firstPermission as keyof typeof APP_URLS] || "/dashboard"
    );
  }

  const { proveedores } = await getSuppliers(data.user.id);

  return (
    <SuppliersProvider>
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
              Lista de proveedores
            </h2>
            <p className="text-muted-foreground">
              Gestiona los proveedores de la empresa aquí.
            </p>
          </div>
          <SuppliersPrimaryButtons />
        </div>
        <SuppliersTable data={proveedores} />
      </Main>

      <SuppliersDialogs />
    </SuppliersProvider>
  );
}
