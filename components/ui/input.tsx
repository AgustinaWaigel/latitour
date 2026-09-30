import * as React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function Input({className,...props}:React.ComponentProps<'input'>){return <input data-slot="input" className={twMerge(clsx('flex min-h-11 w-full rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-600 focus-visible:ring-2 focus-visible:ring-teal-700',className))} {...props}/>;}