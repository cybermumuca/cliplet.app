"use client";

import { ListOrdered } from "lucide-react";
import { useState } from "react";
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
import { useSortStore, type SortValue } from "@/store/sort-store";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface SortOption {
  label: string;
  value: SortValue;
}

const sortOptions: SortOption[] = [
  { label: "Mais recente", value: "newest" },
  { label: "Mais antigo", value: "oldest" },
];

export function SortButton() {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const { currentSort, setSort } = useSortStore();

  const handleSortChange = (value: SortValue) => {
    setSort(value);
    setIsOpen(false);
  };

  const SortContent = () => (
    <div className="p-4 space-y-4">
      <h3 className="font-semibold hidden sm:flex">Ordenar por</h3>
      <RadioGroup
        value={currentSort}
        onValueChange={handleSortChange}
      >
        {sortOptions.map((option) => (
          <div key={option.value} className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
            <RadioGroupItem value={option.value} id={option.value} />
            <Label
              htmlFor={option.value}
              className="flex-1 cursor-pointer"
            >
              <div className="font-medium">{option.label}</div>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline" size="icon">
            <ListOrdered className="h-4 w-4" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Opções de ordenação</DrawerTitle>
            <DrawerDescription>Selecione uma opção de ordenação.</DrawerDescription>
          </DrawerHeader>
          <SortContent />
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
        <Button variant="outline" size="icon">
          <ListOrdered className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Opções de ordenação</SheetTitle>
          <SheetDescription>
            Selecione uma opção de ordenação.
          </SheetDescription>
        </SheetHeader>
        <SortContent />
      </SheetContent>
    </Sheet>
  );
}