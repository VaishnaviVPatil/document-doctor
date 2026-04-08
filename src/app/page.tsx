import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plane, Briefcase, Car, BookUser, FileCheck2 } from "lucide-react";

const categories = [
  {
    slug: "visa",
    title: "Visa",
    description: "Schengen, tourist, work & student visas worldwide.",
    icon: Plane,
  },
  {
    slug: "permit",
    title: "Business Permit",
    description: "Registrations, licenses & city permits to launch your business.",
    icon: Briefcase,
  },
  {
    slug: "license",
    title: "Driver's License",
    description: "New, renewal & international driving permits.",
    icon: Car,
  },
  {
    slug: "passport",
    title: "Passport",
    description: "First-time applications, renewals & emergency passports.",
    icon: BookUser,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 font-semibold">
            <FileCheck2 className="h-6 w-6 text-primary" />
            Document Doctor
          </div>
          <nav className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Button>Get started</Button>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <div className="mx-auto inline-flex items-center rounded-full border bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
          AI-powered document assistant
        </div>
        <h1 className="mt-6 text-5xl font-bold tracking-tight sm:text-6xl">
          Never miss a document again
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Personalized checklists, deadline reminders, and an AI assistant that knows
          every visa, permit, and license requirement — so you can stop guessing and
          start applying.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link href="/dashboard">
            <Button size="lg">Start a checklist</Button>
          </Link>
          <Button size="lg" variant="outline">
            How it works
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold">Pick a category to get started</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            We&apos;ll generate a personalized checklist with everything you need.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map(({ slug, title, description, icon: Icon }) => (
            <Link key={slug} href={`/checklist/${slug}`} className="group">
              <Card className="h-full transition-all hover:border-primary hover:shadow-lg">
                <CardHeader>
                  <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="text-sm font-medium text-primary">
                    Get started →
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-6 py-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Document Doctor
        </div>
      </footer>
    </main>
  );
}
