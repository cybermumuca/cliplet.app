import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { SettingsButton } from "./settings-button";
import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-18 items-center justify-between mx-auto px-8 sm:h-20">
        <h1 className="text-xl sm:text-3xl font-bold tracking-tight">
          <Link href="/">
            Clip<span className="text-green-500">Let</span>
          </Link>
        </h1>

        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <SettingsButton />
          <Link href="/add" passHref>
            <Button
              className="text-xs sm:text-sm px-2 sm:px-4"
            >
              <Plus className="h-6 w-6 sm:mr-2" />
              <span className="hidden sm:inline">Adicionar</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
