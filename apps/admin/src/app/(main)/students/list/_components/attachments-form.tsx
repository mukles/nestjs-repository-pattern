"use client";

import { Button } from "@repo/ui/components/ui-kit/button";
import { Input } from "@repo/ui/components/ui-kit/input";
import { FileText, Trash2, Upload, User, Users } from "lucide-react";
import { useState } from "react";
import {
  DOCUMENT_CATEGORY_LABELS,
  DOCUMENT_TYPE_LABELS,
  DOCUMENT_TYPES_BY_CATEGORY,
  DocumentCategory,
  StudentDocumentType,
  type StudentAttachment,
} from "./student-form-schema";

export function AttachmentsForm() {
  const [attachments, setAttachments] = useState<StudentAttachment[]>([]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    documentType: StudentDocumentType,
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file) {
        // Remove existing attachment of same type if exists
        const filtered = attachments.filter(
          (a) => a.documentType !== documentType,
        );
        const newAttachment: StudentAttachment = {
          file,
          documentType,
        };
        setAttachments([...filtered, newAttachment]);
      }
      e.target.value = "";
    }
  };

  const handleRemove = (documentType: StudentDocumentType) => {
    setAttachments(attachments.filter((a) => a.documentType !== documentType));
  };

  const getAttachment = (documentType: StudentDocumentType) => {
    return attachments.find((a) => a.documentType === documentType);
  };

  const getCategoryIcon = (category: DocumentCategory) => {
    switch (category) {
      case DocumentCategory.STUDENT:
        return <User className="size-5" />;
      case DocumentCategory.FATHER:
      case DocumentCategory.MOTHER:
        return <Users className="size-5" />;
      default:
        return <FileText className="size-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Student Documents */}
      <DocumentSection
        category={DocumentCategory.STUDENT}
        icon={getCategoryIcon(DocumentCategory.STUDENT)}
        attachments={attachments}
        onFileChange={handleFileChange}
        onRemove={handleRemove}
        getAttachment={getAttachment}
      />

      {/* Father's Documents */}
      <DocumentSection
        category={DocumentCategory.FATHER}
        icon={getCategoryIcon(DocumentCategory.FATHER)}
        attachments={attachments}
        onFileChange={handleFileChange}
        onRemove={handleRemove}
        getAttachment={getAttachment}
      />

      {/* Mother's Documents */}
      <DocumentSection
        category={DocumentCategory.MOTHER}
        icon={getCategoryIcon(DocumentCategory.MOTHER)}
        attachments={attachments}
        onFileChange={handleFileChange}
        onRemove={handleRemove}
        getAttachment={getAttachment}
      />

      {/* Summary */}
      <div className="bg-muted/30 rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            Total Documents Uploaded: {attachments.length}
          </span>
          {attachments.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setAttachments([])}
              className="text-destructive hover:text-destructive"
            >
              Clear All
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

interface DocumentSectionProps {
  category: DocumentCategory;
  icon: React.ReactNode;
  attachments: StudentAttachment[];
  onFileChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    documentType: StudentDocumentType,
  ) => void;
  onRemove: (documentType: StudentDocumentType) => void;
  getAttachment: (
    documentType: StudentDocumentType,
  ) => StudentAttachment | undefined;
}

function DocumentSection({
  category,
  icon,
  onFileChange,
  onRemove,
  getAttachment,
}: DocumentSectionProps) {
  const documentTypes = DOCUMENT_TYPES_BY_CATEGORY[category];
  const categoryLabel = DOCUMENT_CATEGORY_LABELS[category];

  return (
    <div className="rounded-lg border p-4">
      <div className="mb-4 flex items-center gap-2">
        <div className="bg-primary/10 text-primary rounded-full p-2">
          {icon}
        </div>
        <h3 className="font-semibold">{categoryLabel}</h3>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {documentTypes.map((docType) => {
          const attachment = getAttachment(docType);
          const label = DOCUMENT_TYPE_LABELS[docType];
          const inputId = `file-${docType}`;

          return (
            <div
              key={docType}
              className={`rounded-lg border p-3 transition-colors ${
                attachment
                  ? "border-primary/50 bg-primary/5"
                  : "border-muted-foreground/25 hover:border-muted-foreground/50 border-dashed"
              }`}
            >
              <div className="mb-2 text-sm font-medium">{label}</div>

              {attachment ? (
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-muted-foreground truncate text-xs">
                      {attachment.file.name}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {(attachment.file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove(docType)}
                    className="shrink-0"
                  >
                    <Trash2 className="text-destructive size-4" />
                  </Button>
                </div>
              ) : (
                <label htmlFor={inputId} className="cursor-pointer">
                  <Input
                    id={inputId}
                    type="file"
                    className="hidden"
                    onChange={(e) => onFileChange(e, docType)}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  />
                  <div className="border-muted-foreground/25 bg-muted/30 text-muted-foreground hover:bg-muted/50 flex items-center justify-center gap-2 rounded-md border border-dashed py-2 text-xs transition-colors">
                    <Upload className="size-3" />
                    <span>Upload</span>
                  </div>
                </label>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
