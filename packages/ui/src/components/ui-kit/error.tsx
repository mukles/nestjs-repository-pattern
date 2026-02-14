"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  AlertCircle,
  AlertTriangle,
  Ban,
  Info,
  RefreshCw,
  XCircle,
} from "lucide-react";
import * as React from "react";

import { Button } from "@repo/ui/components/ui-kit/button";
import { cn } from "@repo/ui/lib/utils";

const errorVariants = cva("relative w-full rounded-lg border p-4", {
  variants: {
    variant: {
      default: "border-destructive/50 bg-destructive/10 text-destructive",
      warning: "bg-warning/10 border-warning/50 text-warning-foreground",
      info: "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200",
      subtle: "border-muted-foreground/20 bg-muted text-muted-foreground",
    },
    size: {
      default: "p-4",
      sm: "p-3 text-sm",
      lg: "p-6",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

const iconMap = {
  default: XCircle,
  warning: AlertTriangle,
  info: Info,
  subtle: AlertCircle,
  forbidden: Ban,
};

export interface ErrorProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof errorVariants> {
  title?: string;
  message?: string;
  icon?: keyof typeof iconMap | React.ReactNode;
  onRetry?: () => void;
  retryLabel?: string;
  showIcon?: boolean;
}

function Error({
  className,
  variant = "default",
  size,
  title,
  message,
  icon,
  onRetry,
  retryLabel = "Try again",
  showIcon = true,
  children,
  ...props
}: ErrorProps) {
  const IconComponent =
    typeof icon === "string" && icon in iconMap
      ? iconMap[icon as keyof typeof iconMap]
      : icon === undefined
        ? iconMap[variant || "default"]
        : null;

  return (
    <div
      data-slot="error"
      role="alert"
      className={cn(errorVariants({ variant, size }), className)}
      {...props}
    >
      <div className="flex items-start gap-3">
        {showIcon && IconComponent && (
          <div className="shrink-0">
            {typeof IconComponent === "function" ? (
              <IconComponent className="size-5" />
            ) : (
              icon
            )}
          </div>
        )}
        <div className="flex-1 space-y-1">
          {title && (
            <h5
              data-slot="error-title"
              className="leading-none font-medium tracking-tight"
            >
              {title}
            </h5>
          )}
          {message && (
            <p data-slot="error-message" className="text-sm opacity-90">
              {message}
            </p>
          )}
          {children}
        </div>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="shrink-0"
          >
            <RefreshCw className="mr-2 size-4" />
            {retryLabel}
          </Button>
        )}
      </div>
    </div>
  );
}

function ErrorTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h5
      data-slot="error-title"
      className={cn("leading-none font-medium tracking-tight", className)}
      {...props}
    />
  );
}

function ErrorMessage({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      data-slot="error-message"
      className={cn("text-sm opacity-90", className)}
      {...props}
    />
  );
}

function ErrorActions({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="error-actions"
      className={cn("mt-3 flex items-center gap-2", className)}
      {...props}
    />
  );
}

export { Error, ErrorActions, ErrorMessage, ErrorTitle, errorVariants };
