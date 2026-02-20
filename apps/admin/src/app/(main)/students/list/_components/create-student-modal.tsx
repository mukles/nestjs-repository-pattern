"use client";

import { Button } from "@repo/ui/components/ui-kit/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/ui-kit/dialog";
import {
  StepContent,
  StepItem,
  Stepper,
  StepperActions,
  StepperContent,
  StepperIndicator,
} from "@repo/ui/components/ui-kit/stepper";
import { useDialog } from "@repo/ui/hooks/use-dialog";
import { Plus } from "lucide-react";
import { AttachmentsForm } from "./attachments-form";
import { ParentForm } from "./parent-form";
import { ReviewStep } from "./review-step";
import { StudentForm } from "./student-form";

export function CreateStudentModal() {
  const { isOpen, openChange } = useDialog();

  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
      <DialogTrigger asChild>
        <Button
          size={"lg"}
          className="px-4 py-2 font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="mr-2 size-4" />
          Add Student
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-hidden sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Add New Student
          </DialogTitle>
          <DialogDescription>
            Fill in the details below to register a new student to the system.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[calc(90vh-120px)] overflow-y-auto pt-4">
          <Stepper clickable={false}>
            <StepperIndicator>
              <StepItem name="Student Info" />
              <StepItem name="Parents Info" />
              <StepItem name="Attachments" />
              <StepItem name="Review & Submit" />
            </StepperIndicator>

            <StepperContent>
              <StepContent>
                <StudentForm stepNumber={1} />
              </StepContent>
              <StepContent>
                <ParentForm stepNumber={2} />
              </StepContent>
              <StepContent>
                <AttachmentsForm stepNumber={3} />
              </StepContent>
              <StepContent>
                <ReviewStep />
              </StepContent>
            </StepperContent>

            <StepperActions className="bg-background sticky bottom-0 mt-4 border-t pt-4 pb-2">
              {({
                validateAndGoNext,
                goToPreviousStep,
                isFirstStep,
                isLastStep,
                isValidating,
              }) => (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isFirstStep}
                    onClick={goToPreviousStep}
                  >
                    Previous
                  </Button>
                  {isLastStep ? (
                    <Button
                      type="button"
                      onClick={() => validateAndGoNext()}
                      disabled={isValidating}
                    >
                      {isValidating ? "Validating..." : "Submit"}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => validateAndGoNext()}
                      disabled={isValidating}
                    >
                      {isValidating ? "Validating..." : "Next"}
                    </Button>
                  )}
                </>
              )}
            </StepperActions>
          </Stepper>
        </div>
      </DialogContent>
    </Dialog>
  );
}
