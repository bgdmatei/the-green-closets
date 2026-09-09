"use client";

import { useActionState, useMemo, useState } from "react";
import { Text } from "@/components/ui/text";
import Link from "next/link";

import type { ActionState } from "@/features/admin/actions/post.actions";

interface PostFormProps {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  initial?: {
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    status: string;
    categoryName: string;
    coverImageUrl: string | null;
    coverImageAlt: string | null;
    featured: boolean;
  };
  submitLabel: string;
}

const field = "w-full border border-border bg-surface px-3 py-2 text-step-0 text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";
const label = "block text-step--2 uppercase tracking-[0.1em] text-ink-muted";

/** The fields, as strings, so the form can tell whether any of them moved. */
type PostValues = {
  title: string;
  slug: string;
  excerpt: string;
  categoryName: string;
  status: string;
  coverImageUrl: string;
  coverImageAlt: string;
  featured: boolean;
  content: string;
};

const blank: PostValues = {
  title: "",
  slug: "",
  excerpt: "",
  categoryName: "",
  status: "draft",
  coverImageUrl: "",
  coverImageAlt: "",
  featured: false,
  content: "",
};

export function PostForm({ action, initial, submitLabel }: PostFormProps) {
  const [state, formAction, pending] = useActionState(action, {});

  /*
    The fields are controlled rather than uncontrolled so the form can compare
    what is on screen against what it started with. It also repairs a quieter
    problem: React clears an uncontrolled form once its action resolves, which
    on a rejected save would throw away the body the author had just written.
  */
  // Captured once: this is what the post looked like when the page loaded, and
  // it must not drift as the server component re-renders around the form.
  const [pristine] = useState<PostValues>(() =>
    initial
      ? {
          ...initial,
          coverImageUrl: initial.coverImageUrl ?? "",
          coverImageAlt: initial.coverImageAlt ?? "",
        }
      : blank,
  );
  const [values, setValues] = useState(pristine);

  const dirty = useMemo(
    () => JSON.stringify(values) !== JSON.stringify(pristine),
    [values, pristine],
  );

  const set = <K extends keyof PostValues>(key: K, value: PostValues[K]) =>
    setValues((current) => ({ ...current, [key]: value }));

  return (
    <form action={formAction} className="mt-8 space-y-6">
      {state.error ? (
        <Text role="alert" size="sm" className="border border-border bg-surface p-4">
          {state.error}
        </Text>
      ) : null}

      <div className="space-y-2">
        <label className={label} htmlFor="title">Title</label>
        <input id="title" name="title" className={field} value={values.title} onChange={(e) => set("title", e.target.value)} required maxLength={200} />
      </div>

      <div className="space-y-2">
        <label className={label} htmlFor="slug">Slug</label>
        <input id="slug" name="slug" className={field} value={values.slug} onChange={(e) => set("slug", e.target.value)} maxLength={80} placeholder="left blank, derived from the title" />
        <Text size="xs" tone="muted">
          The URL is /articles/&lt;slug&gt;. Changing it on a published post
          breaks existing links.
        </Text>
      </div>

      <div className="space-y-2">
        <label className={label} htmlFor="excerpt">Excerpt</label>
        <textarea id="excerpt" name="excerpt" className={field} rows={2} value={values.excerpt} onChange={(e) => set("excerpt", e.target.value)} required maxLength={300} />
        <Text size="xs" tone="muted">
          Shown under the title on the journal index.
        </Text>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label className={label} htmlFor="categoryName">Category</label>
          <input id="categoryName" name="categoryName" className={field} value={values.categoryName} onChange={(e) => set("categoryName", e.target.value)} required maxLength={80} />
          <Text size="xs" tone="muted">Created if new.</Text>
        </div>

        <div className="space-y-2">
          <label className={label} htmlFor="status">Status</label>
          <select id="status" name="status" className={field} value={values.status} onChange={(e) => set("status", e.target.value)}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <Text size="xs" tone="muted">Drafts stay invisible.</Text>
        </div>
      </div>

      <div className="space-y-2">
        <label className={label} htmlFor="coverImageUrl">Cover image URL</label>
        <input
          id="coverImageUrl"
          name="coverImageUrl"
          type="url"
          className={field}
          value={values.coverImageUrl}
          onChange={(e) => set("coverImageUrl", e.target.value)}
          maxLength={2000}
          placeholder="optional — https://…"
        />
        <Text size="xs" tone="muted">
          Optional. Any https address. Shown at the top of the article, and on
          the front page when the post is featured.
        </Text>
      </div>

      <div className="space-y-2">
        <label className={label} htmlFor="coverImageAlt">Image description</label>
        <input
          id="coverImageAlt"
          name="coverImageAlt"
          className={field}
          value={values.coverImageAlt}
          onChange={(e) => set("coverImageAlt", e.target.value)}
          maxLength={300}
          placeholder="what the image shows, for screen readers"
        />
        <Text size="xs" tone="muted">
          Leave blank only if the image is purely decorative.
        </Text>
      </div>

      <div className="border border-border bg-surface p-4">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            name="featured"
            checked={values.featured}
            onChange={(e) => set("featured", e.target.checked)}
            className="mt-1"
          />
          <span>
            <span className="block text-step-0 text-ink">
              Feature on the front page
            </span>
            <span className="mt-1 block text-step--1 text-ink-muted">
              Featured posts appear on the homepage. A draft is never shown,
              featured or not.
            </span>
          </span>
        </label>
      </div>

      <div className="space-y-2">
        <label className={label} htmlFor="content">Body (Markdown)</label>
        <textarea
          id="content"
          name="content"
          className={`${field} font-mono`}
          rows={22}
          value={values.content}
          onChange={(e) => set("content", e.target.value)}
          required
          maxLength={100000}
        />
        <Text size="xs" tone="muted">
          Markdown, including GFM tables and strikethrough. Raw HTML is stripped
          when rendered.
        </Text>
      </div>

      <div className="flex items-center gap-4 border-t border-border pt-6">
        <button
          type="submit"
          /* Nothing has changed, so there is nothing to save. */
          disabled={pending || !dirty}
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
