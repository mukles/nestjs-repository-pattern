"use server";

import { fakeClasses } from "@/data/fake-classes";
import { ClassStatus, GetClassesParams, Order } from "@repo/shared-types";

// Using fake data for now - replace with actual API calls later
export async function getClasses(params?: GetClassesParams) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  let filteredClasses = [...fakeClasses];

  // Filter by status (default to active if not specified)
  if (params?.status) {
    filteredClasses = filteredClasses.filter((c) => c.status === params.status);
  } else {
    // By default, only show active classes on the main list
    filteredClasses = filteredClasses.filter(
      (c) => c.status === ClassStatus.ACTIVE,
    );
  }

  // Filter by name
  if (params?.name) {
    const searchTerm = params.name.toLowerCase();
    filteredClasses = filteredClasses.filter((c) =>
      c.name.toLowerCase().includes(searchTerm),
    );
  }

  // Filter by level
  if (params?.level) {
    filteredClasses = filteredClasses.filter((c) => c.level === params.level);
  }

  // Filter by academic year
  if (params?.academicYear) {
    filteredClasses = filteredClasses.filter(
      (c) => c.academicYear === params.academicYear,
    );
  }

  // Sort
  if (params?.sortBy) {
    const sortKey = params.sortBy;
    const isDesc = params.order === Order.DESC;
    filteredClasses.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal === undefined || bVal === undefined) return 0;
      if (aVal < bVal) return isDesc ? 1 : -1;
      if (aVal > bVal) return isDesc ? -1 : 1;
      return 0;
    });
  }

  return {
    success: true as const,
    data: filteredClasses,
  };
}

export async function getClassById(id: number) {
  await new Promise((resolve) => setTimeout(resolve, 50));

  const classItem = fakeClasses.find((c) => c.id === id);

  if (!classItem) {
    return {
      success: false as const,
      error: {
        type: "NOT_FOUND" as const,
        message: "Class not found",
      },
    };
  }

  return {
    success: true as const,
    data: classItem,
  };
}
