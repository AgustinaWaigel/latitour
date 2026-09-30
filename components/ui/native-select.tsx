import * as React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function NativeSelect({className,...props}:React.ComponentProps<'select'>){return <select data-slot="native-select" className={twMerge(clsx('min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-teal-700',className))} {...props}/>;}