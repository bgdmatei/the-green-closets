"use client";

import * as Dialog from "@radix-ui/react-dialog";

interface ConfirmDialogProps {
  /** Label on the button that opens the dialog. */
  trigger: string;
  title: string;
  /** What is about to happen, in plain words. */
  description: string;
  /** Label on the destructive button. */
  confirmLabel: string;
  cancelLabel?: string;
  /** The Server Action the confirm button submits to. */
  action: (formData: FormData) => Promise<void>;
  /** Identifies the record to act on, e.g. `{ name: "postId", value: id }`. */
  field: { name: string; value: string };
}

/**
 * Asks before something irreversible happens.
 *
 * The form lives inside the dialog rather than around the trigger, because
 * Radix renders the content through a portal at the end of the body: a submit
 * button there is outside any form the page wrapped around it, and would
 * silently do nothing. Owning the form keeps the Server Action unchanged and
 * the whole interaction in one place.
 */
export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel,
  cancelLabel = "Back",
  action,
  field,
}: ConfirmDialogProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="h-9 border border-border px-4 text-step-0 text-ink-muted transition-colors hover:border-ink hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {trigger}
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(28rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 border border-border bg-surface p-6 text-ink shadow-raised focus:outline-none">
          <Dialog.Title className="text-step-2 font-normal text-ink">
            {title}
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-step-0 text-ink-muted">
            {description}
          </Dialog.Description>

          <form action={action} className="mt-6 flex flex-wrap justify-end gap-3">
            <input type="hidden" name={field.name} value={field.value} readOnly />
            {/*
              First in the DOM, so the dialog opens with the safe option focused
              and Enter cannot destroy anything by reflex.
            */}
            <Dialog.Close asChild>
              <button
                type="button"
                className="h-10 bg-ink px-5 text-step-0 text-surface transition-colors hover:bg-ink/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {cancelLabel}
              </button>
            </Dialog.Close>
            <button
              type="submit"
              className="h-10 bg-danger px-5 text-step-0 text-danger-contrast transition-colors hover:bg-danger-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {confirmLabel}
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
