import './styles.css';

import { useContext, useEffect, useState } from 'react';
import {  Link, Navigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { ThemeContext } from '@/context/ThemeContext';

import { StatisticsHeader, SortingTable, Breadcrumb, LoadingComponent } from '@a12e/accessmonitor-ds';

import { getDirectoryTable } from './utils';

import { pathURL } from '@/App';
import { getDateFormat } from '@/i18n';
import { useDirectoryStatistics, useDirectoryWebsites } from '@/hooks';
import type {  WebsiteRankingDetailed } from '@/types';
import { formatScore } from '@/util';

export default function Directory() {
  const { t } = useTranslation();

  const { theme } = useContext(ThemeContext)!;
  const mainContentDirectory = theme === 'light' ? '' : 'main_content_directory';
  
  
const { directoryId: directoryIdParam } = useParams<{
    directoryId: string;
  }>();

  const directoryId = Number(directoryIdParam);
 
  if (!directoryId || Number.isNaN(directoryId)) {
    return <Navigate to={pathURL} replace />;
  }
 

  const { data: directory, isLoading: loading, isError: error, error: errorDetails } = useDirectoryStatistics(directoryId);
  const {data: websiteList, isLoading: loadingWebsites, isError: errorWebsites, error: errorWebsitesDetails} = useDirectoryWebsites(directoryId);

  const [websitesListState, setWebsitesList] = useState<WebsiteRankingDetailed[]>([]);
  useEffect(() => {
    if (websiteList) setWebsitesList(websiteList);
  }, [websiteList]);

  const { directoriesHeaders, columnsOptions, statsTitles, nameOfIcons, paginationButtonsTexts, nItemsPerPageText, itemsPaginationText, ariaLabels } =
    getDirectoryTable(t, directoryId);

  const directoryName = directory?.name ?? '';
  

  const breadcrumbs = [
    { children: <Link to={`${pathURL}`}>{t('HEADER.NAV.observatory')}</Link> },
    { children: <Link to={`${pathURL}/directories`}>{t('HEADER.NAV.directories')}</Link> },
    { title: directoryName },
  ];

  if (loading || loadingWebsites) {
    return <LoadingComponent darkTheme={theme} loadingText={t('MISC.loading')} />;
  }

  if ( error || errorWebsites) {
    return (
      <section className={`${mainContentDirectory} d-flex flex-column align-items-center py-5 welcome_section`}>
        <h2 className="text-center w-50">{error || errorWebsites}</h2>
      </section>
    );
  }

  if (!directory) return null;
   const headerStats = {
    score: formatScore(directory?.score) ?? '0',
    oldestPage: getDateFormat(new Date(directory?.oldestPageDate), { dateStyle: 'long' }) ?? '', 
    recentPage: getDateFormat(new Date(directory?.recentPageDate), { dateStyle: 'long' }) ?? '', 
    statsTable: [
      directory?.entitiesCount ?? 0,
      directory?.websitesCount ?? 0,
      directory?.pagesCount ?? 0,
    ],
  };
  return (
    <div className="container">
      <div className="link_breadcrumb_container py-5">
        <Breadcrumb data={breadcrumbs} darkTheme={theme} tagHere={t('HEADER.NAV.youAreHere')} />
      </div>

      <div className="title_container">
        <div className="ama-typography-body-large bold observatorio px-3">{t('DIRECTORY.title')}</div>
        <h1 className="bold my-2">{t('DIRECTORY.subtitle') + ' ' + directoryName}</h1>
      </div>

      {/* Statistics Header Component */}
      <section className={`bg-white ${mainContentDirectory} d-flex flex-row justify-content-center align-items-center my-5`}>
        <StatisticsHeader
          darkTheme={theme}
          stats={headerStats}
          statsTitles={statsTitles}
          title={t('DIRECTORIES.statistics_title')}
          subtitle={t('DIRECTORIES.statistics_subtitle')}
          oldestPage={t('STATISTICS.oldest_page_updated')}
          newestPage={t('STATISTICS.newest_page_updated')}
          gaugeTitle={[t('STATISTICS.gauge.label')]}
          gaugeDescription={t('STATISTICS.gauge.description', { value: directory.score })}
          buttons={false}
        />
      </section>

      {/* MAIN Directory TABLE */}
      <section className={`bg-white ${mainContentDirectory} d-flex flex-row justify-content-center align-items-center my-5`}>
        <div className="d-flex flex-column section_container py-4 directory_container">
          <h2 className="bold m-0">{t('DIRECTORIES.table.title')}</h2>
          <p className="ama-typography-body mb-4">{t('DIRECTORY.table.subtitle') + ' ' + directoryName}</p>
          <SortingTable
            project="/observatory/"
            darkTheme={theme}
            hasSort={true}
            headers={directoriesHeaders}
            setDataList={setWebsitesList}
            dataList={websitesListState}
            columnsOptions={columnsOptions}
            caption={t('DIRECTORY.table.subtitle') + ' ' + directoryName}
            pagination={true}
            iconsAltTexts={nameOfIcons}
            itemsPaginationTexts={itemsPaginationText}
            nItemsPerPageTexts={nItemsPerPageText}
            paginationButtonsTexts={paginationButtonsTexts}
            ariaLabels={ariaLabels}
          />
        </div>
      </section>
    </div>
  );
}
