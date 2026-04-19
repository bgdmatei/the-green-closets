// components/ui/text.tsx
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const textVariants = cva("", {
  variants: {
    variant: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      primary: "text-primary",
    },
    size: {
      xs: "text-xs",
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
      "4xl": "text-4xl",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
    leading: {
      none: "leading-none",
      tight: "leading-tight",
      normal: "leading-normal",
      relaxed: "leading-relaxed",
      loose: "leading-loose",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
    weight: "normal",
    align: "left",
    leading: "normal",
  },
});

type TextElement = "p" | "span" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "label" | "small";

interface TextProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof textVariants> {
  as?: TextElement;
  className?: string;
}

export function Text({
  as: Tag = "p",
  variant,
  size,
  weight,
  align,
  leading,
  className,
  children,
  ...props
}: TextProps) {
  return (
    <Tag
      className={cn(textVariants({ variant, size, weight, align, leading }), className)}
      {...props}
    >
      {children}
    </Tag>
  );
}