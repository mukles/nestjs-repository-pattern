"use client";

import { ClassLevel, Order } from "@repo/shared-types";
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

const levelOptions = [
  { label: "Nursery", value: ClassLevel.NURSERY },
  { label: "Kindergarten", value: ClassLevel.KINDERGARTEN },
  { label: "Primary", value: ClassLevel.PRIMARY },
  { label: "Middle School", value: ClassLevel.MIDDLE },
  { label: "Secondary", value: ClassLevel.SECONDARY },
  { label: "Higher Secondary", value: ClassLevel.HIGHER_SECONDARY },
];

const sortOptions = [
  { label: "Name", value: "name" },
  { label: "Academic Year", value: "academicYear" },
  { label: "Capacity", value: "capacity" },
  { label: "Created At", value: "createdAt" },
];

export function ClassFilter() {
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
        <div className="relative min-w-60 flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder="Search classes..."
            className="pl-10"
            defaultValue={searchParams.get("name") || ""}
            onChange={(e) =>
              handleChange({ name: "name", value: e.target.value })
            }
          />
        </div>

        {/* Level Filter */}
        <Select
          defaultValue={searchParams.get("level") || ""}
          onValueChange={(value) => handleChange({ name: "level", value })}
        >
          <SelectTrigger className="w-[180px]">
            <ListFilter className="text-muted-foreground mr-2 size-4" />
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            {levelOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Academic Year Filter */}
        <Input
          placeholder="Academic Year"
          className="w-[140px]"
          defaultValue={searchParams.get("academicYear") || ""}
          onChange={(e) =>
            handleChange({ name: "academicYear", value: e.target.value })
          }
        />

        {/* Sort By */}
        <Select
          defaultValue={searchParams.get("sortBy") || ""}
          onValueChange={(value) => handleChange({ name: "sortBy", value })}
        >
          <SelectTrigger className="w-[150px]">
            <SortAsc className="text-muted-foreground mr-2 size-4" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Order */}
        <Select
          defaultValue={searchParams.get("order") || ""}
          onValueChange={(value) => handleChange({ name: "order", value })}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={Order.ASC}>Ascending</SelectItem>
            <SelectItem value={Order.DESC}>Descending</SelectItem>
          </SelectContent>
        </Select>

        {/* Reset Button */}
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={handleReset}>
            <RotateCcw className="mr-2 size-4" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
