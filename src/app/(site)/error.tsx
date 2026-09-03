"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // The digest is the only safe handle on the server-side error; the message
    // itself is redacted in production builds.
    console.error("Route error", error.digest ?? error.message);
  }, [error]);

  return (
    <Container
      width="prose"
      className="flex flex-col items-center gap-6 py-28 text-center"
    >
      <Heading as="h1" size="lg" accent="wrong">
        Something went
      </Heading>
      <p className="text-step-1 leading-relaxed text-ink-muted">
        This page failed to load. Trying again usually fixes it.
      </p>
      <Button variant="outline" onClick={reset}>
        Try again
      </Button>
    </Container>
  );
}
