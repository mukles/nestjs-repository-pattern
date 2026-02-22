import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui-kit/card";

export function ReviewStep() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Student Info</CardTitle>
        </CardHeader>
        <CardContent>
          {/* <div>
            Name: {student.firstName} {student.lastName}
          </div>
          <div>Email: {student.email}</div>
          <div>Date of Birth: {student.dateOfBirth}</div>
          <div>Gender: {student.gender}</div>
          <div>Status: {student.status}</div> */}
        </CardContent>
      </Card>
      {/* <Card>
        <CardHeader>
          <CardTitle>Parents Info</CardTitle>
        </CardHeader>
        <CardContent>
          {parent.parents.map((p, i) => (
            <div key={i} className="mb-2">
              <div>Type: {p.type}</div>
              <div>Name: {p.name}</div>
              <div>Email: {p.email}</div>
              <div>Phone: {p.phone}</div>
              <div>Occupation: {p.occupation}</div>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Attachments</CardTitle>
        </CardHeader>
        <CardContent>
          {attachments.attachments.length === 0 ? (
            <div>No attachments uploaded.</div>
          ) : (
            attachments.attachments.map((a, i) => (
              <div key={i} className="mb-2">
                <div>
                  Type: {DOCUMENT_TYPE_LABELS[a.documentType] || a.documentType}
                </div>
                <div>File: {a.file?.name}</div>
              </div>
            ))
          )}
        </CardContent>
      </Card> */}
    </div>
  );
}
