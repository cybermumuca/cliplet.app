import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";

interface ClipErrorProps {
  clipId: string;
}

export function ClipError({ clipId }: ClipErrorProps) {
  const queryClient = useQueryClient();

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4 py-8">
      <div className="text-red-500">
        <svg className="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 18.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      <div className="text-center space-y-2">
        <h3 className="font-medium text-destructive">Erro ao carregar clip</h3>
        <p className="text-sm text-muted-foreground">
          Não foi possível carregar os dados do clip. Tente novamente.
        </p>
      </div>
      <Button
        variant="outline"
        onClick={() => queryClient.refetchQueries({ queryKey: ['clip', clipId] })}
        className="mt-4"
      >
        Tentar novamente
      </Button>
    </div>
  );
}
