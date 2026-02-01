import { getStudents } from "@/actions/students/get-student.action";
import { GetStudentsParams } from "@/actions/students/type";

interface StudentsListPageProps {
  seachParams: Promise<GetStudentsParams>;
}

export default async function StudentsListPage({
  seachParams,
}: StudentsListPageProps) {
  const searchParams = await seachParams;
  const studentesResponse = await getStudents(searchParams);

  if (!studentesResponse?.success) {
    return <div>Error loading students.</div>;
  }

  return <div>Students List Page</div>;
}
