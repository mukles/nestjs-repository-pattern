import { getClasses } from "@/actions/classes";
import { ClassStatus, GetClassesParams } from "@repo/shared-types";
import { ArchivedClassFilter } from "./_components/archived-class-filter";
import { ArchivedTableCards } from "./_components/archived-data-table";

interface ArchivedClassesPageProps {
  searchParams: Promise<GetClassesParams>;
}

export default async function ArchivedClassesPage({
  searchParams,
}: ArchivedClassesPageProps) {
  const params = await searchParams;
  const queryParams = {
    ...params,
    status: ClassStatus.ARCHIVED,
  };

  const result = await getClasses(queryParams);

  if (!result?.success) {
    return <div>Error loading archived classes.</div>;
  }

  const data = result.data;

  return (
    <div className="flex h-full flex-col p-8">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Archived Classes
            </h2>
            <p className="text-muted-foreground">
              View and restore archived classes from previous academic years.
            </p>
          </div>
        </div>
        <ArchivedClassFilter />
      </div>
      <div className="mt-8 flex-1">
        <ArchivedTableCards data={data} />
      </div>
    </div>
  );
}
