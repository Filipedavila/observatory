import './styles.css';

import { useContext, useEffect, useState, type FormEvent } from 'react';
import { useDirectoriesStatistics } from '@/hooks';
import { useTranslation } from 'react-i18next';
import { getDateFormat } from '@/i18n';
import { Link } from 'react-router-dom';

import { ThemeContext } from '@/context/ThemeContext';

import { StatisticsHeader, SortingTable, Breadcrumb, LoadingComponent } from 'ama-design-system';

import { searchFuntion, type SearchResultRow } from './search';
import { getDirectoriesTable } from './tableConfig';
import { SearchSection } from './_components/searchSection';

import { pathURL } from '@/App';
import type { DirectorySummary } from '@/types';
import { roundScore } from '@/util';

export default function Directories() {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext)!;
  const mainContentDirectories = theme === 'light' ? '' : 'main_content_directories';

  const {data: directoryStats, isLoading: isLoadingStats, isError: isErrorStats, error: errorStats} = useDirectoriesStatistics();

  const [search, setSearch] = useState('');
  const [otherData, setOtherData] = useState<SearchResultRow[] | null>(null);
  const [directoriesList, setDirectoriesList] = useState<DirectorySummary[]>([]);

  const { searchTableHeaders, columnsOptionsSearch, directoriesHeaders, columnsOptions, statsTitles, nameOfIcons, ariaLabels } =
    getDirectoriesTable(t);

  useEffect(() => {
    if (directoryStats?.topDirectories) {
      setDirectoriesList(directoryStats.topDirectories);
    }
  }, [directoryStats?.topDirectories]);
  const breadcrumbs = [{ children: <Link to={`${pathURL}`}>{t('HEADER.NAV.observatory')}</Link> }, { title: t('HEADER.NAV.directories') }];

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (directoryStats?.topDirectories) setOtherData(searchFuntion(search, directoryStats.topDirectories as any));
  };

  if (isLoadingStats) {
    return <LoadingComponent darkTheme={theme} loadingText={t('MISC.loading')} />;
  }

  if (isErrorStats) {
    return (
      <section className={`${mainContentDirectories} d-flex flex-column align-items-center py-5 welcome_section`}>
        <h2 className="text-center w-50">{errorStats?.message}</h2>
      </section>
    );
  }

  if (!directoryStats?.topDirectories || !directoryStats) return null;
  const headerStats = {
    score: roundScore(directoryStats?.score) ?? 0,
    oldestPage: getDateFormat(new Date(directoryStats?.oldestPageDate), { dateStyle: 'long' }) ?? '', 
    recentPage: getDateFormat(new Date(directoryStats?.recentPageDate), { dateStyle: 'long' }) ?? '', 
    statsTable: [
      directoryStats?.directoriesCount ?? 0,
      directoryStats?.entitiesCount ?? 0,
      directoryStats?.websitesCount ?? 0,
      directoryStats?.pagesCount ?? 0,
    ],
  };

  return (
    <div className="container">
      <div className="link_breadcrumb_container py-5">
        <Breadcrumb data={breadcrumbs} darkTheme={theme} tagHere={t('HEADER.NAV.youAreHere')} />
      </div>

      <div className="title_container">
        <div className="ama-typography-body-large bold observatorio px-3">{t('HEADER.NAV.observatory')}</div>
        <h1 className="bold my-2">{t('HEADER.NAV.directories')}</h1>
      </div>

      {/* Statistics Header Component */}
      <section className={`bg-white ${mainContentDirectories} d-flex flex-row justify-content-center align-items-center my-5`}>
        <StatisticsHeader
          darkTheme={theme}
          stats={headerStats}
          statsTitles={statsTitles}
          title={t('DIRECTORIES.statistics_title')}
          subtitle={t('DIRECTORIES.statistics_subtitle')}
          oldestPage={t('STATISTICS.oldest_page_updated')}
          newestPage={t('STATISTICS.newest_page_updated')}
          gaugeTitle={[t('STATISTICS.gauge.label')]}
          gaugeDescription={t('STATISTICS.gauge.description', { value: directoryStats.score })}
          buttons={false}
        />
      </section>

      {/* MAIN Directories TABLE */}
      <section className={`bg-white ${mainContentDirectories} d-flex flex-row justify-content-center align-items-center my-5`}>
        <div className="d-flex flex-column section_container py-4 m-0 directories_container">
          <h2 className="bold pb-3 m-0">{t('DIRECTORIES.table.title')}</h2>
          <SortingTable
            darkTheme={theme}
            hasSort={true}
            headers={directoriesHeaders}
            setDataList={setDirectoriesList}
            dataList={directoriesList}
            caption={t('DIRECTORIES.table.title')}
            columnsOptions={columnsOptions}
            pagination={false}
            ariaLabels={ariaLabels}
          />
        </div>
      </section>

      <SearchSection
        mainContentClass={mainContentDirectories}
        theme={theme}
        search={search}
        otherData={otherData}
        onSearchChange={setSearch}
        onSubmit={handleSubmit}
        setOtherData={setOtherData}
        searchTableHeaders={searchTableHeaders}
        columnsOptionsSearch={columnsOptionsSearch}
        nameOfIcons={nameOfIcons}
      />
    </div>
  );
}
