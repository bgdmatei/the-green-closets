import { Container } from "@/components/ui/container";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { ButtonLink } from "@/components/ui/link";

export default function NotFound() {
  return (
    <Container
      width="prose"
      className="flex flex-col items-center gap-6 py-28 text-center"
    >
      <Heading as="h1" size="lg" accent="found">
        Page not
      </Heading>
      <Text leading="relaxed" tone="muted">
        The page you requested does not exist or is no longer available.
      </Text>
      <ButtonLink href="/" variant="outline">
        Back to the shop
      </ButtonLink>
    </Container>
  );
}
