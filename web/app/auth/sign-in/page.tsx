"use client";

import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { signInWithGithub, signInWithGoogle } from "./actions";

export default function SignIn() {
  return (
    <div className="flex items-center justify-center min-h-dvh bg-background">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="flex flex-col items-center justify-center px-6 py-12 mx-4 md:mx-0 lg:px-8 border border-border rounded-lg shadow-lg bg-card">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          {/* Título */}
          <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-foreground">
            Entre na sua conta
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Escolha uma das opções abaixo para continuar
          </p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="space-y-3">
            <form action={signInWithGithub}>
              <Button
                type="submit"
                variant="outline"
                size="lg"
                className="w-full justify-center gap-3 h-12"
              >
                <Github className="h-5 w-5" />
                Continuar com GitHub
              </Button>
            </form>

            <form action={signInWithGoogle}>
              <Button
                type="submit"
                variant="outline"
                size="lg"
                className="w-full justify-center gap-3 h-12 hidden"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continuar com Google
              </Button>
            </form>
          </div>

          {/* Divisor */}
          <div className="mt-8 mb-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-card px-2 text-muted-foreground">
                  Primeira vez aqui?
                </span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Ao continuar, você concorda com nossos{" "}
              <Link href="#" className="text-primary hover:underline">
                Termos de Uso
              </Link>{" "}
              e{" "}
              <Link href="#" className="text-primary hover:underline">
                Política de Privacidade
              </Link>
              .
            </p>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
            >
              Voltar para o início
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}