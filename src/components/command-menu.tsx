"use client";

import React from "react";
import { useTransitionRouter } from "next-view-transitions";
import { ArrowRight, ChevronRight, Laptop, Moon, Sun } from "lucide-react";
import { useSearch } from "@/context/search-provider";
import { useTheme } from "next-themes";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { sidebarData } from "./layout/data/sidebar-data";
import { ScrollArea } from "./ui/scroll-area";
import { useAuth } from "@/hooks/use-auth";

export function CommandMenu() {
  const router = useTransitionRouter();
  const { setTheme } = useTheme();
  const { open, setOpen } = useSearch();
  const { authUser } = useAuth();
  const isSuperAdmin =
    authUser?.email === process.env.NEXT_PUBLIC_EMAIL_SUPER_ADMIN;
  const navGroupsToShow = isSuperAdmin
    ? sidebarData.navGroupsSuperAdmin
    : sidebarData.navGroups;

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      setOpen(false);
      command();
    },
    [setOpen]
  );

  return (
    <CommandDialog modal open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Escribe el nombre de un módulo (ej: ventas, productos)..." />
      <CommandList>
        <ScrollArea type="hover" className="h-72 pe-1">
          <CommandEmpty>
            No se encontraron resultados para tu búsqueda.
          </CommandEmpty>
          {navGroupsToShow.map((group) => (
            <CommandGroup key={group.title} heading={group.title}>
              {group.items.map((navItem, i) => {
                if (navItem.url)
                  return (
                    <CommandItem
                      key={`${navItem.url}-${i}`}
                      value={navItem.title}
                      onSelect={() => {
                        runCommand(() => router.push(String(navItem.url)));
                      }}
                      className="cursor-pointer"
                    >
                      <div className="flex size-4 items-center justify-center">
                        <ArrowRight className="size-2 text-muted-foreground/80" />
                      </div>
                      {navItem.title}
                    </CommandItem>
                  );

                return navItem.items?.map((subItem, i) => (
                  <CommandItem
                    key={`${navItem.title}-${subItem.url}-${i}`}
                    value={`${navItem.title}-${subItem.url}`}
                    onSelect={() => {
                      runCommand(() => router.push(String(subItem.url)));
                    }}
                    className="cursor-pointer"
                  >
                    <div className="flex size-4 items-center justify-center">
                      <ArrowRight className="size-2 text-muted-foreground/80" />
                    </div>
                    {navItem.title} <ChevronRight /> {subItem.title}
                  </CommandItem>
                ));
              })}
            </CommandGroup>
          ))}
          <CommandSeparator />
          <CommandGroup heading="Tema">
            <CommandItem
              onSelect={() => runCommand(() => setTheme("light"))}
              className="cursor-pointer"
            >
              <Sun /> <span>Claro</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => setTheme("dark"))}
              className="cursor-pointer"
            >
              <Moon className="scale-90" />
              <span>Oscuro</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => setTheme("system"))}
              className="cursor-pointer"
            >
              <Laptop />
              <span>Sistema</span>
            </CommandItem>
          </CommandGroup>
        </ScrollArea>
      </CommandList>
    </CommandDialog>
  );
}
