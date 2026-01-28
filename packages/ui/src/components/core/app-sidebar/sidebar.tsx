import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@repo/ui/components/ui-kit/sidebar';
import Link from 'next/link';
import { usePreferencesStore } from '../preferences/hooks';
import { sidebarItems } from './constants';
import { NavMain } from './nav-main';
import { NavUser } from './nav-user';

export function AppSidebar() {
  const { collapsible, variant } = usePreferencesStore();

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <img src="/images/logo.svg" alt="Inno" className="size-8" />
                <span className="text-lg font-bold">Business Intelligence</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
