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
      horizontal: "flex-row justify-center",
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
      horizontal: "mx-3 h-0.5 w-12",
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

/** Validator function that returns true if step is valid, false otherwise */
type StepValidator = () => boolean | Promise<boolean>;

/** Function to register a validator for a step, returns cleanup function */
type StepValidatorRegistration = (
  stepNumber: number,
  validator: StepValidator,
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
  /** Register a validator for a specific step (1-indexed) */
  registerStepValidator: StepValidatorRegistration;
  /** Validate a specific step (1-indexed), returns true if valid */
  validateStep: (stepNumber: number) => Promise<boolean>;
  /** Validate current step and go to next if valid */
  validateAndGoNext: () => Promise<boolean>;
  /** Whether validation is currently in progress */
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

interface StepperProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stepperVariants> {
  /** Controlled current step (1-indexed) */
  currentStep?: number;
  /** Default step for uncontrolled mode (1-indexed) */
  defaultStep?: number;
  onStepClick?: (step: number) => void;
  onStepChange?: (step: number) => void;
  clickable?: boolean;
  /** If true, validates current step before allowing navigation to next */
  validateOnNext?: boolean;
  /** Called when validation fails */
  onValidationFail?: (stepNumber: number) => void;
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
  validateOnNext: _validateOnNext,
  onValidationFail,
  className,
  children,
  ...props
}: StepperProps) {
  void _validateOnNext; // Reserved for future use
  const [internalStep, setInternalStep] = React.useState(defaultStep);
  const [isValidating, setIsValidating] = React.useState(false);
  const validatorsRef = React.useRef<Map<number, StepValidator>>(new Map());

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

  React.useEffect(() => {
    validatorsRef.current.forEach((_, key) => {
      if (key > totalSteps) {
        validatorsRef.current.delete(key);
      }
    });
  }, [totalSteps]);

  const registerStepValidator = React.useCallback<StepValidatorRegistration>(
    (stepNumber, validator) => {
      validatorsRef.current.set(stepNumber, validator);
      return () => {
        const stored = validatorsRef.current.get(stepNumber);
        if (stored === validator) {
          validatorsRef.current.delete(stepNumber);
        }
      };
    },
    [],
  );

  const validateStep = React.useCallback(async (stepNumber: number) => {
    const validator = validatorsRef.current.get(stepNumber);
    console.log({
      validator,
    });
    if (!validator) {
      return true;
    }
    try {
      const result = await validator();
      return Boolean(result);
    } catch (error) {
      console.error("Step validation failed", error);
      return false;
    }
  }, []);

  const handleStepClick = React.useCallback(
    (step: number) => {
      if (!isControlled) {
        setInternalStep(step);
      }
      onStepClick?.(step);
      onStepChange?.(step);
    },
    [isControlled, onStepClick, onStepChange],
  );

  const goToNextStep = React.useCallback(() => {
    console.log({ currentStep, totalSteps });
    if (currentStep < totalSteps) {
      const nextStep = currentStep + 1;
      if (!isControlled) {
        setInternalStep(nextStep);
      }
      onStepChange?.(nextStep);
    }
  }, [currentStep, totalSteps, isControlled, onStepChange]);

  const goToPreviousStep = React.useCallback(() => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      if (!isControlled) {
        setInternalStep(prevStep);
      }
      onStepChange?.(prevStep);
    }
  }, [currentStep, isControlled, onStepChange]);

  const validateAndGoNext = React.useCallback(async () => {
    if (currentStep >= totalSteps) {
      return true;
    }
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
              onClick={goToNextStep}
              disabled={nextDisabled}
            >
              {nextLabel}
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
    <div className={cn("flex items-center", className)} {...props}>
      <div
        className={cn(
          "flex items-center gap-2",
          orientation === "vertical" && "flex-row",
          clickable && "cursor-pointer",
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
      >
        <div className="flex flex-col items-center gap-1.5">
          <div className={cn(stepCircleVariants({ size, state }))}>
            {isCompleted ? (
              <Check className={iconSize} />
            ) : icon ? (
              icon
            ) : (
              stepNumber
            )}
          </div>
          <div className="flex flex-col items-center">
            <span
              className={cn(
                "font-medium whitespace-nowrap transition-colors duration-300",
                size === "sm" && "text-xs",
                size === "default" && "text-xs",
                size === "lg" && "text-sm",
                state === "upcoming" ? "text-muted-foreground" : "text-primary",
              )}
            >
              {name}
            </span>
            {description && (
              <span
                className={cn(
                  "whitespace-nowrap text-muted-foreground",
                  size === "sm" && "text-[10px]",
                  size === "default" && "text-[11px]",
                  size === "lg" && "text-xs",
                )}
              >
                {description}
              </span>
            )}
          </div>
        </div>
      </div>

      {!isLast && (
        <div
          className={cn(
            stepConnectorVariants({
              orientation,
              state: isCompleted ? "completed" : "incomplete",
            }),
          )}
        />
      )}
    </div>
  );
}

/* StepContent - Wrapper for individual step content */
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
  useStepperContext,
  type StepContentProps,
  type StepItemProps,
  type StepperActionsProps,
  type StepperActionsRenderProps,
  type StepperContentProps,
  type StepperIndicatorProps,
  type StepperProps,
  type StepValidator,
  type StepValidatorRegistration,
};
