import type { Metadata } from "next";
import { Container, SectionHeading } from "@/components/ui";
import { DemoForm } from "@/components/demo-form";

export const metadata: Metadata = {
  title: "Demo — That's Extra",
  description:
    "File a field report and watch it become a professional change request package.",
};

export default async function DemoPage({
  searchParams,
}: {
  searchParams: Promise<{ sample?: string }>;
}) {
  const { sample } = await searchParams;

  return (
    <Container className="py-16 lg:py-20">
      <div className="print-hidden">
        <SectionHeading
          eyebrow="Live Demo"
          title="File the report. Keep the money."
          lede="Fill out the field report the way a foreman would — quick notes, real impacts. The automation turns it into a change request package on the spot."
        />
      </div>
      <div className="mt-12 max-w-3xl">
        <DemoForm initialSample={sample === "1"} />
      </div>
    </Container>
  );
}
