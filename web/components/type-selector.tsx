import { Clipboard as ClipboardIcon, Upload as UploadIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type ItemType = "text" | "file";

interface TypeSelectorProps {
  type: ItemType;
  onTypeChange: (type: ItemType) => void;
}

export function TypeSelector({ type, onTypeChange }: TypeSelectorProps) {
  return (
    <div className="space-y-4">
      <Label className="text-base font-semibold">Tipo de clip</Label>
      <RadioGroup value={type} onValueChange={(value) => onTypeChange(value as ItemType)}>
        <div className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
          <RadioGroupItem value="text" id="text" />
          <Label htmlFor="text" className="flex-1 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-100 dark:bg-blue-900/20">
                <ClipboardIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium leading-4">Texto</h3>
                <p className="text-muted-foreground text-xs md:text-sm">
                  Colar ou digitar qualquer texto.
                </p>
              </div>
            </div>
          </Label>
        </div>

        <div className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
          <RadioGroupItem value="file" id="file" />
          <Label htmlFor="file" className="flex-1 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-purple-100 dark:bg-purple-900/20">
                <UploadIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-medium leading-4">Arquivo</h3>
                <p className="text-muted-foreground text-xs md:text-sm">
                  Colar ou fazer upload de arquivo.
                </p>
              </div>
            </div>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}