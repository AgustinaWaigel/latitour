import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ComponentProps } from 'react';
const variants = cva(
  'inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700',
  {
    variants: {
      variant: {
        default: 'bg-teal-800 text-white hover:bg-teal-900',
        outline:
          'border border-slate-200 bg-white hover:bg-slate-50 text-slate-700',
        ghost: 'hover:bg-slate-100 text-slate-600',
      },
      size: { default: 'px-5 min-h-11 py-2.5', icon: 'size-11' },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);
export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ComponentProps<'button'> &
  VariantProps<typeof variants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      className={twMerge(clsx(variants({ variant, size }), className))}
      {...props}
    />
  );
}
