import { z } from "zod";

// Document Categories
export enum DocumentCategory {
  STUDENT = "STUDENT",
  FATHER = "FATHER",
  MOTHER = "MOTHER",
}

// Student Document Types
export enum StudentDocumentType {
  // Student documents
  STUDENT_PHOTO = "STUDENT_PHOTO",
  BIRTH_CERTIFICATE = "BIRTH_CERTIFICATE",
  PREVIOUS_SCHOOL_CERTIFICATE = "PREVIOUS_SCHOOL_CERTIFICATE",
  MEDICAL_CERTIFICATE = "MEDICAL_CERTIFICATE",
  // Father documents
  FATHER_PHOTO = "FATHER_PHOTO",
  FATHER_NID = "FATHER_NID",
  // Mother documents
  MOTHER_PHOTO = "MOTHER_PHOTO",
  MOTHER_NID = "MOTHER_NID",
}

// Labels for document categories
export const DOCUMENT_CATEGORY_LABELS: Record<DocumentCategory, string> = {
  [DocumentCategory.STUDENT]: "Student Documents",
  [DocumentCategory.FATHER]: "Father's Documents",
  [DocumentCategory.MOTHER]: "Mother's Documents",
};

// Labels for document types
export const DOCUMENT_TYPE_LABELS: Record<StudentDocumentType, string> = {
  [StudentDocumentType.STUDENT_PHOTO]: "Student Photo",
  [StudentDocumentType.BIRTH_CERTIFICATE]: "Birth Certificate",
  [StudentDocumentType.PREVIOUS_SCHOOL_CERTIFICATE]:
    "Previous School Certificate",
  [StudentDocumentType.MEDICAL_CERTIFICATE]: "Medical Certificate",
  [StudentDocumentType.FATHER_PHOTO]: "Father's Photo",
  [StudentDocumentType.FATHER_NID]: "Father's NID",
  [StudentDocumentType.MOTHER_PHOTO]: "Mother's Photo",
  [StudentDocumentType.MOTHER_NID]: "Mother's NID",
};

// Document types grouped by category
export const DOCUMENT_TYPES_BY_CATEGORY: Record<
  DocumentCategory,
  StudentDocumentType[]
> = {
  [DocumentCategory.STUDENT]: [
    StudentDocumentType.STUDENT_PHOTO,
    StudentDocumentType.BIRTH_CERTIFICATE,
    StudentDocumentType.PREVIOUS_SCHOOL_CERTIFICATE,
    StudentDocumentType.MEDICAL_CERTIFICATE,
  ],
  [DocumentCategory.FATHER]: [
    StudentDocumentType.FATHER_PHOTO,
    StudentDocumentType.FATHER_NID,
  ],
  [DocumentCategory.MOTHER]: [
    StudentDocumentType.MOTHER_PHOTO,
    StudentDocumentType.MOTHER_NID,
  ],
};

// Schema for a single attachment
export const singleAttachmentSchema = z.object({
  file: z.instanceof(File, { message: "File is required" }),
  documentType: z.nativeEnum(StudentDocumentType, {
    message: "Document type is required",
  }),
});

// Schema for attachments form
export const attachmentsSchema = z.object({
  attachments: z.array(singleAttachmentSchema),
});

export type StudentAttachment = z.infer<typeof singleAttachmentSchema>;
export type AttachmentsFormValues = z.infer<typeof attachmentsSchema>;
