"use client";

import { ListFilter, FileText, Image, File, Clipboard as ClipboardIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
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
import { useFilterStore, type FilterValue } from "@/store/filter-store";

interface FilterOption {
  label: string;
  value: FilterValue;
  icon: React.ReactNode;
}

const filterOptions: FilterOption[] = [
  { label: "Todos os itens", value: "all", icon: <File className="h-4 w-4" /> },
  { label: "Apenas texto", value: "text", icon: <ClipboardIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" /> },
  { label: "Apenas arquivos", value: "file", icon: <FileText className="h-4 w-4 text-green-600 dark:text-green-400" /> },
  { label: "Apenas imagens", value: "image", icon: <Image className="h-4 w-4 text-purple-600 dark:text-purple-400" /> },
];

export function FilterButton() {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const { currentFilter, setFilter } = useFilterStore();

  const handleFilterChange = (value: FilterValue) => {
    setFilter(value);
    setIsOpen(false);
  };

  const FilterContent = () => (
    <div className="p-4 space-y-4">
      <h3 className="font-semibold hidden sm:flex">Filtrar por tipo</h3>
      <RadioGroup
        value={currentFilter}
        onValueChange={handleFilterChange}
      >
        {filterOptions.map((option) => (
          <div key={option.value} className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
            <RadioGroupItem value={option.value} id={option.value} />
            <Label
              htmlFor={option.value}
              className="flex-1 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-md bg-muted 
                  ${option.value === "text" && "bg-blue-100 dark:bg-blue-900/20"}
                  ${option.value === "file" && "bg-green-100 dark:bg-green-900/20"}
                  ${option.value === "image" && "bg-purple-100 dark:bg-purple-900/20"}
                `}>
                  {option.icon}
                </div>
                <div className="font-medium">{option.label}</div>
              </div>
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
            <ListFilter className="h-4 w-4" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Opções de filtro</DrawerTitle>
            <DrawerDescription>Selecione uma opção de filtro.</DrawerDescription>
          </DrawerHeader>
          <FilterContent />
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
          <ListFilter className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Opções de filtro</SheetTitle>
          <SheetDescription>
            Selecione uma opção de filtro.
          </SheetDescription>
        </SheetHeader>
        <FilterContent />
      </SheetContent>
    </Sheet>
  );
}