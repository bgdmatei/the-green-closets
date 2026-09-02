import { Heading } from "./heading";
import { TextLink } from "./link";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: React.ReactNode;
  /** Set in the display italic after the title — "New in the *closet*". */
  accent?: React.ReactNode;
  /** Optional trailing link, rendered flush right on its baseline. */
  action?: { href: string; label: string };
  as?: "h1" | "h2";
  id?: string;
  className?: string;
}

/**
 * The heading row that opens a section: display heading on the left, an
 * optional "View all →" on the right.
 */
export function SectionHeader({
  title,
  accent,
  action,
  as = "h2",
  id,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-end justify-between gap-x-6 gap-y-2",
        className,
      )}
    >
      <Heading as={as} id={id} size="md" accent={accent}>
        {title}
      </Heading>
      {action ? (
        <TextLink href={action.href} tone="default" size="sm" className="pb-1.5">
          {action.label}
          <span aria-hidden>&rarr;</span>
        </TextLink>
      ) : null}
    </div>
  );
}
