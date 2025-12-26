import * as React from "react";
import { ChevronsUpDown, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

type TeamSwitcherProps = {
  teams: {
    name: string;
    logo: React.ElementType;
    plan: string;
  }[];
};

export function TeamSwitcher({ teams }: TeamSwitcherProps) {
  const { isMobile } = useSidebar();
  const [activeTeam, setActiveTeam] = React.useState(teams[0]);

  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex items-center gap-x-2 pt-2 pl-2 md:pt-0 md:pl-0">
        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <activeTeam.logo className="size-4" />
        </div>
        <div className="grid flex-1 text-start text-sm leading-tight">
          <span className="truncate font-semibold">{activeTeam.name}</span>
          <span className="truncate text-xs">{activeTeam.plan}</span>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
