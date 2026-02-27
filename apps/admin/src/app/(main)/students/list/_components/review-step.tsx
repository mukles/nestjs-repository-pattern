import { AttachmentsFormValues } from "@/lib/validation/attachments.schema";
import { ParentFormValues } from "@/lib/validation/parent.schema";
import { StudentFormValues } from "@/lib/validation/student.schema";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui-kit/card";
import { useStepperContext } from "@repo/ui/components/ui-kit/stepper";

export function ReviewStep() {
  const { getStepValues } = useStepperContext<{
    1: StudentFormValues;
    2: ParentFormValues;
    3: AttachmentsFormValues;
  }>();

  const student = getStepValues(1);
  const parent = getStepValues(2);
  const attachments = getStepValues(3);

  return (
    <div className="space-y-10">
      {/* Student Info */}
      <div>
        <h2 className="mb-2 text-lg font-bold">Student Information</h2>
        <Card>
          <CardHeader>
            <CardTitle>Student Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <span className="font-semibold">Name:</span>{" "}
                {student
                  ? `${student.firstName || "-"} ${student.lastName || "-"}`
                  : "-"}
              </div>
              <div>
                <span className="font-semibold">Email:</span>{" "}
                {student?.email || "-"}
              </div>
              <div>
                <span className="font-semibold">Date of Birth:</span>{" "}
                {student?.dateOfBirth || "-"}
              </div>
              <div>
                <span className="font-semibold">Gender:</span>{" "}
                {student?.gender || "-"}
              </div>
              <div>
                <span className="font-semibold">Status:</span>{" "}
                {student?.status || "-"}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <hr className="my-6" />
      {/* Parents Info */}
      <div>
        <h2 className="mb-2 text-lg font-bold">Parent(s) Information</h2>
        <Card>
          <CardHeader>
            <CardTitle>Parents Info</CardTitle>
          </CardHeader>
          <CardContent>
            {parent && parent.parents && parent.parents.length > 0 ? (
              <div className="space-y-4">
                {parent.parents.map((p, i) => (
                  <div key={i} className="rounded-md border bg-gray-50 p-3">
                    <div>
                      <span className="font-semibold">Type:</span>{" "}
                      {p.type || "-"}
                    </div>
                    <div>
                      <span className="font-semibold">Name:</span>{" "}
                      {p.name || "-"}
                    </div>
                    <div>
                      <span className="font-semibold">Email:</span>{" "}
                      {p.email || "-"}
                    </div>
                    <div>
                      <span className="font-semibold">Phone:</span>{" "}
                      {p.phone || "-"}
                    </div>
                    <div>
                      <span className="font-semibold">Occupation:</span>{" "}
                      {p.occupation || "-"}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>No parent info provided.</div>
            )}
          </CardContent>
        </Card>
      </div>
      <hr className="my-6" />
      {/* Attachments */}
      <div>
        <h2 className="mb-2 text-lg font-bold">Attachments</h2>
        <Card>
          <CardHeader>
            <CardTitle>Attachments</CardTitle>
          </CardHeader>
          <CardContent>
            {attachments &&
            attachments.attachments &&
            attachments.attachments.length > 0 ? (
              <div className="space-y-4">
                {attachments.attachments.map((a, i) => (
                  <div key={i} className="rounded-md border bg-gray-50 p-3">
                    <div>
                      <span className="font-semibold">Type:</span>{" "}
                      {a.documentType || "-"}
                    </div>
                    <div>
                      <span className="font-semibold">File:</span>{" "}
                      {a.file?.name || "N/A"}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>No attachments uploaded.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
