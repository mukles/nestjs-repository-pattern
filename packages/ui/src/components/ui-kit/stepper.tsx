"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";

import { cn } from "@repo/ui/lib/utils";
import { Button } from "./button";

export interface Step {
  id: number;
  name: string;
  description?: string;
  component?: React.ReactNode;
}

const stepperVariants = cva("flex items-center", {
  variants: {
    orientation: {
      horizontal: "group/stepper-item w-full flex-row justify-center",
      vertical: "flex-col items-start",
    },
    size: {
      sm: "",
      default: "",
      lg: "",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
    size: "default",
  },
});

const stepCircleVariants = cva(
  "flex items-center justify-center rounded-full border-2 font-semibold transition-all duration-300",
  {
    variants: {
      size: {
        sm: "size-7 text-xs",
        default: "size-9 text-sm",
        lg: "size-11 text-base",
      },
      state: {
        completed:
          "border-primary bg-primary text-primary-foreground shadow-sm",
        current: "border-primary bg-primary/10 text-primary",
        upcoming:
          "border-muted-foreground/30 bg-background text-muted-foreground",
      },
    },
    defaultVariants: {
      size: "default",
      state: "upcoming",
    },
  },
);

const stepConnectorVariants = cva("transition-colors duration-300", {
  variants: {
    orientation: {
      horizontal: "h-0.5 w-full flex-1",
      vertical: "my-1 ml-4 h-8 w-0.5",
    },
    state: {
      completed: "bg-primary",
      incomplete: "bg-muted-foreground/20",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
    state: "incomplete",
  },
});

// Internal entry stored per named step
type StepFormEntry = {
  validator: () => Promise<boolean>;
  getValues: () => unknown;
};

// What you pass into registerStepValidator — any RHF form (or compatible shape)
type StepFormInput = {
  trigger: (fields?: any) => Promise<boolean>;
  getValues: () => unknown;
};

type StepValidatorRegistration = (
  stepName: string,
  form: StepFormInput,
  fields?: string[],
) => () => void;

interface StepperContextValue {
  currentStep: number;
  totalSteps: number;
  orientation: "horizontal" | "vertical";
  size: "sm" | "default" | "lg";
  onStepClick?: (step: number) => void;
  clickable: boolean;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  // Register by name — ties a step name to its form
  registerStepValidator: StepValidatorRegistration;
  // Validate by step number — resolves name → entry internally
  validateStep: (stepNumber: number) => Promise<boolean>;
  validateAndGoNext: () => Promise<boolean>;
  // Returns all values keyed by step name
  // e.g. { student: { firstName, email }, address: { street, city } }
  getStepValues: () => Record<string, unknown>;
  isValidating: boolean;
}

const StepperContext = React.createContext<StepperContextValue | null>(null);

function useStepperContext() {
  const context = React.useContext(StepperContext);
  if (!context) {
    throw new Error("Stepper components must be used within a Stepper");
  }
  return context;
}

/**
 * Register an RHF form as the validator + value source for a named step.
 * The step name is used as the key in getStepValues().
 * Automatically unregisters on unmount.
 *
 * @example
 * const form = useForm<StudentFormValues>();
 * useStepFormValidator("student", form);
 *
 * // Validate only specific fields:
 * useStepFormValidator("student", form, ["firstName", "email"]);
 *
 * // In the review step pull all values by name:
 * const { getStepValues } = useStepperContext();
 * const { student, address } = getStepValues() as { student: StudentFormValues; address: AddressFormValues };
 */
function useStepFormValidator(
  stepName: string,
  form: StepFormInput,
  fields?: string[],
) {
  const { registerStepValidator } = useStepperContext();

  React.useEffect(() => {
    return registerStepValidator(stepName, form, fields);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepName, registerStepValidator]);
}

interface StepperProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stepperVariants> {
  currentStep?: number;
  defaultStep?: number;
  onStepClick?: (step: number) => void;
  onStepChange?: (step: number) => void;
  clickable?: boolean;
  onValidationFail?: (stepNumber: number) => void;
  // Map step number → step name so the stepper can resolve which
  // named form to validate when the user clicks Next
  // e.g. { 1: "student", 2: "address" }
  stepNames?: Record<number, string>;
  children: React.ReactNode;
}

function Stepper({
  currentStep: controlledStep,
  defaultStep = 1,
  orientation = "horizontal",
  size = "default",
  onStepClick,
  onStepChange,
  clickable = false,
  onValidationFail,
  stepNames = {},
  className,
  children,
  ...props
}: StepperProps) {
  const [internalStep, setInternalStep] = React.useState(defaultStep);
  const [isValidating, setIsValidating] = React.useState(false);

  // Per-instance registry keyed by step name
  const stepsRef = React.useRef<Map<string, StepFormEntry>>(new Map());

  const isControlled = controlledStep !== undefined;
  const currentStep = isControlled ? controlledStep : internalStep;

  const totalSteps = React.useMemo(() => {
    let count = 0;
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child)) {
        if (child.type === StepperIndicator || child.type === StepperContent) {
          const childProps = child.props as { children?: React.ReactNode };
          count = React.Children.count(childProps.children);
        }
      }
    });
    return count;
  }, [children]);

  const registerStepValidator = React.useCallback<StepValidatorRegistration>(
    (stepName, form, fields) => {
      const entry: StepFormEntry = {
        validator: () => form.trigger(fields),
        getValues: () => form.getValues(),
      };
      stepsRef.current.set(stepName, entry);
      return () => {
        if (stepsRef.current.get(stepName) === entry) {
          stepsRef.current.delete(stepName);
        }
      };
    },
    [],
  );

  // Resolves step number → name → entry, then runs the validator
  const validateStep = React.useCallback(
    async (stepNumber: number) => {
      const stepName = stepNames[stepNumber];
      if (!stepName) return true;
      const entry = stepsRef.current.get(stepName);
      if (!entry) return true;
      try {
        return Boolean(await entry.validator());
      } catch (error) {
        console.error("Step validation failed", error);
        return false;
      }
    },
    [stepNames],
  );

  // Returns all form values keyed by step name
  const getStepValues = React.useCallback(() => {
    const result: Record<string, unknown> = {};
    stepsRef.current.forEach((entry, stepName) => {
      result[stepName] = entry.getValues();
    });
    return result;
  }, []);

  const handleStepClick = React.useCallback(
    (step: number) => {
      if (!isControlled) setInternalStep(step);
      onStepClick?.(step);
      onStepChange?.(step);
    },
    [isControlled, onStepClick, onStepChange],
  );

  const goToNextStep = React.useCallback(() => {
    if (currentStep < totalSteps) {
      const nextStep = currentStep + 1;
      if (!isControlled) setInternalStep(nextStep);
      onStepChange?.(nextStep);
    }
  }, [currentStep, totalSteps, isControlled, onStepChange]);

  const goToPreviousStep = React.useCallback(() => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      if (!isControlled) setInternalStep(prevStep);
      onStepChange?.(prevStep);
    }
  }, [currentStep, isControlled, onStepChange]);

  const validateAndGoNext = React.useCallback(async () => {
    if (currentStep >= totalSteps) return true;
    setIsValidating(true);
    try {
      const isValid = await validateStep(currentStep);
      if (isValid) {
        goToNextStep();
        return true;
      } else {
        onValidationFail?.(currentStep);
        return false;
      }
    } finally {
      setIsValidating(false);
    }
  }, [currentStep, totalSteps, validateStep, goToNextStep, onValidationFail]);

  const contextValue = React.useMemo<StepperContextValue>(
    () => ({
      currentStep,
      totalSteps,
      orientation: orientation ?? "horizontal",
      size: size ?? "default",
      onStepClick: handleStepClick,
      clickable,
      goToNextStep,
      goToPreviousStep,
      isFirstStep: currentStep === 1,
      isLastStep: currentStep === totalSteps,
      registerStepValidator,
      validateStep,
      validateAndGoNext,
      getStepValues,
      isValidating,
    }),
    [
      currentStep,
      totalSteps,
      orientation,
      size,
      handleStepClick,
      clickable,
      goToNextStep,
      goToPreviousStep,
      registerStepValidator,
      validateStep,
      validateAndGoNext,
      getStepValues,
      isValidating,
    ],
  );

  return (
    <StepperContext.Provider value={contextValue}>
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        {children}
      </div>
    </StepperContext.Provider>
  );
}

type StepperIndicatorProps = React.HTMLAttributes<HTMLDivElement>;

function StepperIndicator({
  className,
  children,
  ...props
}: StepperIndicatorProps) {
  const { orientation, size } = useStepperContext();

  const childArray = React.Children.toArray(children);
  const totalSteps = childArray.length;

  return (
    <div
      className={cn(stepperVariants({ orientation, size }), className)}
      data-orientation={orientation}
      {...props}
    >
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(
            child as React.ReactElement<StepItemProps>,
            {
              stepNumber: index + 1,
              isLast: index === totalSteps - 1,
            },
          );
        }
        return child;
      })}
    </div>
  );
}

type StepperContentProps = React.HTMLAttributes<HTMLDivElement>;

function StepperContent({
  className,
  children,
  ...props
}: StepperContentProps) {
  const { currentStep } = useStepperContext();

  const childArray = React.Children.toArray(children);
  const currentChild = childArray[currentStep - 1];

  return (
    <div className={cn("min-h-0 px-2", className)} {...props}>
      {currentChild}
    </div>
  );
}

interface StepperActionsRenderProps {
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  validateAndGoNext: () => Promise<boolean>;
  isFirstStep: boolean;
  isLastStep: boolean;
  currentStep: number;
  totalSteps: number;
  isValidating: boolean;
}

interface StepperActionsProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> {
  previousLabel?: string;
  nextLabel?: string;
  submitLabel?: string;
  onSubmit?: () => void;
  showPrevious?: boolean;
  showNext?: boolean;
  previousDisabled?: boolean;
  nextDisabled?: boolean;
  children?:
    | React.ReactNode
    | ((props: StepperActionsRenderProps) => React.ReactNode);
}

function StepperActions({
  className,
  previousLabel = "Previous",
  nextLabel = "Next",
  submitLabel = "Submit",
  onSubmit,
  showPrevious = true,
  showNext = true,
  previousDisabled,
  nextDisabled,
  children,
  ...props
}: StepperActionsProps) {
  const {
    goToNextStep,
    goToPreviousStep,
    validateAndGoNext,
    isFirstStep,
    isLastStep,
    currentStep,
    totalSteps,
    isValidating,
  } = useStepperContext();

  if (typeof children === "function") {
    return (
      <div className={cn("flex justify-between", className)} {...props}>
        {children({
          goToNextStep,
          goToPreviousStep,
          validateAndGoNext,
          isFirstStep,
          isLastStep,
          currentStep,
          totalSteps,
          isValidating,
        })}
      </div>
    );
  }

  if (children) {
    return (
      <div className={cn("flex justify-between", className)} {...props}>
        {children}
      </div>
    );
  }

  return (
    <div className={cn("flex justify-between", className)} {...props}>
      {showPrevious ? (
        <Button
          type="button"
          variant="outline"
          onClick={goToPreviousStep}
          disabled={isFirstStep || previousDisabled}
        >
          <ChevronLeft className="mr-1 size-4" />
          {previousLabel}
        </Button>
      ) : (
        <div />
      )}
      {showNext && (
        <>
          {isLastStep ? (
            <Button type="submit" onClick={onSubmit} disabled={nextDisabled}>
              {submitLabel}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={validateAndGoNext}
              disabled={nextDisabled || isValidating}
            >
              {isValidating ? "Validating..." : nextLabel}
              <ChevronRight className="ml-1 size-4" />
            </Button>
          )}
        </>
      )}
    </div>
  );
}

interface StepItemProps extends React.HTMLAttributes<HTMLDivElement> {
  stepNumber?: number;
  isLast?: boolean;
  name: string;
  description?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

function StepItem({
  stepNumber = 1,
  isLast = false,
  name,
  description,
  icon,
  className,
  children: _children,
  ...props
}: StepItemProps) {
  void _children;
  const { currentStep, orientation, size, onStepClick, clickable } =
    useStepperContext();

  const isCompleted = currentStep > stepNumber;
  const isCurrent = currentStep === stepNumber;
  const state = isCompleted ? "completed" : isCurrent ? "current" : "upcoming";

  const handleClick = () => {
    if (clickable && onStepClick) {
      onStepClick(stepNumber);
    }
  };

  const iconSize =
    size === "sm" ? "size-3" : size === "lg" ? "size-5" : "size-4";

  return (
    <div
      className={cn(
        "relative flex min-w-0 flex-1 items-center",
        orientation === "horizontal" && "justify-center",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "flex min-w-0 flex-col items-center",
          orientation === "horizontal" && "gap-2",
          clickable && "cursor-pointer",
          "relative w-full",
        )}
        onClick={handleClick}
        role={clickable ? "button" : undefined}
        tabIndex={clickable ? 0 : undefined}
        onKeyDown={
          clickable
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleClick();
                }
              }
            : undefined
        }
        style={{ zIndex: 2 }}
      >
        <div
          className={cn(
            "relative mb-2 flex w-full items-center justify-center",
            orientation === "horizontal" && "w-full",
          )}
        >
          {orientation === "horizontal" && stepNumber !== 1 && (
            <span
              className={cn(
                "absolute top-1/2 left-0 h-0.5 -translate-y-1/2",
                isCompleted || isCurrent ? "bg-primary" : "bg-[#e0e0e0]",
              )}
              style={{ width: "calc(50% - 1.25rem)", zIndex: 1 }}
            />
          )}
          {isCurrent && (
            <span
              className="pointer-events-none absolute inset-0 rounded-full"
              style={{ boxSizing: "border-box", zIndex: 2 }}
            />
          )}
          <div
            className={cn(
              stepCircleVariants({ size, state }),
              "z-10 border-2 bg-[#f5f5f5] text-black",
              isCurrent && "border-black",
            )}
            style={{ position: "relative" }}
          >
            {isCompleted ? (
              <Check className={iconSize + " text-black"} />
            ) : icon ? (
              icon
            ) : (
              stepNumber
            )}
          </div>
          {orientation === "horizontal" && !isLast && (
            <span
              className={cn(
                "absolute top-1/2 right-0 h-0.5 -translate-y-1/2",
                currentStep > stepNumber ? "bg-primary" : "bg-[#e0e0e0]",
              )}
              style={{ width: "calc(50% - 1.25rem)", zIndex: 1 }}
            />
          )}
        </div>
        <span
          className={cn(
            "text-center font-medium whitespace-nowrap transition-colors duration-300",
            size === "sm" && "text-xs",
            size === "default" && "text-xs",
            size === "lg" && "text-sm",
            state === "upcoming" ? "text-muted-foreground" : "text-black",
            "mt-0.5",
          )}
        >
          {name}
        </span>
        {description && (
          <span
            className={cn(
              "text-center whitespace-nowrap text-muted-foreground",
              size === "sm" && "text-[10px]",
              size === "default" && "text-[11px]",
              size === "lg" && "text-xs",
              "mt-0.5",
            )}
          >
            {description}
          </span>
        )}
      </div>
    </div>
  );
}

interface StepContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

function StepContent({ className, children, ...props }: StepContentProps) {
  return (
    <div className={cn("w-full", className)} {...props}>
      {children}
    </div>
  );
}

export {
  stepCircleVariants,
  stepConnectorVariants,
  StepContent,
  StepItem,
  Stepper,
  StepperActions,
  StepperContent,
  StepperIndicator,
  stepperVariants,
  useStepFormValidator,
  useStepperContext,
  type StepContentProps,
  type StepFormInput,
  type StepItemProps,
  type StepperActionsProps,
  type StepperActionsRenderProps,
  type StepperContentProps,
  type StepperIndicatorProps,
  type StepperProps,
  type StepValidatorRegistration,
};
