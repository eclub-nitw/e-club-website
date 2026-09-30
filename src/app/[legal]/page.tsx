import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLegalSlug, legalPages, readLegal } from "@/lib/legal";
import { Container, LegalDoc, PageHeader } from "@/components/ui";

export const dynamicParams = false;
export const generateStaticParams = () => Object.keys(legalPages).map((legal) => ({ legal }));

export async function generateMetadata({ params }: { params: Promise<{ legal: string }> }): Promise<Metadata> {
  const { legal } = await params;
  if (!isLegalSlug(legal)) return {};
  // noindex while the texts are unreviewed drafts; remove once faculty review is complete.
  return { title: legalPages[legal].title, description: `${legalPages[legal].title} for the E-Club NIT Warangal website.`, alternates: { canonical: `/${legal}` }, robots: { index: false, follow: true } };
}

export default async function LegalPage({ params }: { params: Promise<{ legal: string }> }) {
  const { legal } = await params;
  if (!isLegalSlug(legal)) notFound();
  const source = await readLegal(legal);
  return (
    <>
      <PageHeader number="Legal" label="Draft pending review" title={legalPages[legal].title} />
      <div className="tone-paper py-16 md:py-24"><Container><LegalDoc source={source} /></Container></div>
    </>
  );
}
