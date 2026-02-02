"use client";

import { logout } from "@/actions/auth";
import { User } from "@/actions/auth/user/types";
import { getInitials } from "@/lib/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/ui-kit/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui-kit/dropdown-menu";
import { BadgeCheck, Bell, CreditCard, LogOut } from "lucide-react";

export function AccountSwitcher({ user }: { readonly user: User }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="size-9 rounded-lg">
          <AvatarImage
            src={user.avatar || undefined}
            alt={`${user.firstName} ${user.lastName}`}
          />
          <AvatarFallback className="rounded-lg">
            {getInitials(`${user.firstName} ${user.lastName}`)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="min-w-56 space-y-1 rounded-lg"
        side="bottom"
        align="end"
        sideOffset={4}
      >
        <div className="flex w-full items-center gap-2 px-1 py-1.5">
          <Avatar className="size-9 rounded-lg">
            <AvatarImage
              src={user.avatar || undefined}
              alt={`${user.firstName} ${user.lastName}`}
            />
            <AvatarFallback className="rounded-lg">
              {getInitials(`${user.firstName} ${user.lastName}`)}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{`${user.firstName} ${user.lastName}`}</span>
            <span className="truncate text-xs capitalize">
              {user?.roles?.map((r) => r).join(", ")}
            </span>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <BadgeCheck />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Bell />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
