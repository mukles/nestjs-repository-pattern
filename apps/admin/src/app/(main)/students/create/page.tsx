import { Heading } from "@repo/ui/components/ui-kit/heading";
import { StudentForm } from "./_components/student-form";

export default async function CreateStudentPage() {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl space-y-8">
        <div className="space-y-2 text-center">
          <Heading className="text-3xl font-extrabold tracking-tight">
            Create Student
          </Heading>
          <p className="text-muted-foreground">
            Register a new student to the system by filling out the form below.
          </p>
        </div>
        <StudentForm />
      </div>
    </div>
  );
}
