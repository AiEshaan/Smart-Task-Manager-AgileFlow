import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import { Blocks, MoveRight } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary p-8 text-center">
      <div className="mb-8">
        <Blocks className="h-24 w-24 mx-auto text-primary" />
      </div>
      <h1 className="text-5xl font-bold text-foreground mb-6">
        Welcome to {APP_NAME}
      </h1>
      <p className="text-xl text-muted-foreground mb-10 max-w-2xl">
        Your smart DevOps task manager, designed to streamline workflows and boost productivity with AI-powered insights.
      </p>
      <div className="space-x-4">
        <Button asChild size="lg" className="shadow-lg hover:shadow-xl transition-shadow">
          <Link href="/board">
            Go to Task Board <MoveRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
        <Button variant="outline" size="lg" className="shadow-lg hover:shadow-xl transition-shadow">
          Learn More
        </Button>
      </div>
      <footer className="absolute bottom-8 text-muted-foreground text-sm">
        © {new Date().getFullYear()} {APP_NAME}. Built with Next.js and Firebase.
      </footer>
    </div>
  );
}
