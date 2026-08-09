import type { InputHTMLAttributes, ReactNode } from 'react';

/**
 * Shared field chrome: always-visible label, optional hint, and an error
 * message wired to the control via aria-describedby.
 *
 * Labels are never collapsed into placeholders — placeholders carry examples
 * only, so the label survives once the user starts typing.
 */
export function FieldShell({
  id,
  label,
  optional,
  error,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-text">
        {label}
        {optional && <span className="ml-2 font-normal text-muted">Optional</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-[#ff9d9d]">
          {error}
        </p>
      )}
    </div>
  );
}

/** Shared input styling so text, select and textarea can never drift apart. */
export const controlClass =
  'w-full min-h-[44px] rounded-btn border bg-bg px-3.5 py-3 text-[0.95rem] text-text placeholder:text-muted/70 transition-colors duration-150 focus:border-accent';

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
};

export function Field({ id, label, optional, error, ...rest }: FieldProps) {
  return (
    <FieldShell id={id} label={label} optional={optional} error={error}>
      <input
        id={id}
        name={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${controlClass} ${error ? 'border-[#ff9d9d]' : 'border-line-strong'}`}
        {...rest}
      />
    </FieldShell>
  );
}
