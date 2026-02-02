"use client";

import { Order } from "@repo/shared-types";
import { Button } from "@repo/ui/components/ui-kit/button";
import { Input } from "@repo/ui/components/ui-kit/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui-kit/select";
import { ListFilter, RotateCcw, Search, SortAsc } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const sortOptions = [
  { label: "First Name", value: "firstName" },
  { label: "Last Name", value: "lastName" },
  { label: "Email", value: "email" },
  { label: "Created At", value: "createdAt" },
  { label: "Updated At", value: "updatedAt" },
];

export function StudentFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const handleReset = () => {
    router.push(pathname);
  };

  const handleChange = ({ name, value }: { name: string; value: string }) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }

    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  const hasFilters = searchParams.toString().length > 0;

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search Group */}
        <div className="relative min-w-[240px] flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder="Search by name..."
            value={searchParams.get("name") ?? ""}
            name="name"
            onChange={(e) =>
              handleChange({ name: e.target.name, value: e.target.value })
            }
            className="bg-background/50 focus-visible:bg-background h-10 pl-9 transition-colors"
          />
        </div>

        <div className="relative min-w-[240px] flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder="Search by email..."
            value={searchParams.get("email") ?? ""}
            name="email"
            onChange={(e) =>
              handleChange({ name: e.target.name, value: e.target.value })
            }
            className="bg-background/50 focus-visible:bg-background h-10 pl-9 transition-colors"
          />
        </div>

        {/* Sort Group */}
        <div className="flex items-center gap-2">
          <Select
            value={searchParams.get("sortBy") ?? ""}
            onValueChange={(value) => handleChange({ name: "sortBy", value })}
          >
            <SelectTrigger className="bg-background/50 h-10 w-[180px] transition-colors">
              <div className="flex items-center gap-2">
                <ListFilter className="text-muted-foreground size-4" />
                <SelectValue placeholder="Sort by" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={searchParams.get("order") ?? ""}
            onValueChange={(value) => handleChange({ name: "order", value })}
          >
            <SelectTrigger className="bg-background/50 h-10 w-[140px] transition-colors">
              <div className="flex items-center gap-2">
                <SortAsc className="text-muted-foreground size-4" />
                <SelectValue placeholder="Order" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={Order.ASC}>Ascending</SelectItem>
              <SelectItem value={Order.DESC}>Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Action Group */}
        {hasFilters && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleReset}
            className="text-muted-foreground hover:text-foreground h-10 px-3 transition-all"
          >
            <RotateCcw className="mr-2 size-4" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
