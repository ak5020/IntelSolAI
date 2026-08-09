import { SpinnerIcon } from '@/components/svg/icons';

/** Submit control with an explicit pending state. Disabled while sending. */
export function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-btn bg-accent px-5 py-3 font-medium text-accent-ink transition-colors duration-150 hover:bg-[#57e6cd] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
    >
      {pending && (
        <SpinnerIcon className="h-4 w-4" style={{ animation: 'spin 700ms linear infinite' }} />
      )}
      {pending ? 'Sending…' : 'Send enquiry'}
    </button>
  );
}
