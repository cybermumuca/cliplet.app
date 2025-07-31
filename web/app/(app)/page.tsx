import { Header } from "@/components/header";
import { SortButton } from "@/components/sort-button";
import { FilterButton } from "@/components/filter-button";
import { ItemPreviewList } from "@/components/item-preview-list";

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />

      <main className="flex-1 container px-8 py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight">Seus itens</h2>
            <div className="flex items-center gap-2">
              <SortButton />
              <FilterButton />
            </div>
          </div>

          <ItemPreviewList />
        </div>
      </main>
    </div>
  );
}