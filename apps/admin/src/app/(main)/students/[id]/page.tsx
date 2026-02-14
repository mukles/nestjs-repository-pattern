import { getSectionRoutine } from "@/actions/classes";
import { getStudentWithEnrollment } from "@/actions/students/student-enrollment.action";
import { StudentStatus } from "@repo/shared-types";
import { Badge } from "@repo/ui/components/ui-kit/badge";
import { Button } from "@repo/ui/components/ui-kit/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui-kit/card";
import { format } from "date-fns";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  GraduationCap,
  Mail,
  User,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StudentRoutineGrid } from "./_components/student-routine-grid";

interface StudentDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function StudentDetailPage({
  params,
}: StudentDetailPageProps) {
  const { id } = await params;
  const studentId = parseInt(id, 10);

  if (isNaN(studentId)) {
    notFound();
  }

  const result = await getStudentWithEnrollment(studentId);

  if (!result.success) {
    notFound();
  }

  const student = result.data;

  // Get the routine for the student's section
  const routineResult = await getSectionRoutine(student.sectionId);
  const routine = routineResult.success ? routineResult.data : null;

  return (
    <div className="flex h-full flex-col p-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/students/list">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">
              {student.firstName} {student.lastName}
            </h1>
            <Badge
              variant={
                student.status === StudentStatus.ACTIVE
                  ? "success"
                  : "secondary"
              }
            >
              {student.status}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            {student.className} - {student.sectionName} | Roll:{" "}
            {student.rollNumber}
          </p>
        </div>
      </div>

      {/* Student Info Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <User className="size-4" />
              Personal Info
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {student.firstName} {student.lastName}
              </p>
              <p className="text-muted-foreground text-sm">{student.gender}</p>
              <p className="text-muted-foreground text-sm">
                DOB: {format(new Date(student.dateOfBirth), "dd MMM yyyy")}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Mail className="size-4" />
              Contact
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm break-all">{student.email}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <GraduationCap className="size-4" />
              Class & Section
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-sm font-medium">{student.className}</p>
              <p className="text-muted-foreground text-sm">
                {student.sectionName}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <BookOpen className="size-4" />
              Enrollment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-sm font-medium">Roll: {student.rollNumber}</p>
              <p className="text-muted-foreground text-sm">
                Since: {format(new Date(student.createdAt), "dd MMM yyyy")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Class Routine Section */}
      <Card className="flex-1">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="size-5" />
            <CardTitle>Class Routine</CardTitle>
          </div>
          <CardDescription>
            Weekly timetable for {student.className} - {student.sectionName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {routine ? (
            <StudentRoutineGrid routine={routine} />
          ) : (
            <div className="flex h-40 items-center justify-center">
              <p className="text-muted-foreground">
                No routine available for this section yet.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
