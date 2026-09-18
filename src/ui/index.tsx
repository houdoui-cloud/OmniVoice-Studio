import React, { useState, useRef, useEffect } from 'react';
import { Button as ShadcnButton, buttonVariants } from '../components/ui/button';
import { Badge as ShadcnBadge } from '../components/ui/badge';
import { Input as ShadcnInput } from '../components/ui/input';
import { Textarea as ShadcnTextarea } from '../components/ui/textarea';
import { Progress as ShadcnProgress } from '../components/ui/progress';
import { Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

// ── Button ─────────────────────────────────────────────────────────────
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: any;
  size?: any;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  loading?: boolean;
  active?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', leading, trailing, loading, active, children, disabled, ...props }, ref) => {
    let finalVariant = variant;
    if (active) {
      if (variant === 'chip') finalVariant = 'chipActive';
      else if (variant === 'preset') finalVariant = 'presetActive';
      else if (variant === 'iconBtn') finalVariant = 'iconBtnActive';
    }

    return (
      <ShadcnButton
        ref={ref}
        variant={finalVariant}
        size={size}
        disabled={disabled || loading}
        className={cn(className)}
        {...props}
      >
        {loading ? <Loader2 className="size-3.5 animate-spin shrink-0" /> : leading}
        {children}
        {trailing}
      </ShadcnButton>
    );
  }
);
Button.displayName = 'Button';

// ── Badge ──────────────────────────────────────────────────────────────
export const Badge = ShadcnBadge;

// ── Input ──────────────────────────────────────────────────────────────
export const Input = ShadcnInput;

// ── Textarea ───────────────────────────────────────────────────────────
export const Textarea = ShadcnTextarea;

// ── Progress ───────────────────────────────────────────────────────────
export const Progress = ShadcnProgress;

// ── Dialog ─────────────────────────────────────────────────────────────
export interface DialogProps {
  open?: boolean;
  onClose?: () => void;
  title?: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children?: React.ReactNode;
  className?: string;
}

export function Dialog({ open, onClose, title, footer, size = 'md', children, className }: DialogProps) {
  if (!open) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }[size] || 'max-w-lg';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="fixed inset-0"
        onClick={onClose}
      />
      <div
        className={cn(
          'relative z-10 w-full flex flex-col bg-[var(--bg-elev-1,#282828)] border border-[var(--border-subtle,rgba(255,255,255,0.08))] rounded-xl shadow-2xl overflow-hidden',
          sizeClasses,
          className
        )}
      >
        {title && (
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border-subtle,rgba(255,255,255,0.08))]">
            <div className="text-sm font-semibold text-[var(--text-primary,#ebdbb2)] flex items-center gap-2">
              {title}
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="text-[var(--text-muted,#928374)] hover:text-[var(--text-primary,#ebdbb2)] p-1 rounded hover:bg-[var(--bg-elev-2,#32302f)]"
              >
                ✕
              </button>
            )}
          </div>
        )}
        <div className="p-5 overflow-y-auto max-h-[80vh] text-sm text-[var(--text-primary,#ebdbb2)]">
          {children}
        </div>
        {footer && (
          <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-[var(--border-subtle,rgba(255,255,255,0.08))] bg-[var(--bg-elev-0,#1d2021)]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Segmented ──────────────────────────────────────────────────────────
export interface SegmentedProps {
  items?: Array<{ value: string; label: React.ReactNode }>;
  options?: Array<{ value: string; label: React.ReactNode }>;
  value?: string;
  onChange?: (val: string) => void;
  className?: string;
}

export function Segmented({ items, options, value, onChange, className }: SegmentedProps) {
  const list = items || options || [];
  return (
    <div
      className={cn(
        'inline-flex items-center p-0.5 rounded-lg bg-[var(--bg-elev-2,#32302f)] border border-[var(--border-subtle,rgba(255,255,255,0.06))]',
        className
      )}
    >
      {list.map((item) => {
        const active = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onChange?.(item.value)}
            className={cn(
              'px-3 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap',
              active
                ? 'bg-[var(--accent,#d3869b)] text-[var(--text-inverse,#1d2021)] font-semibold shadow-xs'
                : 'text-[var(--text-secondary,#a89984)] hover:text-[var(--text-primary,#ebdbb2)] hover:bg-[var(--bg-elev-3,rgba(255,255,255,0.04))]'
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

// ── Panel ──────────────────────────────────────────────────────────────
export interface PanelProps {
  variant?: 'flat' | 'elevated' | 'outline';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  title?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function Panel({
  variant = 'flat',
  padding = 'md',
  title,
  actions,
  children,
  className,
}: PanelProps) {
  const padClass = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  }[padding];

  const varClass = {
    flat: 'bg-[var(--bg-elev-1,#282828)] border border-[var(--border-subtle,rgba(255,255,255,0.07))]',
    elevated: 'bg-[var(--bg-elev-2,#32302f)] shadow-md border border-[var(--border-subtle,rgba(255,255,255,0.08))]',
    outline: 'border border-[var(--border-subtle,rgba(255,255,255,0.12))] bg-transparent',
  }[variant];

  return (
    <div className={cn('rounded-xl flex flex-col', varClass, className)}>
      {(title || actions) && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-subtle,rgba(255,255,255,0.06))]">
          {title && <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary,#a89984)]">{title}</div>}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={cn('flex-1', padClass)}>{children}</div>
    </div>
  );
}

// ── Field ──────────────────────────────────────────────────────────────
export interface FieldProps {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function Field({ label, hint, error, children, className }: FieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <div className="text-xs font-medium text-[var(--text-primary,#ebdbb2)]">
          {label}
        </div>
      )}
      {children}
      {hint && !error && (
        <div className="text-[0.7rem] text-[var(--text-muted,#928374)]">
          {hint}
        </div>
      )}
      {error && (
        <div className="text-[0.7rem] text-destructive font-medium">
          {error}
        </div>
      )}
    </div>
  );
}

// ── Select ─────────────────────────────────────────────────────────────
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options?: Array<{ value: string; label: string }>;
  items?: Array<{ value: string; label: string }>;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, items, children, className, ...props }, ref) => {
    const list = options || items;
    return (
      <select
        ref={ref}
        className={cn(
          'flex h-8 w-full rounded-md border border-[var(--border-subtle,rgba(255,255,255,0.12))] bg-[var(--bg-elev-2,#32302f)] px-2.5 py-1 text-xs text-[var(--text-primary,#ebdbb2)] shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent,#d3869b)] disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      >
        {list
          ? list.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))
          : children}
      </select>
    );
  }
);
Select.displayName = 'Select';

// ── Menu (Dropdown Actions Menu) ───────────────────────────────────────
export interface MenuItem {
  id?: string;
  label?: React.ReactNode;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  shortcut?: string;
  disabled?: boolean;
  onSelect?: () => void;
}

export interface MenuProps {
  items?: Array<MenuItem | 'separator'>;
  children?: React.ReactNode;
  className?: string;
}

export function Menu({ items = [], children, className }: MenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  return (
    <div ref={containerRef} className={cn('relative inline-block', className)}>
      <div onClick={() => setOpen((prev) => !prev)}>
        {children}
      </div>
      {open && (
        <div className="absolute right-0 mt-1 min-w-[140px] z-50 rounded-lg bg-[var(--bg-elev-2,#32302f)] border border-[var(--border-subtle,rgba(255,255,255,0.1))] p-1 shadow-xl text-xs animate-in fade-in-50 zoom-in-95">
          {items.map((item, idx) => {
            if (item === 'separator') {
              return <div key={`sep-${idx}`} className="my-1 border-t border-[var(--border-subtle,rgba(255,255,255,0.08))]" />;
            }
            const Icon = item.icon;
            return (
              <button
                key={item.id || idx}
                type="button"
                disabled={item.disabled}
                onClick={() => {
                  setOpen(false);
                  item.onSelect?.();
                }}
                className={cn(
                  'w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-md text-left transition-colors',
                  item.disabled
                    ? 'opacity-40 cursor-not-allowed text-[var(--text-muted,#928374)]'
                    : 'text-[var(--text-primary,#ebdbb2)] hover:bg-[var(--bg-elev-3,rgba(255,255,255,0.06))] cursor-pointer'
                )}
              >
                <span className="inline-flex items-center gap-2">
                  {Icon && <Icon size={13} className="shrink-0 text-[var(--text-secondary,#a89984)]" />}
                  <span>{item.label}</span>
                </span>
                {item.shortcut && (
                  <span className="text-[0.65rem] text-[var(--text-muted,#928374)] font-mono">
                    {item.shortcut}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Re-exports of remaining components ─────────────────────────────────
export * from '../components/ui/table';
export * from '../components/ui/tabs';
export * from '../components/ui/tooltip';
export * from '../components/ui/slider';

const UI = {
  Button,
  Dialog,
  Progress,
  Select,
  Field,
  Menu,
};
export default UI;
