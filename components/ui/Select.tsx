import type { SelectHTMLAttributes } from 'react';

import { FieldShell, controlClass } from './Field';

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  id: string;
  label: string;
  options: readonly string[];
  placeholder?: string;
  error?: string;
};

export function Select({ id, label, options, placeholder, error, ...rest }: Props) {
  return (
    <FieldShell id={id} label={label} optional error={error}>
      <select
        id={id}
        name={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${controlClass} appearance-none ${error ? 'border-[#ff9d9d]' : 'border-line-strong'}`}
        {...rest}
      >
        <option value="">{placeholder ?? 'Select an option'}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}
