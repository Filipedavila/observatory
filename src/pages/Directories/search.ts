import type { DirectorySummary } from '@/types';

export interface SearchResultRow {
  directoryName: string;
  directoryId: number;
  name: string;
  id: number;
  declaration: number | null;
  stamp: number | null;
  score: number;
  nPages: number;
}

/**
 * Remove acentos/diacríticos e converte para minúsculas
 */
function sanitizeText(value: string = ''): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Pesquisa diretórios pelo termo de busca e mapeia para a estrutura de SearchResultRow
 */
export function searchFunction(
  text: string,
  directories: DirectorySummary[] = []
): SearchResultRow[] {
  const trimmed = text?.trim() ?? '';

  if (!trimmed || trimmed.length <= 2 || !Array.isArray(directories)) {
    return [];
  }

  // Tokeniza e sanitiza os termos de busca ignorando múltiplos espaços
  const searchParts = sanitizeText(trimmed)
    .split(/\s+/)
    .filter(Boolean);

  if (searchParts.length === 0) {
    return [];
  }

  const searchResults: SearchResultRow[] = [];

  for (const dir of directories) {
    const dirNameSanitized = sanitizeText(dir.name);

    // Valida se todas as palavras da query existem no nome do diretório
    const matches = searchParts.every((part) => dirNameSanitized.includes(part));

    if (matches) {
      searchResults.push({
        directoryId: dir.id,
        directoryName: dir.name,
        name: dir.name,
        id: dir.id,
        declaration: dir.declarations ?? null,
        stamp: dir.stamps ?? null,
        score: dir.score,
        nPages: dir.websites ?? 0, // mapeia a contagem/websites para a linha de tabela
      });
    }
  }

  return searchResults;
}