import { AttachmentsFormValues } from "@/lib/validation/attachments.schema";
import { ParentFormValues } from "@/lib/validation/parent.schema";
import { StudentFormValues } from "@/lib/validation/student.schema";

export type StepperValues = {
  1: StudentFormValues;
  2: ParentFormValues;
  3: AttachmentsFormValues;
};
