"use server";

import { fakeTeachers } from "@/data/fake-classes";

// Using fake data for now - replace with actual API calls later
export async function getTeachers() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 50));

  return {
    success: true as const,
    data: fakeTeachers,
  };
}
