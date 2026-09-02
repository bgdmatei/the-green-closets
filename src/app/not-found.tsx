import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { ButtonLink } from "@/components/ui/link";
import { Text } from "@/components/ui/text";

export default function NotFound() {
  return (
    <Container
      width="prose"
      className="flex flex-col items-center gap-6 py-24 text-center"
    >
      <Heading as="h1" size="lg">
        Page not found
      </Heading>
      <Text tone="muted" align="center">
        The page you requested does not exist or is no longer available.
      </Text>
      <ButtonLink href="/">Back to articles</ButtonLink>
    </Container>
  );
}
