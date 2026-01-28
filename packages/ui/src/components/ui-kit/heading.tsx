import { Slot } from '@radix-ui/react-slot';
import { cn } from '@repo/ui/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

export const headingVariants = cva('tracking-[1px] text-foreground', {
  variants: {
    variant: {
      h1: 'text-[30px] leading-[1.5] font-semibold text-foreground',
      h2: 'text-2xl leading-[1.33] font-semibold',
      h3: 'text-lg font-semibold',
      h4: '',
      h5: '',
      h6: 'text-base leading-[1.625] font-medium',
    },
  },
});

interface HeadingProps
  extends
    React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  asChild?: boolean;
}

export function Heading({
  className,
  variant = 'h1',
  asChild,
  ...props
}: HeadingProps) {
  const Comp = asChild ? Slot : 'h1';

  return (
    <Comp className={cn(headingVariants({ variant, className }))} {...props} />
  );
}
