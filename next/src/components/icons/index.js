// W24-T5 — Centralized icon barrel export.
// Faz 1: core utility icons (close, arrow, chevron, search).
// Faz 2: audio + semantic icons (play, pause, volume, info, alert, chat, external).
// All icons are pure JSX (no 'use client'), use currentColor stroke/fill,
// and accept { size, strokeWidth, className, style, ...rest } props.

// Faz 1
export { default as CloseIcon } from './CloseIcon';
export { default as ArrowRight } from './ArrowRight';
export { default as ChevronDown } from './ChevronDown';
export { default as ChevronRight } from './ChevronRight';
export { default as ChevronLeft } from './ChevronLeft';
export { default as SearchIcon } from './SearchIcon';

// Faz 2
export { default as PlayIcon } from './PlayIcon';
export { default as PauseIcon } from './PauseIcon';
export { default as VolumeOnIcon } from './VolumeOnIcon';
export { default as VolumeOffIcon } from './VolumeOffIcon';
export { default as InfoIcon } from './InfoIcon';
export { default as AlertTriangleIcon } from './AlertTriangleIcon';
export { default as ChatBubbleIcon } from './ChatBubbleIcon';
export { default as ExternalLinkIcon } from './ExternalLinkIcon';
