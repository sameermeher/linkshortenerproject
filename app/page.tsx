import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Link2,
  BarChart3,
  Zap,
  Shield,
  MousePointerClick,
  Globe,
} from "lucide-react";

const features = [
  {
    icon: Link2,
    title: "Instant Short Links",
    description:
      "Paste any long URL and get a clean, shareable short link in seconds.",
  },
  {
    icon: BarChart3,
    title: "Click Analytics",
    description:
      "Track how many times your links are clicked with real-time stats on your dashboard.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Redirects happen in milliseconds — your visitors never notice the extra hop.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Your links are tied to your account. Only you can see, edit, or delete them.",
  },
  {
    icon: MousePointerClick,
    title: "One-Click Copy",
    description:
      "Copy shortened links to your clipboard instantly from your dashboard.",
  },
  {
    icon: Globe,
    title: "Works Everywhere",
    description:
      "Share on social media, in emails, or in any message — short links work everywhere.",
  },
];

export default function Home() {
  return (
    <main className="flex flex-col">
      {/* Hero */}
      <section className="flex flex-col items-center gap-6 px-6 py-24 text-center">
        <Badge variant="secondary" className="text-sm">
          Free to use · No credit card required
        </Badge>
        <h1 className="max-w-2xl text-5xl font-bold tracking-tight text-foreground">
          Shorten links. <span className="text-muted-foreground">Share smarter.</span>
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Turn long, unwieldy URLs into clean short links you can share anywhere.
          Track every click from your personal dashboard.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <SignUpButton mode="modal">
            <Button size="lg" className="px-8">
              Get started free
            </Button>
          </SignUpButton>
          <SignInButton mode="modal">
            <Button size="lg" variant="outline" className="px-8">
              Sign in
            </Button>
          </SignInButton>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-3xl font-semibold tracking-tight text-foreground">
            Everything you need
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <Card key={title}>
                <CardHeader className="flex flex-row items-center gap-3 pb-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary">
                    <Icon className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <CardTitle className="text-base">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-6 py-20">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 rounded-2xl border border-border bg-card p-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Ready to shorten your first link?
          </h2>
          <p className="text-muted-foreground">
            Create a free account and start sharing cleaner links today.
          </p>
          <SignUpButton mode="modal">
            <Button size="lg" className="px-10">
              Create free account
            </Button>
          </SignUpButton>
        </div>
      </section>
    </main>
  );
}
