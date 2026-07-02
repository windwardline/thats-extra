import { Badge, Button, Card, Container, SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/reveal";

// Placeholder home page exercising the design system; replaced by the full
// landing page in the next task.
export default function Home() {
  return (
    <Container className="py-24">
      <Reveal>
        <Badge tone="amber">Design system online</Badge>
        <div className="mt-6">
          <SectionHeading
            eyebrow="Margin recovery for specialty trades"
            title='Every "Can You Just..." Should Come With a Change Order.'
            lede="That's Extra turns field notes, photos, labor impacts, and material costs into professional change requests before extra work becomes lost profit."
          />
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/demo">Demo the Workflow</Button>
          <Button href="/demo?sample=1" variant="ghost">
            Generate a Sample Change Request
          </Button>
        </div>
        <Card className="mt-12 max-w-md">
          <p className="font-utility text-xs uppercase tracking-[0.2em] text-amber">
            Status
          </p>
          <p className="mt-2 text-sm text-fog">
            Landing page sections land in the next task.
          </p>
        </Card>
      </Reveal>
    </Container>
  );
}
