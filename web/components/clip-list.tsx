"use client";

import { CopyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClipPreview } from "./clip-preview";
import { useRouter } from "next/navigation";
import { useFilterStore } from "@/store/filter-store";
import { useSortStore } from "@/store/sort-store";
import { useQuery } from "@tanstack/react-query";
import { ClipItem } from "@/types/clip";

async function fetchClips(filter: string, sort: string): Promise<ClipItem[]> {
  const params = new URLSearchParams();

  if (filter) params.append("filter", filter);
  if (sort) params.append("sort", sort);

  const response = await fetch(`/api/clips?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch clips");
  }

  return await response.json();
}

export function ClipList() {
  const { currentFilter } = useFilterStore();
  const { currentSort } = useSortStore();

  const { data: clips, isLoading, error } = useQuery({
    queryKey: ['clips', currentFilter, currentSort],
    queryFn: () => fetchClips(currentFilter, currentSort),
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 5, // 5 minutos
  })

  if (isLoading) {
    return <LoadingPlaceholder />;
  }

  if (error) {
    return <ErrorPlaceholder />;
  }

  if (!clips || clips.length === 0) {
    return <NoDataPlaceholder />;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {clips.map((clip) => <ClipPreview key={clip.id} clip={clip} />)}
    </div>
  );
}

function LoadingPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
      <p className="text-muted-foreground">Carregando clips...</p>
    </div>
  );
}

function ErrorPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-destructive/10 p-6 mb-4">
        <CopyIcon className="h-8 w-8 text-destructive" />
      </div>
      <h3 className="text-lg font-medium mb-2">Erro ao carregar</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        Não foi possível carregar seus clips. Tente novamente.
      </p>
    </div>
  );
}

function NoDataPlaceholder() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-muted p-6 mb-4">
        <CopyIcon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2">Nenhum clip ainda</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        Comece adicionando textos, arquivos ou imagens para compartilhar entre seus dispositivos.
      </p>
      <Button onClick={() => router.push("/add")} className="w-full sm:w-auto">
        Adicionar clip
      </Button>
    </div>
  );
}