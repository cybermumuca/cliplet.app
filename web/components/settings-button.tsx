"use client";

import { LogOut, Settings, Trash2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";

export function SettingsButton() {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const router = useRouter();

  function handleClearAll() { }

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.replace("/auth/sign-in");
    } catch (e) {}
  }

  function SettingsContent() {
    return (
      <div className="px-4 mb-2 space-y-2">
        <div>
          <div className="space-y-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="w-full justify-start"
                  size="lg"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Limpar todos os clips
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Todos os seus clips serão permanentemente removidos.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearAll}>
                    Sim, limpar tudo
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div>
          <Button
            variant="secondary"
            className="w-full justify-start"
            size="lg"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2 text-red-500" />
            Fazer logout
          </Button>
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <Button variant="ghost" size="icon">
            <Settings className="h-6 w-6" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Configurações</DrawerTitle>
            <DrawerDescription>Gerencie as configurações do aplicativo.</DrawerDescription>
          </DrawerHeader>
          <SettingsContent />
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline" size="lg">Fechar</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Configurações</SheetTitle>
          <SheetDescription>
            Gerencie as configurações do aplicativo.
          </SheetDescription>
        </SheetHeader>
        <SettingsContent />
      </SheetContent>
    </Sheet>
  );
}