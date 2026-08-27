'use client';

import { useEffect, useRef, useState } from 'react';

import { AlertIcon, CheckIcon } from '@/components/svg/icons';
import { Field } from '@/components/ui/Field';
import { Select } from '@/components/ui/Select';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { Textarea } from '@/components/ui/Textarea';
import {
  budgetOptions,
  contact,
  serviceOptions,
  site,
} from '@/lib/content';
import {
  contactSchema,
  fieldErrorsFrom,
  type ContactResponse,
} from '@/lib/contactSchema';

type Status = 'idle' | 'submitting' | 'success' | 'error';

const EMPTY = {
  name: '',
  email: '',
  company: '',
  message: '',
  service: '',
  budget: '',
  website: '', // honeypot
};

type Values = typeof EMPTY;

export function ContactForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [formError, setFormError] = useState<string | null>(null);

  /** Mount time drives the bot timing check. */
  const mountedAt = useRef<number>(Date.now());
  const successRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  /* Move focus to whichever status message just appeared, so keyboard and
     screen-reader users are told the outcome rather than left on a button. */
  useEffect(() => {
    if (status === 'success') successRef.current?.focus();
    if (status === 'error') errorRef.current?.focus();
  }, [status]);

  const set = (key: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setValues((prev) => ({ ...prev, [key]: e.target.value }));
  };

  /** Validate one field on blur, using the same schema the server runs. */
  const validateField = (key: keyof Values) => () => {
    const result = contactSchema.safeParse({ ...values, elapsedMs: 99_999 });
    if (result.success) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
      return;
    }
    const all = fieldErrorsFrom(result.error);
    setErrors((prev) => {
      const next = { ...prev };
      if (all[key]) next[key] = all[key];
      else delete next[key];
      return next;
    });
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);

    const payload = { ...values, elapsedMs: Date.now() - mountedAt.current };

    // Client-side gate. The server re-validates this exact payload.
    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) {
      setErrors(fieldErrorsFrom(parsed.error));
      setStatus('idle');
      return;
    }

    setErrors({});
    setStatus('submitting');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as ContactResponse;

      if (data.ok) {
        setStatus('success');
        return;
      }

      // Values are deliberately left untouched so nothing the user typed is lost.
      if (data.fieldErrors) setErrors(data.fieldErrors);
      setFormError(data.error);
      setStatus('error');
    } catch {
      setFormError('We could not reach the server. Check your connection and try again.');
      setStatus('error');
    }
  }

  /* --- Success panel replaces the form entirely ------------------------- */
  if (status === 'success') {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        aria-live="polite"
        className="rounded-card border border-accent bg-bg-elev p-8"
      >
        <CheckIcon className="h-7 w-7 text-accent" />
        <h3 className="mt-5">{contact.successTitle}</h3>
        <p className="mt-3 text-body">{contact.successBody}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-card border border-line bg-bg-elev p-6 sm:p-8"
    >
      <h3 className="text-[1.25rem]">{contact.formTitle}</h3>

      <div className="mt-7 flex flex-col gap-5">
        <Field
          id="name"
          label="Full name"
          autoComplete="name"
          placeholder="Jack Turner"
          value={values.name}
          onChange={set('name')}
          onBlur={validateField('name')}
          error={errors.name}
          required
        />

        <Field
          id="email"
          label="Work email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={values.email}
          onChange={set('email')}
          onBlur={validateField('email')}
          error={errors.email}
          required
        />

        <Field
          id="company"
          label="Company"
          optional
          autoComplete="organization"
          placeholder="Acme Ltd"
          value={values.company}
          onChange={set('company')}
          onBlur={validateField('company')}
          error={errors.company}
        />

        <Textarea
          id="message"
          label="What are you trying to automate?"
          placeholder="e.g. Our reps spend three hours a day on follow-up emails after every demo."
          value={values.message}
          onChange={set('message')}
          onBlur={validateField('message')}
          error={errors.message}
          required
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <Select
            id="service"
            label="Which service?"
            options={serviceOptions}
            placeholder="Select a service"
            value={values.service}
            onChange={set('service')}
            error={errors.service}
          />
          <Select
            id="budget"
            label="Budget range"
            options={budgetOptions}
            placeholder="Select a range"
            value={values.budget}
            onChange={set('budget')}
            error={errors.budget}
          />
        </div>

        {/* Honeypot. Off-screen, untabbable, and hidden from assistive tech —
            only an automated filler will ever populate it. */}
        <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}>
          <label htmlFor="website">Website</label>
          <input
            id="website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={values.website}
            onChange={set('website')}
          />
        </div>
      </div>

      {formError && (
        <div
          ref={errorRef}
          tabIndex={-1}
          aria-live="polite"
          className="mt-6 flex items-start gap-3 rounded-btn border border-[#ff9d9d]/40 bg-[#ff9d9d]/[0.07] p-4"
        >
          <AlertIcon className="mt-0.5 h-5 w-5 shrink-0 text-[#ff9d9d]" />
          <p className="text-sm text-body">
            {formError} You can also email us directly at{' '}
            <a href={`mailto:${site.email}`} className="text-accent underline underline-offset-4">
              {site.email}
            </a>
            .
          </p>
        </div>
      )}

      <div className="mt-7">
        <SubmitButton pending={status === 'submitting'} />
        <p className="mt-4 text-sm text-muted">{contact.privacyNote}</p>
      </div>
    </form>
  );
}
