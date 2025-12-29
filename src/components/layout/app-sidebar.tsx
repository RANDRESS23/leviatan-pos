"use client";

import { useLayout } from "@/context/layout-provider";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
// import { AppTitle } from './app-title'
import { sidebarData } from "./data/sidebar-data";
import { NavGroup } from "./nav-group";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";
import { useAuth } from "@/hooks/use-auth";

export function AppSidebar() {
  const { collapsible, variant } = useLayout();
  const { authUser, user, loading } = useAuth();

  if (loading) {
    return null;
  }

  const isSuperAdmin =
    authUser?.email === process.env.NEXT_PUBLIC_EMAIL_SUPER_ADMIN;
  const permisos = user?.rol.permisos.map((p) => p.permiso.codigo);
  const navGroupFiltered = sidebarData.navGroups.map((group) => ({
    ...group,
    items:
      group.title === "General"
        ? group.items.filter(
            (item) =>
              item.permissionCode && permisos?.includes(item.permissionCode)
          )
        : group.items,
  }));

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />

        {/* Replace <TeamSwitch /> with the following <AppTitle />
         /* if you want to use the normal app title instead of TeamSwitch dropdown */}
        {/* <AppTitle /> */}
      </SidebarHeader>
      <SidebarContent>
        {isSuperAdmin
          ? sidebarData.navGroupsSuperAdmin.map((props) => (
              <NavGroup key={props.title} {...props} />
            ))
          : navGroupFiltered.map((props) => (
              <NavGroup key={props.title} {...props} />
            ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
