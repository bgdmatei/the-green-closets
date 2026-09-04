"use client";

import { useActionState } from "react";
import Link from "next/link";

import { ArticleTypes } from "@/features/blog/types/blog.types";
import type { ActionState } from "@/features/admin/actions/post.actions";

interface PostFormProps {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  initial?: {
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    type: string;
    status: string;
    categoryName: string;
  };
  submitLabel: string;
}

const field = "w-full border border-border bg-surface px-3 py-2 text-step-0 text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";
const label = "block text-step--2 uppercase tracking-[0.1em] text-ink-muted";

export function PostForm({ action, initial, submitLabel }: PostFormProps) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="mt-8 space-y-6">
      {state.error ? (
        <p role="alert" className="border border-border bg-surface p-4 text-step-0 text-ink">
          {state.error}
        </p>
      ) : null}

      <div className="space-y-2">
        <label className={label} htmlFor="title">Title</label>
        <input id="title" name="title" className={field} defaultValue={initial?.title} required maxLength={200} />
      </div>

      <div className="space-y-2">
        <label className={label} htmlFor="slug">Slug</label>
        <input id="slug" name="slug" className={field} defaultValue={initial?.slug} maxLength={80} placeholder="left blank, derived from the title" />
        <p className="text-step--1 text-ink-muted">
          The URL is /articles/&lt;slug&gt;. Changing it on a published post
          breaks existing links.
        </p>
      </div>

      <div className="space-y-2">
        <label className={label} htmlFor="excerpt">Excerpt</label>
        <textarea id="excerpt" name="excerpt" className={field} rows={2} defaultValue={initial?.excerpt} required maxLength={300} />
        <p className="text-step--1 text-ink-muted">
          Shown under the title on the journal index.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <div className="space-y-2">
          <label className={label} htmlFor="categoryName">Category</label>
          <input id="categoryName" name="categoryName" className={field} defaultValue={initial?.categoryName} required maxLength={80} />
          <p className="text-step--1 text-ink-muted">Created if new.</p>
        </div>

        <div className="space-y-2">
          <label className={label} htmlFor="type">Placement</label>
          <select id="type" name="type" className={field} defaultValue={initial?.type ?? ArticleTypes.Latest}>
            <option value={ArticleTypes.Latest}>Latest</option>
            <option value={ArticleTypes.TopPick}>Top pick</option>
            <option value={ArticleTypes.WeeksPick}>Week&apos;s pick</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className={label} htmlFor="status">Status</label>
          <select id="status" name="status" className={field} defaultValue={initial?.status ?? "draft"}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <p className="text-step--1 text-ink-muted">Drafts stay invisible.</p>
        </div>
      </div>

      <div className="space-y-2">
        <label className={label} htmlFor="content">Body (Markdown)</label>
        <textarea
          id="content"
          name="content"
          className={`${field} font-mono`}
          rows={22}
          defaultValue={initial?.content}
          required
          maxLength={100000}
        />
        <p className="text-step--1 text-ink-muted">
          Markdown, including GFM tables and strikethrough. Raw HTML is stripped
          when rendered.
        </p>
      </div>

      <div className="flex items-center gap-4 border-t border-border pt-6">
        <button
          type="submit"
          disabled={pending}
          className="h-10 bg-ink px-5 text-step-0 text-surface transition-colors hover:bg-ink/85 disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {pending ? "Saving…" : submitLabel}
        </button>
        <Link href="/admin" className="text-step-0 text-ink-muted hover:text-ink">
          Cancel
        </Link>
      </div>
    </form>
  );
}
