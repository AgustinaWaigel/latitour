import * as React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function Textarea({className,...props}:React.ComponentProps<'textarea'>){return <textarea data-slot="textarea" className={twMerge(clsx('flex min-h-24 w-full rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-sm outline-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-teal-700',className))} {...props}/>;}