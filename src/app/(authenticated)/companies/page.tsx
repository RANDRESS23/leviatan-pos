import { ConfigDrawer } from "@/components/config-drawer";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { Search } from "@/components/search";
import { ThemeSwitch } from "@/components/theme-switch";
import { CompaniesDialogs } from "./_components/companies-dialogs";
import { CompaniesPrimaryButtons } from "./_components/companies-primary-buttons";
import { CompaniesProvider } from "./_components/companies-provider";
import { CompaniesTable } from "./_components/companies-table";
import { getCompanies } from "./_actions/company";
import { type Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Leviatan POS | Gestión de empresas",
  };
}

export default async function Companies() {
  const { empresas } = await getCompanies();

  return (
    <CompaniesProvider>
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
              Lista de empresas
            </h2>
            <p className="text-muted-foreground">
              Gestiona todas las empresas aqui.
            </p>
          </div>
          <CompaniesPrimaryButtons />
        </div>
        <CompaniesTable data={empresas} />
      </Main>

      <CompaniesDialogs />
    </CompaniesProvider>
  );
}
