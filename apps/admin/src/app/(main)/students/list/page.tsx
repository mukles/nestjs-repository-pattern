import { getStudents } from "@/actions/students/get-student.action";
import { GetStudentsParams } from "@repo/shared-types";
import { TableCards } from "./_components/data-table";

import { CreateStudentModal } from "./_components/create-student-modal";
import { StudentFilter } from "./_components/student-filter";

interface StudentsListPageProps {
  searchParams: Promise<GetStudentsParams>;
}

export default async function StudentsListPage({
  searchParams,
}: StudentsListPageProps) {
  const params = await searchParams;
  const result = await getStudents(params);

  if (!result?.success) {
    return <div>Error loading students.</div>;
  }

  const data = result.data;

  return (
    <div className="flex h-full flex-col p-8">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Students</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of students in the system!
            </p>
          </div>
          <CreateStudentModal />
        </div>
        <StudentFilter />
      </div>
      <div className="mt-8 flex-1">
        <TableCards data={data} />
      </div>
    </div>
  );
}
