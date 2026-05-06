import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Projects } from "@/components/Projects";
import { Process } from "@/components/Process";
import { WhyUs } from "@/components/WhyUs";
import { FAQ } from "@/components/FAQ";
import { Contact, Footer } from "@/components/Contact";
import { site, seo } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Shabih. | Web Development & AI Agency",
  description: "Fixed-price web development agency. Landing pages from $400, WordPress from $500, AI integrations from $800, mobile apps & SaaS from $1,500. Delivered in weeks, not months.",
  alternates: {
    canonical: site.url,
  },
  openGraph: {
    title: "Shabih. | Web Development & AI Agency",
    description: "Fixed-price web development. Landing pages, WordPress, AI integrations, SaaS dashboards & mobile apps. Fast delivery, transparent pricing.",
    url: site.url,
    type: "website",
    siteName: "Shabih.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shabih. | Web Development & AI Agency",
    description: "Fixed-price web development. Landing pages, WordPress, AI integrations & mobile apps. Fast delivery, transparent pricing.",
    creator: seo.keywords[0] ? "@shabihhaider" : "@shabihhaider",
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <Services />
      <Projects />
      <Process />
      <WhyUs />
      <FAQ />
      <Contact />
      <Footer />
    </main>
  );
}
