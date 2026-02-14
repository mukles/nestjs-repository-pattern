"use server";

import { fakeClasses, fakeSections, fakeTeachers } from "@/data/fake-classes";
import {
  CreateSectionDto,
  SectionDto,
  TeacherDto,
  UpdateSectionDto,
} from "@repo/shared-types";

// Using fake data for now - replace with actual API calls later

export async function getTeachers(): Promise<
  | {
      success: true;
      data: TeacherDto[];
    }
  | {
      success: false;
      error: { message: string };
    }
> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 50));

  return {
    success: true,
    data: fakeTeachers,
  };
}

export async function getSectionsByClassId(classId: number): Promise<
  | {
      success: true;
      data: SectionDto[];
    }
  | {
      success: false;
      error: { type: string; message: string };
    }
> {
  await new Promise((resolve) => setTimeout(resolve, 50));

  const classItem = fakeClasses.find((c) => c.id === classId);

  if (!classItem) {
    return {
      success: false,
      error: {
        type: "NOT_FOUND",
        message: "Class not found",
      },
    };
  }

  return {
    success: true,
    data: classItem.sections || [],
  };
}

export async function getSectionById(
  classId: number,
  sectionId: number,
): Promise<
  | {
      success: true;
      data: SectionDto;
    }
  | {
      success: false;
      error: { type: string; message: string };
    }
> {
  await new Promise((resolve) => setTimeout(resolve, 50));

  const classItem = fakeClasses.find((c) => c.id === classId);

  if (!classItem) {
    return {
      success: false,
      error: {
        type: "NOT_FOUND",
        message: "Class not found",
      },
    };
  }

  const section = classItem.sections?.find((s) => s.id === sectionId);

  if (!section) {
    return {
      success: false,
      error: {
        type: "NOT_FOUND",
        message: "Section not found",
      },
    };
  }

  return {
    success: true,
    data: section,
  };
}

export async function createSection(
  classId: number,
  data: CreateSectionDto,
): Promise<
  | {
      success: true;
      data: SectionDto;
    }
  | {
      success: false;
      error: { type: string; message: string };
    }
> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const classItem = fakeClasses.find((c) => c.id === classId);

  if (!classItem) {
    return {
      success: false,
      error: {
        type: "NOT_FOUND",
        message: "Class not found",
      },
    };
  }

  // Check for duplicate section name
  const existingSection = classItem.sections?.find(
    (s) => s.name.toLowerCase() === data.name.toLowerCase(),
  );

  if (existingSection) {
    return {
      success: false,
      error: {
        type: "DUPLICATE",
        message: `Section "${data.name}" already exists in this class`,
      },
    };
  }

  // Generate new section ID
  const maxId = Math.max(...fakeSections.map((s) => s.id), 0);
  const newSection: SectionDto = {
    id: maxId + 1,
    name: data.name,
    capacity: data.capacity,
    currentStudentCount: 0,
    classTeacher: data.classTeacherId
      ? fakeTeachers.find((t) => t.id === data.classTeacherId)
      : undefined,
    subjectTeachers: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Add to the class (in real app, this would be API call)
  if (!classItem.sections) {
    classItem.sections = [];
  }
  classItem.sections.push(newSection);

  // Update class totals
  classItem.totalCapacity = classItem.sections.reduce(
    (sum, s) => sum + s.capacity,
    0,
  );

  return {
    success: true,
    data: newSection,
  };
}

export async function updateSection(
  classId: number,
  sectionId: number,
  data: UpdateSectionDto,
): Promise<
  | {
      success: true;
      data: SectionDto;
    }
  | {
      success: false;
      error: { type: string; message: string };
    }
> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const classItem = fakeClasses.find((c) => c.id === classId);

  if (!classItem) {
    return {
      success: false,
      error: {
        type: "NOT_FOUND",
        message: "Class not found",
      },
    };
  }

  const sectionIndex = classItem.sections?.findIndex((s) => s.id === sectionId);

  if (sectionIndex === undefined || sectionIndex === -1) {
    return {
      success: false,
      error: {
        type: "NOT_FOUND",
        message: "Section not found",
      },
    };
  }

  const section = classItem.sections![sectionIndex]!;

  // Check for duplicate section name (if name is being changed)
  if (data.name && data.name.toLowerCase() !== section.name.toLowerCase()) {
    const existingSection = classItem.sections?.find(
      (s) =>
        s.id !== sectionId && s.name.toLowerCase() === data.name!.toLowerCase(),
    );

    if (existingSection) {
      return {
        success: false,
        error: {
          type: "DUPLICATE",
          message: `Section "${data.name}" already exists in this class`,
        },
      };
    }
  }

  // Update section
  const updatedSection: SectionDto = {
    ...section,
    name: data.name ?? section.name,
    capacity: data.capacity ?? section.capacity,
    classTeacher: data.classTeacherId
      ? fakeTeachers.find((t) => t.id === data.classTeacherId)
      : section.classTeacher,
    updatedAt: new Date(),
  };

  classItem.sections![sectionIndex] = updatedSection;

  // Update class totals
  classItem.totalCapacity = classItem.sections!.reduce(
    (sum, s) => sum + s.capacity,
    0,
  );

  return {
    success: true,
    data: updatedSection,
  };
}

export async function deleteSection(
  classId: number,
  sectionId: number,
): Promise<
  | {
      success: true;
    }
  | {
      success: false;
      error: { type: string; message: string };
    }
> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const classItem = fakeClasses.find((c) => c.id === classId);

  if (!classItem) {
    return {
      success: false,
      error: {
        type: "NOT_FOUND",
        message: "Class not found",
      },
    };
  }

  const sectionIndex = classItem.sections?.findIndex((s) => s.id === sectionId);

  if (sectionIndex === undefined || sectionIndex === -1) {
    return {
      success: false,
      error: {
        type: "NOT_FOUND",
        message: "Section not found",
      },
    };
  }

  const section = classItem.sections![sectionIndex]!;

  // Check if section has students
  if (section.currentStudentCount > 0) {
    return {
      success: false,
      error: {
        type: "HAS_STUDENTS",
        message:
          "Cannot delete section with enrolled students. Please transfer or remove students first.",
      },
    };
  }

  // Remove section
  classItem.sections!.splice(sectionIndex, 1);

  // Update class totals
  classItem.totalCapacity = classItem.sections!.reduce(
    (sum, s) => sum + s.capacity,
    0,
  );
  classItem.totalStudentCount = classItem.sections!.reduce(
    (sum, s) => sum + s.currentStudentCount,
    0,
  );

  return {
    success: true,
  };
}
