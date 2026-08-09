import type { TextareaHTMLAttributes } from 'react';

import { FieldShell, controlClass } from './Field';

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  id: string;
  label: string;
  error?: string;
};

export function Textarea({ id, label, error, ...rest }: Props) {
  return (
    <FieldShell id={id} label={label} error={error}>
      <textarea
        id={id}
        name={id}
        rows={5}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${controlClass} resize-y ${error ? 'border-[#ff9d9d]' : 'border-line-strong'}`}
        {...rest}
      />
    </FieldShell>
  );
}
