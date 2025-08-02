import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

async function saveText(content: string) {
  const response = await fetch('/api/clips', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'text',
      content: content.trim()
    })
  });

  if (!response.ok) {
    throw new Error('Erro ao salvar texto');
  }

  return await response.json();
}

export function useTextSave() {
  return useMutation({
    mutationFn: saveText,
    onSuccess: () => {
      toast.success('Texto salvo com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao salvar texto: ${error.message}`);
    }
  });
}