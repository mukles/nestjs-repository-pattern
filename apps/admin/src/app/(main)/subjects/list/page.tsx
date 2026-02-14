import { getClasses } from "@/actions/classes";
import { getTeachers } from "@/actions/classes/get-teachers.action";
import { getSubjects } from "@/actions/subjects";
import { ClassReference, TeacherReference } from "@repo/shared-types";
import { CreateSubjectModal } from "./_components/create-subject-modal";
import { SubjectsTable } from "./_components/subjects-table";

export default async function SubjectsListPage() {
  const [subjectsResult, classesResult, teachersResult] = await Promise.all([
    getSubjects(),
    getClasses({}),
    getTeachers(),
  ]);

  if (!subjectsResult?.success) {
    return <div>Error loading subjects.</div>;
  }

  const data = subjectsResult.data;

  // Create class references for the form
  const availableClasses: ClassReference[] = classesResult?.success
    ? classesResult.data.map((c) => ({ id: c.id, name: c.name }))
    : [];

  // Create teacher references for the form
  const availableTeachers: TeacherReference[] = teachersResult?.success
    ? teachersResult.data.map((t) => ({
        id: t.id,
        firstName: t.firstName,
        lastName: t.lastName,
      }))
    : [];

  return (
    <div className="flex h-full flex-col p-8">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Subjects</h2>
            <p className="text-muted-foreground">
              Manage the subjects taught in your school. Subjects can be
              assigned to sections with teachers.
            </p>
          </div>
          <CreateSubjectModal
            availableClasses={availableClasses}
            availableTeachers={availableTeachers}
          />
        </div>
      </div>
      <div className="mt-8 flex-1">
        <SubjectsTable
          data={data}
          availableClasses={availableClasses}
          availableTeachers={availableTeachers}
        />
      </div>
    </div>
  );
}
