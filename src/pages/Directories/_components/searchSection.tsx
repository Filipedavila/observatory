import type { ChangeEvent, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon, Input, SortingTable, LoadingComponent, type ColumnOption, type TableHeader } from '@a12e/accessmonitor-ds';
import type { WebsiteSearchResult } from '@/types';

interface SearchSectionProps {
  mainContentClass: string;
  theme?: string;
  search: string;
  searchResults: WebsiteSearchResult[] | null;
  isLoadingSearch?: boolean;
  onSearchChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onResetSearch: () => void;
  searchTableHeaders: TableHeader[];
  columnsOptionsSearch: Record<string, ColumnOption<WebsiteSearchResult>>;
  nameOfIcons: string[];
}

export function SearchSection({
  mainContentClass,
  theme,
  search,
  searchResults,
  isLoadingSearch,
  onSearchChange,
  onSubmit,
  onResetSearch,
  searchTableHeaders,
  columnsOptionsSearch,
  nameOfIcons,
}: SearchSectionProps) {
  const { t } = useTranslation();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.trim().length === 0) {
      onResetSearch();
    }
    onSearchChange(val);
  };

  return (
    <section className={`search_container ${mainContentClass} d-flex flex-row justify-content-center align-items-center`}>
      <div className="d-flex flex-column section_container py-4">
        <h2 className="bold mb-4">{t('DIRECTORIES.search.title')}</h2>
        <form className="d-flex flex-row justify-content-between mb-4" onSubmit={onSubmit}>
          <Input
            darkTheme={theme}
            id="search"
            label={t('DIRECTORIES.search.label')}
            placeholder={t('DIRECTORIES.search.placeholder')}
            type="text"
            onChange={handleChange}
          />
          <button 
            type="submit" 
            className="search_button ms-1" 
            aria-label={t('DIRECTORIES.search.search')}
            disabled={isLoadingSearch}
          >
            <Icon name="AMA-Pesquisar-Line" />
          </button>
        </form>

        {isLoadingSearch && (
          <div className="py-4">
            <LoadingComponent darkTheme={theme} loadingText={t('MISC.loading')} />
          </div>
        )}

        {!isLoadingSearch && searchResults !== null && (
          searchResults.length > 0 ? (
            <SortingTable
              project="/observatory/"
              headers={searchTableHeaders}
              columnsOptions={columnsOptionsSearch}
              dataList={searchResults}
              darkTheme={theme}
              pagination={false}
              hasSort={true}
              caption={t('DIRECTORY.table.subtitle') + ' '}
              iconsAltTexts={nameOfIcons}
            />
          ) : (
            <div className="ama-typography-body-large">{t('DIRECTORIES.search.no_results')}</div>
          )
        )}
      </div>
    </section>
  );
}