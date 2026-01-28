import {
  SidebarMenu,
  SidebarMenuItem,
} from '@repo/ui/components/ui-kit/sidebar';
import { useIsMobile } from '@repo/ui/hooks/use-mobile';
import { useMemo } from 'react';
import { UserDropdown } from '../user-dropdown';

export function NavUser() {
  const isMobile = useIsMobile();

  const side = useMemo(() => (isMobile ? 'bottom' : 'right'), [isMobile]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <UserDropdown side={side} align="end" sideOffset={4} />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
