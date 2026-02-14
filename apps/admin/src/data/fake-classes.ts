import {
  ClassDto,
  ClassLevel,
  ClassStatus,
  SectionDto,
  SectionSubjectTeacherDto,
  SubjectDto,
  TeacherDto,
} from "@repo/shared-types";

// ============ TEACHERS ============
export const fakeTeachers: TeacherDto[] = [
  {
    id: 1,
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@school.edu",
  },
  {
    id: 2,
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@school.edu",
  },
  {
    id: 3,
    firstName: "Michael",
    lastName: "Williams",
    email: "michael.williams@school.edu",
  },
  {
    id: 4,
    firstName: "Emily",
    lastName: "Brown",
    email: "emily.brown@school.edu",
  },
  {
    id: 5,
    firstName: "David",
    lastName: "Davis",
    email: "david.davis@school.edu",
  },
  {
    id: 6,
    firstName: "Jessica",
    lastName: "Miller",
    email: "jessica.miller@school.edu",
  },
  {
    id: 7,
    firstName: "Robert",
    lastName: "Wilson",
    email: "robert.wilson@school.edu",
  },
  {
    id: 8,
    firstName: "Amanda",
    lastName: "Taylor",
    email: "amanda.taylor@school.edu",
  },
  {
    id: 9,
    firstName: "James",
    lastName: "Anderson",
    email: "james.anderson@school.edu",
  },
  {
    id: 10,
    firstName: "Lisa",
    lastName: "Thomas",
    email: "lisa.thomas@school.edu",
  },
  {
    id: 11,
    firstName: "Daniel",
    lastName: "Jackson",
    email: "daniel.jackson@school.edu",
  },
  {
    id: 12,
    firstName: "Jennifer",
    lastName: "White",
    email: "jennifer.white@school.edu",
  },
];

// Class references for subject assignments
const classReferences = {
  class1: { id: 1, name: "Class 1" },
  class2: { id: 2, name: "Class 2" },
  class3: { id: 3, name: "Nursery A" },
  class4: { id: 4, name: "Grade 5" },
  class5: { id: 5, name: "Grade 6" },
  class6: { id: 6, name: "Grade 7" },
  class7: { id: 7, name: "Grade 8" },
  class8: { id: 8, name: "Grade 9" },
  class9: { id: 9, name: "Grade 10" },
};

// Teacher references for subject assignments
const teacherRefs = {
  t1: { id: 1, firstName: "John", lastName: "Smith" },
  t2: { id: 2, firstName: "Sarah", lastName: "Johnson" },
  t3: { id: 3, firstName: "Michael", lastName: "Williams" },
  t4: { id: 4, firstName: "Emily", lastName: "Brown" },
  t5: { id: 5, firstName: "David", lastName: "Davis" },
  t6: { id: 6, firstName: "Jessica", lastName: "Miller" },
  t7: { id: 7, firstName: "Robert", lastName: "Wilson" },
  t8: { id: 8, firstName: "Amanda", lastName: "Taylor" },
  t9: { id: 9, firstName: "James", lastName: "Anderson" },
  t10: { id: 10, firstName: "Lisa", lastName: "Thomas" },
  t11: { id: 11, firstName: "Daniel", lastName: "Jackson" },
  t12: { id: 12, firstName: "Jennifer", lastName: "White" },
};

// All primary classes (1-5)
const primaryClasses = [
  classReferences.class1,
  classReferences.class2,
  classReferences.class3,
  classReferences.class4,
];

// Middle school classes (6-8)
const middleClasses = [
  classReferences.class5,
  classReferences.class6,
  classReferences.class7,
];

// Secondary classes (9-10)
const secondaryClasses = [classReferences.class8, classReferences.class9];

// All classes
const allClasses = [...primaryClasses, ...middleClasses, ...secondaryClasses];

// ============ SUBJECTS ============
export const fakeSubjects: SubjectDto[] = [
  {
    id: 1,
    name: "Bangla",
    code: "BNG",
    description: "Bengali language and literature",
    isActive: true,
    classes: allClasses,
    teachers: [teacherRefs.t1, teacherRefs.t2],
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
  {
    id: 2,
    name: "English",
    code: "ENG",
    description: "English language and literature",
    isActive: true,
    classes: allClasses,
    teachers: [teacherRefs.t2, teacherRefs.t3],
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
  {
    id: 3,
    name: "Mathematics",
    code: "MATH",
    description: "Mathematics and arithmetic",
    isActive: true,
    classes: allClasses,
    teachers: [teacherRefs.t4, teacherRefs.t5, teacherRefs.t9],
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
  {
    id: 4,
    name: "Science",
    code: "SCI",
    description: "General science",
    isActive: true,
    classes: [...primaryClasses, ...middleClasses],
    teachers: [teacherRefs.t6, teacherRefs.t10],
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
  {
    id: 5,
    name: "Social Studies",
    code: "SS",
    description: "History, geography, and civics",
    isActive: true,
    classes: allClasses,
    teachers: [teacherRefs.t7],
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
  {
    id: 6,
    name: "Religion",
    code: "REL",
    description: "Religious studies",
    isActive: true,
    classes: allClasses,
    teachers: [teacherRefs.t8],
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
  {
    id: 7,
    name: "Physical Education",
    code: "PE",
    description: "Sports and physical activities",
    isActive: true,
    classes: allClasses,
    teachers: [teacherRefs.t11],
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
  {
    id: 8,
    name: "Art & Craft",
    code: "ART",
    description: "Drawing, painting, and crafts",
    isActive: true,
    classes: primaryClasses,
    teachers: [teacherRefs.t12],
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
  {
    id: 9,
    name: "Computer Science",
    code: "CS",
    description: "Computer fundamentals and programming",
    isActive: true,
    classes: [...middleClasses, ...secondaryClasses],
    teachers: [teacherRefs.t9, teacherRefs.t3],
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
  {
    id: 10,
    name: "Physics",
    code: "PHY",
    description: "Physics for higher grades",
    isActive: true,
    classes: secondaryClasses,
    teachers: [teacherRefs.t4, teacherRefs.t10],
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
  {
    id: 11,
    name: "Chemistry",
    code: "CHEM",
    description: "Chemistry for higher grades",
    isActive: true,
    classes: secondaryClasses,
    teachers: [teacherRefs.t6],
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
  {
    id: 12,
    name: "Biology",
    code: "BIO",
    description: "Biology for higher grades",
    isActive: true,
    classes: secondaryClasses,
    teachers: [teacherRefs.t10, teacherRefs.t6],
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  },
];

// Helper to create subject teachers for a section
function createSubjectTeachers(
  startId: number,
  subjectIds: number[],
  teacherIds: number[],
): SectionSubjectTeacherDto[] {
  return subjectIds.map((subjectId, index) => ({
    id: startId + index,
    subject: fakeSubjects.find((s) => s.id === subjectId)!,
    teacher: fakeTeachers.find(
      (t) => t.id === teacherIds[index % teacherIds.length],
    )!,
  }));
}

// Primary subjects: Bangla, English, Math, Science (for Grade 1-2)
const primarySubjectIds = [1, 2, 3, 4];

// ============ SECTIONS ============
export const fakeSections: SectionDto[] = [
  // Grade 1 - Section A
  {
    id: 1,
    name: "A",
    capacity: 30,
    currentStudentCount: 28,
    classTeacher: fakeTeachers[0],
    subjectTeachers: createSubjectTeachers(1, primarySubjectIds, [1, 2, 3, 4]),
    createdAt: new Date("2025-08-01"),
    updatedAt: new Date("2025-08-01"),
  },
  // Grade 1 - Section B
  {
    id: 2,
    name: "B",
    capacity: 30,
    currentStudentCount: 25,
    classTeacher: fakeTeachers[1],
    subjectTeachers: createSubjectTeachers(5, primarySubjectIds, [5, 6, 7, 8]),
    createdAt: new Date("2025-08-01"),
    updatedAt: new Date("2025-08-01"),
  },
  // Grade 2 - Section A
  {
    id: 3,
    name: "A",
    capacity: 32,
    currentStudentCount: 30,
    classTeacher: fakeTeachers[2],
    subjectTeachers: createSubjectTeachers(9, primarySubjectIds, [1, 3, 5, 7]),
    createdAt: new Date("2025-08-01"),
    updatedAt: new Date("2025-08-01"),
  },
  // Grade 2 - Section B
  {
    id: 4,
    name: "B",
    capacity: 32,
    currentStudentCount: 28,
    classTeacher: fakeTeachers[3],
    subjectTeachers: createSubjectTeachers(13, primarySubjectIds, [2, 4, 6, 8]),
    createdAt: new Date("2025-08-01"),
    updatedAt: new Date("2025-08-01"),
  },
  // Nursery Blue
  {
    id: 5,
    name: "Blue",
    capacity: 20,
    currentStudentCount: 18,
    classTeacher: fakeTeachers[4],
    subjectTeachers: createSubjectTeachers(17, [1, 2, 3], [9, 10, 11]),
    createdAt: new Date("2025-08-01"),
    updatedAt: new Date("2025-08-01"),
  },
  // Nursery Green
  {
    id: 6,
    name: "Green",
    capacity: 20,
    currentStudentCount: 15,
    classTeacher: fakeTeachers[5],
    subjectTeachers: createSubjectTeachers(20, [1, 2, 3], [9, 10, 12]),
    createdAt: new Date("2025-08-01"),
    updatedAt: new Date("2025-08-01"),
  },
  // KG - Section A
  {
    id: 7,
    name: "A",
    capacity: 25,
    currentStudentCount: 24,
    classTeacher: fakeTeachers[6],
    subjectTeachers: createSubjectTeachers(23, [1, 2, 3], [1, 2, 3]),
    createdAt: new Date("2025-08-01"),
    updatedAt: new Date("2025-08-01"),
  },
  // Grade 6 - Section A
  {
    id: 8,
    name: "A",
    capacity: 35,
    currentStudentCount: 32,
    classTeacher: fakeTeachers[7],
    subjectTeachers: createSubjectTeachers(
      26,
      [1, 2, 3, 4, 5, 6],
      [1, 2, 3, 4, 5, 6],
    ),
    createdAt: new Date("2025-08-01"),
    updatedAt: new Date("2025-08-01"),
  },
  // Grade 9 - Section A (Science)
  {
    id: 9,
    name: "A",
    capacity: 40,
    currentStudentCount: 38,
    classTeacher: fakeTeachers[8],
    subjectTeachers: createSubjectTeachers(
      32,
      [1, 2, 3, 10, 11, 12, 9],
      [1, 2, 3, 4, 5, 6, 7],
    ),
    createdAt: new Date("2025-08-01"),
    updatedAt: new Date("2025-08-01"),
  },
  // Grade 11 Science - Section A
  {
    id: 10,
    name: "A",
    capacity: 45,
    currentStudentCount: 42,
    classTeacher: fakeTeachers[9],
    subjectTeachers: createSubjectTeachers(
      39,
      [1, 2, 10, 11, 12, 9],
      [1, 2, 8, 9, 10, 11],
    ),
    createdAt: new Date("2025-08-01"),
    updatedAt: new Date("2025-08-01"),
  },
  // Grade 11 Commerce - Section A
  {
    id: 11,
    name: "A",
    capacity: 40,
    currentStudentCount: 35,
    classTeacher: fakeTeachers[10],
    subjectTeachers: createSubjectTeachers(
      45,
      [1, 2, 3, 5, 9],
      [1, 2, 3, 4, 5],
    ),
    createdAt: new Date("2025-08-01"),
    updatedAt: new Date("2025-08-01"),
  },
  // Archived: Grade 1 (2024) - Section A
  {
    id: 12,
    name: "A",
    capacity: 30,
    currentStudentCount: 29,
    classTeacher: fakeTeachers[0],
    subjectTeachers: createSubjectTeachers(50, primarySubjectIds, [1, 2, 3, 4]),
    createdAt: new Date("2024-08-01"),
    updatedAt: new Date("2025-07-31"),
  },
  // Archived: Grade 1 (2024) - Section B
  {
    id: 13,
    name: "B",
    capacity: 30,
    currentStudentCount: 27,
    classTeacher: fakeTeachers[1],
    subjectTeachers: createSubjectTeachers(54, primarySubjectIds, [5, 6, 7, 8]),
    createdAt: new Date("2024-08-01"),
    updatedAt: new Date("2025-07-31"),
  },
];

// ============ CLASSES ============
export const fakeClasses: ClassDto[] = [
  {
    id: 1,
    name: "Grade 1",
    level: ClassLevel.PRIMARY,
    academicYear: "2025-2026",
    status: ClassStatus.ACTIVE,
    sections: [fakeSections[0]!, fakeSections[1]!], // A, B
    totalCapacity: 60,
    totalStudentCount: 53,
    createdAt: new Date("2025-08-01"),
    updatedAt: new Date("2025-08-01"),
  },
  {
    id: 2,
    name: "Grade 2",
    level: ClassLevel.PRIMARY,
    academicYear: "2025-2026",
    status: ClassStatus.ACTIVE,
    sections: [fakeSections[2]!, fakeSections[3]!], // A, B
    totalCapacity: 64,
    totalStudentCount: 58,
    createdAt: new Date("2025-08-01"),
    updatedAt: new Date("2025-08-01"),
  },
  {
    id: 3,
    name: "Nursery",
    level: ClassLevel.NURSERY,
    academicYear: "2025-2026",
    status: ClassStatus.ACTIVE,
    sections: [fakeSections[4]!, fakeSections[5]!], // Blue, Green
    totalCapacity: 40,
    totalStudentCount: 33,
    createdAt: new Date("2025-08-01"),
    updatedAt: new Date("2025-08-01"),
  },
  {
    id: 4,
    name: "Kindergarten",
    level: ClassLevel.KINDERGARTEN,
    academicYear: "2025-2026",
    status: ClassStatus.ACTIVE,
    sections: [fakeSections[6]!], // A
    totalCapacity: 25,
    totalStudentCount: 24,
    createdAt: new Date("2025-08-01"),
    updatedAt: new Date("2025-08-01"),
  },
  {
    id: 5,
    name: "Grade 6",
    level: ClassLevel.MIDDLE,
    academicYear: "2025-2026",
    status: ClassStatus.ACTIVE,
    sections: [fakeSections[7]!], // A
    totalCapacity: 35,
    totalStudentCount: 32,
    createdAt: new Date("2025-08-01"),
    updatedAt: new Date("2025-08-01"),
  },
  {
    id: 6,
    name: "Grade 9",
    level: ClassLevel.SECONDARY,
    academicYear: "2025-2026",
    status: ClassStatus.ACTIVE,
    sections: [fakeSections[8]!], // A
    totalCapacity: 40,
    totalStudentCount: 38,
    createdAt: new Date("2025-08-01"),
    updatedAt: new Date("2025-08-01"),
  },
  {
    id: 7,
    name: "Grade 11 Science",
    level: ClassLevel.HIGHER_SECONDARY,
    academicYear: "2025-2026",
    status: ClassStatus.ACTIVE,
    sections: [fakeSections[9]!], // A
    totalCapacity: 45,
    totalStudentCount: 42,
    createdAt: new Date("2025-08-01"),
    updatedAt: new Date("2025-08-01"),
  },
  {
    id: 8,
    name: "Grade 11 Commerce",
    level: ClassLevel.HIGHER_SECONDARY,
    academicYear: "2025-2026",
    status: ClassStatus.ACTIVE,
    sections: [fakeSections[10]!], // A
    totalCapacity: 40,
    totalStudentCount: 35,
    createdAt: new Date("2025-08-01"),
    updatedAt: new Date("2025-08-01"),
  },
  // Archived
  {
    id: 9,
    name: "Grade 1 (2024)",
    level: ClassLevel.PRIMARY,
    academicYear: "2024-2025",
    status: ClassStatus.ARCHIVED,
    sections: [fakeSections[11]!, fakeSections[12]!], // A, B
    totalCapacity: 60,
    totalStudentCount: 56,
    createdAt: new Date("2024-08-01"),
    updatedAt: new Date("2025-07-31"),
  },
];
