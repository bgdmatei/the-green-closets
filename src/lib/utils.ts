import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * The type scale uses custom names (`text-step-2`), which tailwind-merge cannot
 * tell apart from a text colour (`text-ink`) — both are just `text-*`. Left
 * unconfigured it treats them as one group and keeps only whichever came last,
 * silently dropping the other. Registering the scale as font sizes keeps size
 * and colour independent.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "step--2",
            "step--1",
            "step-0",
            "step-1",
            "step-2",
            "step-3",
            "step-4",
            "step-5",
            "lede",
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
