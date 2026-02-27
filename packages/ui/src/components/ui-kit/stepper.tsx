"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";

import { cn } from "@repo/ui/lib/utils";
import { Button } from "./button";

// =============================================================================
// TYPES
// =============================================================================

/**
 * Define a map of step number → form values for full TypeScript inference.
 *
 * @example
 * type MyStepsMap = {
 *   1: { firstName: string; lastName: string };
 *   2: { email: string; phone: string };
 *   3: { plan: "free" | "pro" };
 * };
 *
 * // Then in your parent component:
 * const { getStepValues } = useStepperContext<MyStepsMap>();
 * const step1 = getStepValues(1); // → { firstName: string; lastName: string } | undefined
 * const step2 = getStepValues(2); // → { email: string; phone: string } | undefined
 */
export type StepValuesMap = Record<number, unknown>;

/**
 * A typed form adapter — compatible with react-hook-form's `useForm()` return value.
 * T = the shape of values for this particular step's form.
 */
export type StepFormInput<T = unknown> = {
  trigger: (fields?: (keyof T & string)[]) => Promise<boolean>;
  getValues: () => T;
};

/** @internal */
type StepFormEntry<T = unknown> = {
  validator: () => Promise<boolean>;
  getValues: () => T;
};

// =============================================================================
// VARIANTS
// =============================================================================

export const stepperVariants = cva("flex items-center", {
  variants: {
    orientation: {
      horizontal: "w-full flex-row justify-center",
      vertical: "flex-col items-start",
    },
    size: { sm: "", default: "", lg: "" },
  },
  defaultVariants: { orientation: "horizontal", size: "default" },
});

export const stepCircleVariants = cva(
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
    defaultVariants: { size: "default", state: "upcoming" },
  },
);

export const stepConnectorVariants = cva("transition-colors duration-300", {
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
  defaultVariants: { orientation: "horizontal", state: "incomplete" },
});

// =============================================================================
// CONTEXT
// =============================================================================

interface StepperContextValue<TMap extends StepValuesMap = StepValuesMap> {
  currentStep: number;
  totalSteps: number;
  orientation: "horizontal" | "vertical";
  size: "sm" | "default" | "lg";
  onStepClick?: (step: number) => void;
  clickable: boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
  isValidating: boolean;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  validateStep: (stepNumber: number) => Promise<boolean>;
  validateAndGoNext: () => Promise<boolean>;
  /**
   * Get typed values for a specific step by its number.
   * Return type flows from TMap — no casting needed at the call site.
   *
   * @example
   * getStepValues(1)  // → { firstName: string; lastName: string } | undefined
   * getStepValues(2)  // → { email: string } | undefined
   */
  getStepValues: <N extends keyof TMap & number>(
    stepNumber: N,
  ) => TMap[N] | undefined;
  /**
   * Get all collected step values, typed as a partial of TMap.
   */
  getAllStepValues: () => Partial<{ [N in keyof TMap & number]: TMap[N] }>;
  /** @internal — called by useStepFormValidator */
  _registerValidator: (stepNumber: number, entry: StepFormEntry) => () => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const StepperContext = React.createContext<StepperContextValue<any> | null>(
  null,
);

/**
 * Access the stepper context with full type inference for `getStepValues`.
 *
 * @example
 * // Without generic (values typed as `unknown`):
 * const ctx = useStepperContext();
 *
 * // With generic (values are fully typed):
 * type MyStepsMap = { 1: Step1Values; 2: Step2Values };
 * const { getStepValues } = useStepperContext<MyStepsMap>();
 * const v = getStepValues(1); // → Step1Values | undefined
 */
export function useStepperContext<
  TMap extends StepValuesMap = StepValuesMap,
>() {
  const context = React.useContext(
    StepperContext,
  ) as StepperContextValue<TMap> | null;
  if (!context) {
    throw new Error("Stepper components must be used within a <Stepper />");
  }
  return context;
}

// =============================================================================
// useStepFormValidator
// =============================================================================

/**
 * Register a react-hook-form (or any compatible form) for a specific step number.
 *
 * - Clicking "Next" on this step will call `form.trigger(fields)` before advancing.
 * - `getStepValues(stepNumber)` will return `form.getValues()` typed as `T`.
 *
 * @param stepNumber  The 1-based step number this form belongs to.
 * @param form        RHF-compatible form — `trigger` + `getValues`.
 * @param fields      Optional subset of fields to validate (validates all if omitted).
 *
 * @example
 * // Step 1 component:
 * const form = useForm<Step1Values>();
 * useStepFormValidator(1, form);
 *
 * // Parent — collect all data on submit:
 * type MyMap = { 1: Step1Values; 2: Step2Values };
 * const { getAllStepValues } = useStepperContext<MyMap>();
 * const all = getAllStepValues(); // → { 1?: Step1Values; 2?: Step2Values }
 */
export function useStepFormValidator<T>(
  stepNumber: number,
  form: StepFormInput<T>,
  fields?: (keyof T & string)[],
) {
  const { _registerValidator } = useStepperContext();

  // Keep stable refs so the registered entry never holds a stale closure.
  // This matters when `form` or `fields` change identity between renders.
  const formRef = React.useRef(form);
  formRef.current = form;

  const fieldsRef = React.useRef(fields);
  fieldsRef.current = fields;

  // useLayoutEffect instead of useEffect so the form is registered
  // SYNCHRONOUSLY before the browser paints — and crucially before any
  // sibling useEffect (e.g. in StudentForm) that calls getStepValues(n).
  //
  // Execution order on mount:
  //   render → useLayoutEffect (register) → useEffect (read values) ✅
  //
  // With useEffect it would be:
  //   render → useEffect (read values — not registered yet!) → useEffect (register) ❌
  React.useLayoutEffect(() => {
    const entry: StepFormEntry<T> = {
      validator: () => formRef.current.trigger(fieldsRef.current),
      getValues: () => formRef.current.getValues(),
    };
    return _registerValidator(stepNumber, entry as StepFormEntry);
    // _registerValidator is stable (useCallback with no deps).
    // stepNumber is expected to be a stable literal — warn if it changes.
  }, [stepNumber, _registerValidator]);
}

// =============================================================================
// Stepper (root)
// =============================================================================

export interface StepperProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stepperVariants> {
  /** Controlled current step (1-based). Pair with `onStepChange`. */
  currentStep?: number;
  /** Starting step for uncontrolled usage (default: 1). */
  defaultStep?: number;
  onStepClick?: (step: number) => void;
  onStepChange?: (step: number) => void;
  clickable?: boolean;
  onValidationFail?: (stepNumber: number) => void;
  children: React.ReactNode;
}

export function Stepper({
  currentStep: controlledStep,
  defaultStep = 1,
  orientation = "horizontal",
  size = "default",
  onStepClick,
  onStepChange,
  clickable = false,
  onValidationFail,
  className,
  children,
  ...props
}: StepperProps) {
  const [internalStep, setInternalStep] = React.useState(defaultStep);
  const [isValidating, setIsValidating] = React.useState(false);

  // Registry: stepNumber → StepFormEntry (validator + getValues)
  const stepsRef = React.useRef<Map<number, StepFormEntry>>(new Map());

  const isControlled = controlledStep !== undefined;
  const currentStep = isControlled ? controlledStep : internalStep;

  // Count total steps from StepperIndicator or StepperContent children
  const totalSteps = React.useMemo(() => {
    let count = 0;
    React.Children.forEach(children, (child) => {
      if (!React.isValidElement(child)) return;
      const type = child.type as React.ComponentType;
      if (type === StepperIndicator || type === StepperContent) {
        const { children: inner } = child.props as {
          children?: React.ReactNode;
        };
        const n = React.Children.count(inner);
        if (n > count) count = n;
      }
    });
    return count;
  }, [children]);

  // ── _registerValidator ────────────────────────────────────────────────────
  const _registerValidator = React.useCallback(
    (stepNumber: number, entry: StepFormEntry): (() => void) => {
      stepsRef.current.set(stepNumber, entry);
      return () => {
        if (stepsRef.current.get(stepNumber) === entry) {
          stepsRef.current.delete(stepNumber);
        }
      };
    },
    [],
  );

  // ── validateStep ──────────────────────────────────────────────────────────
  const validateStep = React.useCallback(
    async (stepNumber: number): Promise<boolean> => {
      const entry = stepsRef.current.get(stepNumber);
      if (!entry) return true; // no form registered → implicitly valid
      try {
        return Boolean(await entry.validator());
      } catch (err) {
        console.error(`[Stepper] Step ${stepNumber} validation threw:`, err);
        return false;
      }
    },
    [],
  );

  // ── getStepValues / getAllStepValues ───────────────────────────────────────
  //
  // The implementation is untyped internally (Map<number, unknown>),
  // but the public API surface is fully generic via the context type.
  //
  const getStepValues = React.useCallback(
    (stepNumber: number) => stepsRef.current.get(stepNumber)?.getValues(),
    [],
  ) as StepperContextValue["getStepValues"];

  const getAllStepValues = React.useCallback((): Record<number, unknown> => {
    const result: Record<number, unknown> = {};
    stepsRef.current.forEach((entry, num) => {
      result[num] = entry.getValues();
    });
    return result;
  }, []) as StepperContextValue["getAllStepValues"];

  // ── Navigation ────────────────────────────────────────────────────────────
  const handleStepChange = React.useCallback(
    (step: number) => {
      if (!isControlled) setInternalStep(step);
      onStepChange?.(step);
    },
    [isControlled, onStepChange],
  );

  const handleStepClick = React.useCallback(
    (step: number) => {
      handleStepChange(step);
      onStepClick?.(step);
    },
    [handleStepChange, onStepClick],
  );

  const goToNextStep = React.useCallback(() => {
    if (currentStep < totalSteps) handleStepChange(currentStep + 1);
  }, [currentStep, totalSteps, handleStepChange]);

  const goToPreviousStep = React.useCallback(() => {
    if (currentStep > 1) handleStepChange(currentStep - 1);
  }, [currentStep, handleStepChange]);

  const validateAndGoNext = React.useCallback(async (): Promise<boolean> => {
    if (currentStep >= totalSteps) return true;
    setIsValidating(true);
    try {
      const valid = await validateStep(currentStep);
      if (valid) {
        goToNextStep();
        return true;
      }
      onValidationFail?.(currentStep);
      return false;
    } finally {
      setIsValidating(false);
    }
  }, [currentStep, totalSteps, validateStep, goToNextStep, onValidationFail]);

  // ── Context ───────────────────────────────────────────────────────────────
  const contextValue = React.useMemo<StepperContextValue>(
    () => ({
      currentStep,
      totalSteps,
      orientation: orientation ?? "horizontal",
      size: size ?? "default",
      onStepClick: handleStepClick,
      clickable,
      isFirstStep: currentStep === 1,
      isLastStep: currentStep === totalSteps,
      isValidating,
      goToNextStep,
      goToPreviousStep,
      validateStep,
      validateAndGoNext,
      getStepValues,
      getAllStepValues,
      _registerValidator,
    }),
    [
      currentStep,
      totalSteps,
      orientation,
      size,
      handleStepClick,
      clickable,
      isValidating,
      goToNextStep,
      goToPreviousStep,
      validateStep,
      validateAndGoNext,
      getStepValues,
      getAllStepValues,
      _registerValidator,
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

// =============================================================================
// StepperIndicator
// =============================================================================

export type StepperIndicatorProps = React.HTMLAttributes<HTMLDivElement>;

export function StepperIndicator({
  className,
  children,
  ...props
}: StepperIndicatorProps) {
  const { orientation, size } = useStepperContext();
  const childArray = React.Children.toArray(children);

  return (
    <div
      className={cn(stepperVariants({ orientation, size }), className)}
      data-orientation={orientation}
      {...props}
    >
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;
        return React.cloneElement(child as React.ReactElement<StepItemProps>, {
          stepNumber: index + 1,
          isLast: index === childArray.length - 1,
        });
      })}
    </div>
  );
}

// =============================================================================
// StepperContent
// =============================================================================

export type StepperContentProps = React.HTMLAttributes<HTMLDivElement>;

export function StepperContent({
  className,
  children,
  ...props
}: StepperContentProps) {
  const { currentStep } = useStepperContext();

  return (
    <div className={cn("min-h-0 px-2", className)} {...props}>
      {React.Children.map(children, (child, index) => (
        // Keep every step mounted so form state (useForm, useStepFormValidator)
        // is never destroyed. Only the active step is visible.
        <div
          key={index}
          hidden={index + 1 !== currentStep}
          aria-hidden={index + 1 !== currentStep}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

// =============================================================================
// StepperActions
// =============================================================================

export interface StepperActionsRenderProps {
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  validateAndGoNext: () => Promise<boolean>;
  isFirstStep: boolean;
  isLastStep: boolean;
  currentStep: number;
  totalSteps: number;
  isValidating: boolean;
}

export interface StepperActionsProps extends Omit<
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

export function StepperActions({
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
  const ctx = useStepperContext();

  const renderProps: StepperActionsRenderProps = {
    goToNextStep: ctx.goToNextStep,
    goToPreviousStep: ctx.goToPreviousStep,
    validateAndGoNext: ctx.validateAndGoNext,
    isFirstStep: ctx.isFirstStep,
    isLastStep: ctx.isLastStep,
    currentStep: ctx.currentStep,
    totalSteps: ctx.totalSteps,
    isValidating: ctx.isValidating,
  };

  const content =
    typeof children === "function" ? children(renderProps) : children;

  if (content) {
    return (
      <div className={cn("flex justify-between", className)} {...props}>
        {content}
      </div>
    );
  }

  return (
    <div className={cn("flex justify-between", className)} {...props}>
      {showPrevious ? (
        <Button
          type="button"
          variant="outline"
          onClick={ctx.goToPreviousStep}
          disabled={ctx.isFirstStep || previousDisabled}
        >
          <ChevronLeft className="mr-1 size-4" />
          {previousLabel}
        </Button>
      ) : (
        <div />
      )}

      {showNext &&
        (ctx.isLastStep ? (
          <Button type="submit" onClick={onSubmit} disabled={nextDisabled}>
            {submitLabel}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={ctx.validateAndGoNext}
            disabled={nextDisabled || ctx.isValidating}
          >
            {ctx.isValidating ? "Validating…" : nextLabel}
            <ChevronRight className="ml-1 size-4" />
          </Button>
        ))}
    </div>
  );
}

// =============================================================================
// StepItem
// =============================================================================

export interface StepItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Auto-injected by StepperIndicator — do not pass manually. */
  stepNumber?: number;
  /** Auto-injected by StepperIndicator — do not pass manually. */
  isLast?: boolean;
  name: string;
  description?: string;
  icon?: React.ReactNode;
}

export function StepItem({
  stepNumber = 1,
  isLast = false,
  name,
  description,
  icon,
  className,
  children: _children, // discarded — content lives in StepperContent
  ...props
}: StepItemProps) {
  const { currentStep, orientation, size, onStepClick, clickable } =
    useStepperContext();

  const isCompleted = currentStep > stepNumber;
  const isCurrent = currentStep === stepNumber;
  const state = isCompleted ? "completed" : isCurrent ? "current" : "upcoming";
  const iconSize =
    size === "sm" ? "size-3" : size === "lg" ? "size-5" : "size-4";

  const handleClick = () => {
    if (clickable && onStepClick) onStepClick(stepNumber);
  };

  return (
    <div
      className={cn(
        "relative flex min-w-0 flex-1 items-center",
        orientation === "horizontal" && "justify-center",
        className,
      )}
      {...props}
    >
      {/* Vertical connector above (except first step) */}
      {orientation === "vertical" && stepNumber !== 1 && (
        <span
          className={cn(
            stepConnectorVariants({
              orientation: "vertical",
              state: isCompleted || isCurrent ? "completed" : "incomplete",
            }),
            "absolute -top-8 left-4",
          )}
        />
      )}

      <div
        className={cn(
          "relative flex w-full min-w-0 flex-col items-center",
          orientation === "horizontal" && "gap-2",
          clickable && "cursor-pointer",
        )}
        onClick={handleClick}
        role={clickable ? "button" : undefined}
        tabIndex={clickable ? 0 : undefined}
        onKeyDown={
          clickable
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") handleClick();
              }
            : undefined
        }
        aria-current={isCurrent ? "step" : undefined}
      >
        {/* Circle row with connectors */}
        <div className="relative flex w-full items-center justify-center">
          {orientation === "horizontal" && stepNumber !== 1 && (
            <span
              className={cn(
                "absolute top-1/2 left-0 z-[1] h-0.5 -translate-y-1/2",
                isCompleted || isCurrent ? "bg-primary" : "bg-[#e0e0e0]",
              )}
              style={{ width: "calc(50% - 1.25rem)" }}
            />
          )}

          <div
            className={cn(
              stepCircleVariants({ size, state }),
              "z-10 border-2 bg-[#f5f5f5] text-black",
              isCurrent && "border-black",
            )}
          >
            {isCompleted ? (
              <Check className={cn(iconSize, "text-black")} />
            ) : icon ? (
              icon
            ) : (
              stepNumber
            )}
          </div>

          {orientation === "horizontal" && !isLast && (
            <span
              className={cn(
                "absolute top-1/2 right-0 z-[1] h-0.5 -translate-y-1/2",
                currentStep > stepNumber ? "bg-primary" : "bg-[#e0e0e0]",
              )}
              style={{ width: "calc(50% - 1.25rem)" }}
            />
          )}
        </div>

        <span
          className={cn(
            "mt-0.5 text-center font-medium whitespace-nowrap transition-colors duration-300",
            size === "sm" && "text-xs",
            size === "default" && "text-xs",
            size === "lg" && "text-sm",
            state === "upcoming" ? "text-muted-foreground" : "text-black",
          )}
        >
          {name}
        </span>

        {description && (
          <span
            className={cn(
              "mt-0.5 text-center whitespace-nowrap text-muted-foreground",
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
  );
}

// =============================================================================
// StepContent  (thin wrapper — place inside StepperContent)
// =============================================================================

export interface StepContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function StepContent({
  className,
  children,
  ...props
}: StepContentProps) {
  return (
    <div className={cn("w-full", className)} {...props}>
      {children}
    </div>
  );
}
