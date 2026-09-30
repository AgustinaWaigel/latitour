'use client';
import { useEffect,useRef } from 'react';
// Lightweight adaptation of React Bits FadeContent (MIT), without animation dependencies.
// https://github.com/DavidHDev/react-bits
// Content remains visible with JS disabled and prefers-reduced-motion is respected.
export function FadeContent({children}:{children:React.ReactNode}){const ref=useRef<HTMLDivElement>(null);useEffect(()=>{const node=ref.current;if(!node||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;const animation=node.animate([{opacity:.35,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],{duration:450,easing:'ease-out'});return()=>animation.cancel();},[]);return <div ref={ref}>{children}</div>;}