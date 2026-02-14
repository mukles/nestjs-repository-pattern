import { getClasses } from "@/actions/classes";
import { ClassStatus, GetClassesParams } from "@repo/shared-types";
import { ClassFilter } from "./_components/class-filter";
import { CreateClassModal } from "./_components/create-class-modal";
import { TableCards } from "./_components/data-table";

interface ClassesListPageProps {
  searchParams: Promise<GetClassesParams>;
}

export default async function ClassesListPage({
  searchParams,
}: ClassesListPageProps) {
  const params = await searchParams;
  // Default to showing active classes only
  const queryParams = {
    ...params,
    status: params.status || ClassStatus.ACTIVE,
  };

  const classesResult = await getClasses(queryParams);

  if (!classesResult?.success) {
    return <div>Error loading classes.</div>;
  }

  const data = classesResult.data;

  return (
    <div className="flex h-full flex-col p-8">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Classes</h2>
            <p className="text-muted-foreground">
              Manage your classes, sections, and assign teachers.
            </p>
          </div>
          <CreateClassModal />
        </div>
        <ClassFilter />
      </div>
      <div className="mt-8 flex-1">
        <TableCards data={data} />
      </div>
    </div>
  );
}
