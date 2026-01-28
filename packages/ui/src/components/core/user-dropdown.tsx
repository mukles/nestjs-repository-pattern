import { ChevronsUpDown, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui-kit/avatar';
import { Button } from '../ui-kit/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui-kit/dropdown-menu';
import { SidebarMenuButton } from '../ui-kit/sidebar';

interface UserDropdownProps {
  side: 'top' | 'right' | 'bottom' | 'left' | undefined;
  align: 'start' | 'center' | 'end' | undefined;
  sideOffset?: number;
  isNotFound?: boolean;
}

export function UserDropdown({
  side,
  align,
  sideOffset,
  isNotFound = false,
}: UserDropdownProps) {
  const initials = 'MH';

  const user = {
    name: 'Mukles Ali',
    email: 'muklesdev@gmail.com',
  };

  const Component = isNotFound ? Button : SidebarMenuButton;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Component
          size={'default'}
          className="h-10 border data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={user.email} alt={user.name} />
            <AvatarFallback className="rounded-lg text-black dark:text-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{user.name}</span>
            <span className="truncate text-xs">{user.email}</span>
          </div>
          <ChevronsUpDown className="ml-auto size-4" />
        </Component>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        side={side}
        align={align}
        sideOffset={sideOffset}
        collisionPadding={10}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={user.email} alt={user.name} />
              <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{'Mukles Ali'}</span>
              <span className="truncate text-xs">{'[EMAIL_ADDRESS]'}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onMouseDown={() => {}}>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
