/* REACT */
import React, { useState, useEffect, useRef } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Header, Modal, Select, Input, List } from 'semantic-ui-react';
import { Portal } from 'react-portal';
import _uniqueId from 'lodash/uniqueId';
import axios from 'axios';
import Highlighter from 'react-highlight-words';
import { Icon } from '@plone/volto/components';
import { DiscodataSqlBuilderView } from '@eeacms/volto-datablocks/components';
import { setQueryParam, deleteQueryParam } from '@eeacms/volto-datablocks/actions';
import config from '@plone/volto/registry';
import { getEncodedQueryString } from '~/utils';

import menuSVG from '@plone/volto/icons/menu-alt.svg';
import circlePlus from '@plone/volto/icons/circle-plus.svg';
import circleMinus from '@plone/volto/icons/circle-minus.svg';
import clear from '@plone/volto/icons/clear.svg';
import './style.css';

const makeUrl = (providerUrl, url) => {
  return encodeURI(providerUrl + `?query=${url}`);
};

const keyCodes = {
  ENTER: 13,
  ARROW_UP: 38,
  ARROW_DOWN: 40,
};

const View = ({ content, ...props }) => {
  const providerUrl = config.settings.providerUrl;
  const [state, setState] = useState({
    id: _uniqueId('block_'),
    open: false,
    filters: {},
    filtersMeta: {},
    filtersMetaOrder: [
      'industries',
      'countries',
      'regions',
      'provinces',
      'river_basins',
      'pollutant_groups',
      'pollutants',
      'reporting_years',
      'plant_types',
      'bat_conclusions',
      'permit_types',
      'permit_years',
    ],
    factsDataOrder: ['Country_quick_facts', 'EU_quick_facts'],
    firstLoad: false,
  });
  const [filtersMetaReady, setFiltersMetaReady] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [sitesResults, setSitesResults] = useState([]);
  const [searchResultsIndex, setSearchResultsIndex] = useState(0);
  const [searchResultsActive, setSearchResultsActive] = useState(false);
  const [locationResults, setLocationResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [triggerSearch, setTriggerSearch] = useState(false);
  const [sidebar, setSidebar] = useState(false);
  const [mountState, setMountState] = useState(false);
  const [clock, setClock] = useState(0);
  const searchContainerModal = useRef(null);
  const searchContainer = useRef(null);
  const mounted = useRef(false);
  const modalButtonTitle = props.data.modalButtonTitle?.value;
  const locationResultsTexts = locationResults.map((result) => result.text);
  const mapSidebarExists = document?.getElementById('map-sidebar');

  const searchResults = [
    ...locationResults.map((result) => result.text),
    ...sitesResults,
  ];

  const eprtrCountries =
    props.discodata_resources?.filters_eprtr_countries?.[0]?.['countries'];

  useEffect(function () {
    mounted.current = true;
    setMountState(true);
    document.addEventListener('mousedown', handleClickOutside, false);
    return () => {
      mounted.current = false;
      setMountState(false);
      document.removeEventListener('mousedown', handleClickOutside, false);
    };
    /* eslint-disable-next-line */
  }, []);

  useEffect(() => {
    if (mounted.current && triggerSearch) {
      submit(false, true);
      setTriggerSearch(false);
    }
    /* eslint-disable-next-line */
  }, [searchTerm, triggerSearch]);

  useEffect(() => {
    if (mounted.current && state.open && searchResultsActive) {
      setSearchResultsActive(false);
    }
    /* eslint-disable-next-line */
  }, [state.open]);

  useEffect(() => {
    if (mounted.current) {
      updateFilters();
      if (Object.keys(state.filtersMeta).length && !filtersMetaReady) {
        setFiltersMetaReady(true);
      }
    }
    /* eslint-disable-next-line */
  }, [JSON.stringify(state.filtersMeta)]);

  useEffect(() => {
    if (
      mounted.current &&
      typeof initialization === 'function' &&
      filtersMetaReady &&
      state.filtersMeta
    ) {
      initialization();
    }
    /* eslint-disable-next-line */
  }, [filtersMetaReady]);

  useEffect(() => {
    if (mounted.current && __CLIENT__) {
      let promises = [];
      let metadata = [];
      const siteCountryFilters =
        state.filters.siteCountry &&
        state.filters.siteCountry.filter((country) => country);
      const regionFilters =
        state.filters.region && state.filters.region.filter((region) => region);
      const pollutantGroupFilter =
        state.filters.pollutantGroup &&
        state.filters.pollutantGroup.filter((pollutant) => pollutant);
      const onMountRequests = {
        sqls: [
          // INDUSTRIES QUERY
          `SELECT DISTINCT EEAActivity
          FROM [IED].[latest].[EPRTR_sectors]
          ORDER BY EEAActivity`,
          // COUNTRIES QUERY
          `SELECT DISTINCT siteCountry, siteCountryName
        FROM [IED].[latest].[Browse2_MapPOPUP]
        ORDER BY siteCountryName`,
          // POLLUTANT GROUPS QUERY
          `SELECT DISTINCT pollutantgroup
        FROM [IED].[latest].[Browse2_MapPOPUP]
        WHERE NOT(pollutantgroup='')
        ORDER BY pollutantgroup`,
          // REPORTING YEARS QUERY
          `SELECT DISTINCT reportingYear FROM [IED].[latest].[ReportData] ORDER BY reportingYear`,
          // PLANT TYPE
          `SELECT code, Label FROM [IED].[latest].[PlantTypeValue] ORDER BY Label`,
          // BAT CONCLUSSIONS QUERY
          `SELECT DISTINCT id, Label, AcceptedDate FROM [IED].[latest].[BATConclusionValue] ORDER BY Label`,
          // PERMIT YEAR
          `SELECT DISTINCT permitYear
        FROM [IED].[latest].[PermitDetails]
        GROUP BY permitYear`,
        ],
        meta: [
          // INDUSTRIES META
          {
            key: 'industries',
            title: 'Industries',
            queryToSet: 'EEAActivity',
            firstInput: {
              id: _uniqueId('select_'),
              type: 'select',
              position: 0,
            },
            placeholder: 'Select industry',
            optionKey: 'EEAActivity',
            optionValue: 'EEAActivity',
            optionText: 'EEAActivity',
            static: true,
          },
          // COUNTRIES META
          {
            key: 'countries',
            title: 'Geographical specifics',
            queryToSet: 'siteCountry',
            firstInput: {
              id: _uniqueId('select_'),
              type: 'select',
              position: 0,
            },
            placeholder: 'Select country name',
            optionKey: 'siteCountry',
            optionValue: 'siteCountry',
            optionText: 'siteCountryName',
            static: true,
          },
          // POLLUTANT GROUPS META
          {
            key: 'pollutant_groups',
            title: 'Pollutants',
            queryToSet: 'pollutantGroup',
            firstInput: {
              id: _uniqueId('select_'),
              type: 'select',
              position: 0,
            },
            placeholder: 'Select pollutant group',
            optionKey: 'pollutantgroup',
            optionValue: 'pollutantgroup',
            optionText: 'pollutantgroup',
            static: true,
          },
          // REPORTING YEAR META
          {
            key: 'reporting_years',
            title: 'Reporting year',
            queryToSet: 'reportingYear',
            firstInput: {
              id: _uniqueId('select_'),
              type: 'select',
              position: 0,
            },
            placeholder: 'Select reporting year',
            optionKey: 'reportingYear',
            optionValue: 'reportingYear',
            optionText: 'reportingYear',
            static: true,
          },
          // PLANT TYPE META
          {
            key: 'plant_types',
            title: 'Combustion plant type',
            queryToSet: 'plantTypes',
            firstInput: {
              id: _uniqueId('select_'),
              type: 'select',
              position: 0,
            },
            placeholder: 'Select plant type',
            optionKey: 'code',
            optionValue: 'code',
            optionText: 'Label',
            static: true,
          },
          // BAT CONCLUSSIONS QUERY
          {
            key: 'bat_conclusions',
            title: 'BAT Conclusions',
            queryToSet: 'batConclusionCode',
            firstInput: {
              id: _uniqueId('select_'),
              type: 'select',
              position: 0,
            },
            placeholder: 'Select BAT conclusion',
            optionKey: 'id',
            optionValue: 'id',
            optionText: 'Label',
            static: true,
          },
          //  PERMIT YEAR
          {
            key: 'permit_years',
            queryToSet: 'permitYear',
            firstInput: {
              id: _uniqueId('select_'),
              type: 'select',
              position: 0,
            },
            placeholder: 'Select permit year',
            optionKey: 'permitYear',
            optionValue: 'permitYear',
            optionText: 'permitYear',
            static: true,
          },
        ],
      };
      const dynamicRequests = {
        sqls: [
          // REGION QUERY
          siteCountryFilters &&
            siteCountryFilters.length > 0 &&
            `SELECT DISTINCT NUTS_ID, NUTS_NAME
          FROM [IED].[latest].[refNuts_NoGeo]
          WHERE CNTR_CODE IN (${siteCountryFilters.map((country) => {
            return "'" + country + "'";
          })}) AND LEVL_CODE = 1
          ORDER BY NUTS_NAME`,
          // PROVINCES QUERY
          siteCountryFilters &&
            regionFilters &&
            siteCountryFilters.length > 0 &&
            regionFilters.length &&
            `SELECT DISTINCT NUTS_ID, NUTS_NAME
          FROM [IED].[latest].[refNuts_NoGeo]
          WHERE CNTR_CODE IN (${siteCountryFilters.map((country) => {
            return "'" + country + "'";
          })}) AND (${regionFilters
              .map((region, index) => {
                return (!index ? '' : 'OR ') + "NUTS_ID LIKE '" + region + "%'";
              })
              .join(' ')}) AND LEVL_CODE = 2
          ORDER BY NUTS_NAME`,
          // RIVER BASIN DISTRICT QUERY
          siteCountryFilters &&
            siteCountryFilters.length > 0 &&
            `SELECT DISTINCT thematicIdIdentifier, nameText
            FROM [IED].[latest].[refRBD_NoGeo]
            WHERE countryCode IN (${siteCountryFilters.map((country) => {
              return "'" + country + "'";
            })})
          ORDER BY nameText`,
          // POLLUTANTS QUERY
          pollutantGroupFilter &&
            pollutantGroupFilter.length > 0 &&
            `SELECT DISTINCT pollutant
          FROM [IED].[latest].[PollutantDict]
          WHERE AirPollutantGroup ${pollutantGroupFilter
            .map((group, index) => {
              return (
                (!index ? "LIKE '%" : "OR AirPollutantGroup LIKE '%") +
                group +
                "%'"
              );
            })
            .join(' ')} OR WaterPollutantGroup ${pollutantGroupFilter
              .map((group, index) => {
                return (
                  (!index ? "LIKE '%" : "OR WaterPollutantGroup LIKE '%") +
                  group +
                  "%'"
                );
              })
              .join(' ')}
          ORDER BY pollutant`,
        ],
        meta: [
          // REGION META
          siteCountryFilters &&
            siteCountryFilters.length > 0 && {
              key: 'regions',
              title: null,
              queryToSet: 'region',
              firstInput: {
                id: _uniqueId('select_'),
                type: 'select',
                position: 0,
              },
              placeholder: 'Select NUTS 1',
              optionKey: 'NUTS_ID',
              optionValue: 'NUTS_ID',
              optionText: 'NUTS_NAME',
            },
          // PROVINCES META
          siteCountryFilters &&
            regionFilters &&
            siteCountryFilters.length > 0 &&
            regionFilters.length && {
              key: 'provinces',
              title: null,
              queryToSet: 'province',
              firstInput: {
                id: _uniqueId('select_'),
                type: 'select',
                position: 0,
              },
              placeholder: 'Select NUTS 2',
              optionKey: 'NUTS_ID',
              optionValue: 'NUTS_ID',
              optionText: 'NUTS_NAME',
            },
          // RIVER BASIN DISTRICT META
          siteCountryFilters &&
            siteCountryFilters.length > 0 && {
              key: 'river_basins',
              title: null,
              queryToSet: 'riverBasin',
              firstInput: {
                id: _uniqueId('select_'),
                type: 'select',
                position: 0,
              },
              placeholder: 'Select river basin district',
              optionKey: 'thematicIdIdentifier',
              optionValue: 'thematicIdIdentifier',
              optionText: 'nameText',
            },
          // POLLUTANTS META
          pollutantGroupFilter &&
            pollutantGroupFilter.length > 0 && {
              key: 'pollutants',
              title: null,
              queryToSet: 'pollutant',
              firstInput: {
                id: _uniqueId('select_'),
                type: 'select',
                position: 0,
              },
              placeholder: 'Select pollutant',
              optionKey: 'pollutant',
              optionValue: 'pollutant',
              optionText: 'pollutant',
            },
        ],
      };
      if (!loadingData) {
        onMountRequests.sqls.forEach((sql, index) => {
          if (sql && onMountRequests.meta[index]) {
            if (!state.firstLoad) {
              promises.push(axios.get(makeUrl(providerUrl, sql)));
              metadata.push(onMountRequests.meta[index]);
            }
          }
        });
        dynamicRequests.sqls.forEach((sql, index) => {
          if (sql && dynamicRequests.meta[index]) {
            promises.push(axios.get(makeUrl(providerUrl, sql)));
            metadata.push(dynamicRequests.meta[index]);
          }
        });
      }

      if (!promises?.length) return;
      setLoadingData(true);
      Promise.all(promises)
        .then((response) => {
          if (mounted.current) {
            const filtersMeta = {
              ...state.filtersMeta,
            };
            const newQueryParams = {
              advancedFiltering: true,
              filtersCounter: props.discodata_query.search['filtersCounter']
                ? props.discodata_query.search['filtersCounter'] + 1
                : 1,
            };
            Object.entries(filtersMeta).forEach(([key, meta]) => {
              if (!meta.static) {
                delete filtersMeta[key];
              }
            });
            response.forEach((res, index) => {
              const results = JSON.parse(res.request.response).results;
              let filteringInputs = [];
              if (state.filtersMeta[metadata[index]?.key]?.filteringInputs) {
                filteringInputs = [
                  ...state.filtersMeta[metadata[index].key].filteringInputs,
                ];
              }
              if (metadata[index]?.key === 'permit_years') {
                filtersMeta['permit_types'] = {
                  filteringInputs: [
                    {
                      id: _uniqueId('select_'),
                      type: 'select',
                      position: 0,
                    },
                  ],
                  placeholder: 'Select permit type',
                  queryToSet: 'permitType',
                  title: 'Permit',
                  static: true,
                  options: [
                    { key: null, value: null, text: 'No value' },
                    {
                      key: 'permitGranted',
                      value: 'permitGranted',
                      text: 'Permit granted',
                    },
                    {
                      key: 'permitReconsidered',
                      value: 'permitReconsidered',
                      text: 'Permit reconsidered',
                    },
                    {
                      key: 'permitUpdated',
                      value: 'permitUpdated',
                      text: 'Permit updated',
                    },
                  ],
                };
              }
              const queries =
                props.discodata_query.search[metadata[index].queryToSet] || [];
              let filteringInptsByQuery = [metadata[index]?.firstInput];
              if (Array.isArray(queries) && queries.length > 1) {
                filteringInptsByQuery = queries.map((query, index) => ({
                  id: _uniqueId('select_'),
                  type: 'select',
                  position: index,
                }));
              }
              filtersMeta[metadata[index]?.key] = {
                filteringInputs: filteringInputs.length
                  ? filteringInputs
                  : filteringInptsByQuery,
                placeholder: metadata[index]?.placeholder,
                queryToSet: metadata[index]?.queryToSet,
                title: metadata[index]?.title,
                static: metadata[index]?.static,
                options: [
                  { key: null, value: null, text: 'No value' },
                  ...(results
                    .filter((item) => item[metadata[index]?.optionValue])
                    .map((item) => {
                      return {
                        key: item[metadata[index]?.optionKey],
                        value: item[metadata[index]?.optionValue],
                        text: item[metadata[index]?.optionText],
                      };
                    }) || []),
                ],
              };
              if (
                metadata[index]?.key === 'reporting_years' &&
                !props.discodata_query.search.reportingYear?.length
              ) {
                const reportingYears =
                  res.data?.results
                    ?.map((item) => item.reportingYear)
                    ?.sort((a, b) => b - a) || [];
                if (reportingYears.length) {
                  newQueryParams[metadata[index].queryToSet] = [
                    reportingYears[0],
                  ];
                }
              }
              if (
                metadata[index]?.key === 'countries' &&
                !props.discodata_query.search.siteCountryNames?.length
              ) {
                newQueryParams.siteCountryNames = res.data?.results || [];
              }
            });
            if (Object.keys(newQueryParams).length > 2) {
              props.setQueryParam({
                queryParam: {
                  ...(newQueryParams || {}),
                },
              });
            }

            setLoadingData(false);
            setState({
              ...state,
              filtersMeta,
              ...(state.firstLoad === false ? { firstLoad: true } : {}),
            });
          }
          return;
        })
        .catch((error) => {
          setLoadingData(false);
          setState({
            ...state,
            ...(state.firstLoad === false ? { firstLoad: true } : {}),
          });
        });
    }
    /* eslint-disable-next-line */
  }, [
    mountState,
    state.filters?.EEAActivity && JSON.stringify(state.filters.EEAActivity),
    state.filters?.siteCountry && JSON.stringify(state.filters.siteCountry),
    state.filters?.region && JSON.stringify(state.filters.region),
    state.filters?.province && JSON.stringify(state.filters.province),
    state.filters?.pollutantGroup &&
      JSON.stringify(state.filters.pollutantGroup),
  ]);

  const changeFilter = (
    data,
    filter,
    position = 0,
    triggerQueryUpdate = false,
  ) => {
    if (mounted.current) {
      const newFilters = { ...state.filters };
      if (!newFilters[filter.queryToSet]) newFilters[filter.queryToSet] = [];
      if (newFilters[filter.queryToSet]?.length >= position) {
        newFilters[filter.queryToSet][position] = data.value;
      } else if (newFilters[filter.queryToSet]?.length < position) {
        for (let i = 0; i < newFilters[filter.queryToSet].length; i++) {
          if (typeof newFilters[filter.queryToSet][i] === 'undefined')
            newFilters[filter.queryToSet][i] = null;
        }
      }
      setState({
        ...state,
        filters: { ...(newFilters || {}) },
      });
      if (triggerQueryUpdate) {
        props.setQueryParam({
          queryParam: {
            [filter.queryToSet]: newFilters[filter.queryToSet],
          },
        });
      }
    }
  };

  const changeFilterSidebar = (
    data,
    filter,
    filtersToDelete = [],
    triggerQueryUpdate = false,
  ) => {
    if (mounted.current) {
      const newFilters = { ...state.filters };
      newFilters[filter.queryToSet] = [data.value];

      filtersToDelete.forEach((filter) => {
        newFilters[filter] = [];
      });
      setState({
        ...state,
        filters: { ...(newFilters || {}) },
      });
      if (triggerQueryUpdate) {
        props.setQueryParam({
          queryParam: {
            [filter.queryToSet]: newFilters[filter.queryToSet],
          },
        });
        props.deleteQueryParam({
          queryParam: [...filtersToDelete],
        });
      }
    }
  };

  const updateFilters = () => {
    if (mounted.current && state.filters && state.filtersMeta) {
      const newFilters = { ...state.filters };
      const newFiltersKeys = Object.keys(newFilters);
      const filtersMetaEntries = Object.entries(state.filtersMeta);
      const filtersMetaKeys = filtersMetaEntries.map(([key, value]) => {
        return value.queryToSet;
      });

      newFiltersKeys
        .filter((key) => !filtersMetaKeys.includes(key))
        .forEach((key) => {
          newFilters[key] = [];
        });
      filtersMetaEntries.forEach(([key, value]) => {
        if (newFilters[value.queryToSet]) {
          const options = value.options.map((item) => item.value);
          newFilters[value.queryToSet] = newFilters[value.queryToSet].map(
            (item) => {
              if (options.includes(item)) return item;
              return null;
            },
          );
        }
      });
      if (JSON.stringify(newFilters) !== JSON.stringify(state.filters)) {
        setState({
          ...state,
          filters: newFilters,
        });
      }
    }
  };

  const initialization = () => {
    let newFilters = {};
    let newFiltersMeta = { ...state.filtersMeta };
    const dynamicFiltersQuery = [
      'region',
      'province',
      'riverBasin',
      'pollutant',
    ];
    if (state.filters && state.filtersMeta) {
      newFilters = { ...state.filters };
      const filtersMetaKeys = Object.keys(state.filtersMeta);
      const queryParamKeys = filtersMetaKeys.map((key) => {
        return state.filtersMeta[key].queryToSet;
      });
      dynamicFiltersQuery.forEach((key) => {
        if (queryParamKeys.indexOf(key) === -1) {
          queryParamKeys.push(key);
        }
      });
      queryParamKeys.forEach((key, keyIndex) => {
        if (Array.isArray(props.discodata_query.search[key])) {
          newFilters[key] = props.discodata_query.search[key];
          props.discodata_query.search[key].forEach((param, index) => {
            if (
              index > 0 &&
              newFiltersMeta[filtersMetaKeys[keyIndex]]?.filteringInputs
            ) {
              newFiltersMeta[filtersMetaKeys[keyIndex]].filteringInputs.push({
                id: _uniqueId('select_'),
                type: 'select',
                position: index,
              });
            }
          });
        }
      });
    }

    if (
      JSON.stringify(newFilters) !== JSON.stringify(state.filters) ||
      JSON.stringify(newFiltersMeta) !== JSON.stringify(state.filtersMeta)
    ) {
      setState({
        ...state,
        filters: { ...newFilters },
        filtersMeta: { ...newFiltersMeta },
      });
    }
    if (props.discodata_query.search.siteTerm) {
      setSearchTerm(props.discodata_query.search.siteTerm);
    } else if (props.discodata_query.search.locationTerm?.text) {
      setSearchTerm(props.discodata_query.search.locationTerm.text);
    }
  };

  const addNewInput = (key, type, position = 0) => {
    const newFiltersMeta = { ...state.filtersMeta };
    newFiltersMeta[key].filteringInputs.push({
      id: _uniqueId(type + '_'),
      type,
      position,
    });
    setState({
      ...state,
      filtersMeta: newFiltersMeta,
    });
  };

  const removeInput = (key, filter, position = 0) => {
    const newFiltersMeta = { ...state.filtersMeta };
    if (
      newFiltersMeta[key].filteringInputs &&
      newFiltersMeta[key].filteringInputs.length > 1
    ) {
      newFiltersMeta[key].filteringInputs.pop();
      if (
        state.filters[filter.queryToSet]?.length > 0 &&
        state.filters[filter.queryToSet][position]
      ) {
        const newfilters = { ...state.filters };
        newfilters[filter.queryToSet].pop();
        setState({ ...state, filters: newfilters });
      }
    }
    setState({
      ...state,
      filtersMeta: newFiltersMeta,
    });
  };

  const clearFilters = () => {
    const newFilters = { ...state.filters };
    const newFiltersMeta = { ...state.filtersMeta };

    Object.keys(state.filters).forEach((key) => {
      newFilters[key] = [null];
    });

    Object.keys(state.filtersMeta).forEach((key) => {
      if (
        ['regions', 'river_basins', 'provinces', 'pollutants'].includes(key)
      ) {
        delete newFiltersMeta[key];
      } else {
        newFiltersMeta[key].filteringInputs = [
          {
            id: _uniqueId('select_'),
            type: 'select',
            position: 0,
          },
        ];
      }
    });

    setState({
      ...state,
      filters: newFilters,
      filtersMeta: newFiltersMeta,
    });

    setSitesResults([]);
    setLocationResults([]);
    setSearchTerm('');
    props.setQueryParam({
      queryParam: {
        ...props.discodata_query.search,
        ...newFilters,
        nuts_regions: [],
        nuts_latest: [],
        siteTerm: null,
        locationTerm: null,
        advancedFiltering: false,
        filtersCounter: props.discodata_query.search['filtersCounter']
          ? props.discodata_query.search['filtersCounter'] + 1
          : 1,
      },
    });
  };

  function handleClickOutside(e) {
    let searchResultsActive = false;
    const searchContainerModalActive =
      searchContainerModal &&
      searchContainerModal.current &&
      searchContainerModal.current.contains(e.target);
    const searchContainerActive =
      searchContainer &&
      searchContainer.current &&
      searchContainer.current.contains(e.target);
    if (searchContainerModalActive || searchContainerActive) {
      searchResultsActive = true;
    }
    return setSearchResultsActive(searchResultsActive);
  }

  const autoComplete = (data) => {
    let promises = [];
    const sqls = [
      {
        query: `SELECT DISTINCT siteName FROM [IED].[latest].[SiteMap] WHERE [siteName] COLLATE Latin1_General_CI_AI LIKE '%${data.value}%' ORDER BY [siteName]`,
        reqKey: 'results',
        searchKey: 'siteName',
        updateState: setSitesResults,
      },
    ];
    const reqs = [
      {
        url: `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest?f=json&text=${
          data.value
        }&maxSuggestions=6${
          eprtrCountries ? `&countryCode=${eprtrCountries}` : ''
        }`,
        reqKey: 'suggestions',
        searchKeys: ['text', 'magicKey'],
        updateState: setLocationResults,
      },
    ];
    if (data.value.length > 1) {
      sqls.forEach((sql) => {
        promises.push({
          get: axios.get(
            providerUrl + `?${getEncodedQueryString(sql.query)}&p=1&nrOfHits=6`,
          ),
          metadata: sql,
        });
      });
      reqs.forEach((req) => {
        promises.push({
          get: axios.get(req.url),
          metadata: req,
        });
      });
      Promise.all(promises.map((promise) => promise.get))
        .then((response) => {
          response.forEach((res, index) => {
            const data = res.request.response
              ? JSON.parse(res.request.response) || {}
              : {};
            promises[index].metadata.updateState(
              data[promises[index].metadata.reqKey].map((result) => {
                if (promises[index].metadata.searchKey) {
                  return result[promises[index].metadata.searchKey];
                } else if (promises[index].metadata.searchKeys) {
                  const obj = {};
                  promises[index].metadata.searchKeys.forEach((key) => {
                    if (result[key]) {
                      obj[key] = result[key];
                    }
                  });
                  return obj;
                }
              }),
            );
          });
        })
        .catch((error) => {});
    } else {
      sqls.forEach((sql) => sql.updateState([]));
      reqs.forEach((req) => req.updateState([]));
      if (searchResultsIndex > 0) {
        setSearchResultsIndex(0);
      }
    }
    setSearchTerm(data.value);
  };

  const submit = (advancedFiltering = false, search = false) => {
    const searchTermType =
      sitesResults.indexOf(searchTerm) > -1
        ? 'siteTerm'
        : locationResultsTexts.indexOf(searchTerm) > -1
        ? 'locationTerm'
        : sitesResults.length >= locationResults.length
        ? 'siteTerm'
        : 'locationTerm';
    const emptyTermType =
      searchTermType === 'siteTerm' ? 'locationTerm' : 'siteTerm';
    const siteCountries = state.filters.siteCountry;
    const regions = state.filters.region;
    const provinces = state.filters.province;
    let nuts = [];
    let nuts_latest = [];
    siteCountries &&
      siteCountries.forEach((country) => {
        const filteredRegions = regions
          ? regions.filter((region) => {
              return region && region.includes(country);
            })
          : [];
        if (filteredRegions.length) {
          filteredRegions.forEach((region) => {
            const filteredProvinces = provinces
              ? provinces.filter((province) => {
                  return province && province.includes(region);
                })
              : [];
            if (filteredProvinces.length) {
              filteredProvinces.forEach((province) => {
                nuts.push(`${province},${region},${country}`);
                nuts_latest.push(province);
              });
            } else {
              nuts.push(`${region},${country}`);
              nuts_latest.push(region);
            }
          });
        }
      });
    props.setQueryParam({
      queryParam: {
        ...state.filters,
        [searchTermType]:
          searchTermType === 'locationTerm'
            ? locationResults[locationResultsTexts.indexOf(searchTerm)] || ''
            : searchTerm || '',
        [emptyTermType]: null,
        nuts_regions: nuts,
        nuts_latest,
        filtersCounter: props.discodata_query.search['filtersCounter']
          ? props.discodata_query.search['filtersCounter'] + 1
          : 1,
        extent:
          (nuts_latest.length ||
            (searchTermType === 'siteTerm' && searchTerm?.length)) &&
          searchTermType !== 'locationTerm'
            ? null
            : props.discodata_query.search['extent'],
        advancedFiltering,
        ...(!search
          ? {
              locationTerm: null,
              siteTerm: null,
            }
          : {
              EEAActivity: [null],
              siteCountry: [null],
              nuts_latest: [null],
              nuts_regions: [null],
              province: [null],
              region: [null],
              riverBasin: [null],
              pollutantGroup: [null],
              pollutant: [null],
              plantTypes: [null],
              batConclusionCode: [null],
              permitType: [null],
              permitYear: [null],
            }),
      },
    });

    const newFiltersMeta = { ...state.filtersMeta };
    const newFilters = { ...state.filters };

    if (search) {
      Object.keys(state.filtersMeta).forEach((key) => {
        if (key !== 'reporting_years') {
          newFiltersMeta[key].filteringInputs = [
            {
              id: _uniqueId('select_'),
              type: 'select',
              position: 0,
            },
          ];
        }
      });

      Object.keys(state.filters).forEach((key) => {
        if (key !== 'reportingYear') {
          newFilters[key] = [null];
        }
      });
    }

    setState({
      ...state,
      open: false,
      filters: {
        ...newFilters,
      },
      filtersMeta: {
        ...newFiltersMeta,
      },
    });

    if (!search) {
      setSearchTerm('');
    }
  };

  const getNewExtent = (searchTerm) => {
    const searchTermType =
      sitesResults.indexOf(searchTerm) > -1
        ? 'siteTerm'
        : locationResultsTexts.indexOf(searchTerm) > -1
        ? 'locationTerm'
        : sitesResults.length >= locationResults.length
        ? 'siteTerm'
        : 'locationTerm';
    const locationTerm =
      locationResults[locationResultsTexts.indexOf(searchTerm)];
    if (
      searchTermType === 'locationTerm' &&
      locationTerm?.text &&
      locationTerm?.magicKey
    ) {
      axios
        .get(
          encodeURI(
            'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine=' +
              locationTerm.text +
              '&f=json&outSR={"wkid":102100,"latestWkid":3857}&outFields=Match_addr,Addr_type,StAddr,City&magicKey=' +
              locationTerm.magicKey +
              '&maxLocations=6',
          ),
        )
        .then((response) => {
          const data = JSON.parse(response.request.response) || {};
          if (data.error) {
          } else if (data.candidates?.length > 0) {
            props.setQueryParam({
              queryParam: {
                extent: [
                  data.candidates[0].extent.xmin,
                  data.candidates[0].extent.ymin,
                  data.candidates[0].extent.xmax,
                  data.candidates[0].extent.ymax,
                ],
              },
            });
          }
        })
        .catch((error) => {});
    }
  };

  const searchView = (ref, modal = true) => (
    <div className="search-input-container">
      <div className="ref" ref={ref}>
        <Input
          aria-label="Site search"
          className="search"
          icon={
            <>
              {searchTerm?.length > 0 ? (
                <button
                  className="delete-icon"
                  onClick={() => {
                    setSearchResultsActive(false);
                    setSearchTerm('');
                    setTriggerSearch(!modal);
                  }}
                >
                  <i aria-hidden className="delete icon" />
                </button>
              ) : (
                ''
              )}

              <button className="search-icon">
                <i
                  aria-hidden
                  className="search icon"
                  onClick={() => {
                    setSearchResultsActive(false);
                    setTriggerSearch(!modal);
                  }}
                />
              </button>
            </>
          }
          placeholder="Search for country, region, city or a site name"
          value={searchTerm}
          onChange={(event, data) => {
            autoComplete(data);
          }}
          onKeyDown={(event) => {
            if (event.keyCode === keyCodes.ENTER) {
              setSearchResultsActive(false);
              setSearchTerm(searchResults[searchResultsIndex]);
              getNewExtent(searchResults[searchResultsIndex]);
              setTriggerSearch(!modal);
            } else if (event.keyCode === keyCodes.ARROW_DOWN) {
              const index =
                searchResultsIndex + 1 < searchResults.length
                  ? searchResultsIndex + 1
                  : 0;
              setSearchResultsIndex(index);
              setSearchTerm(searchResults[index]);
              getNewExtent(searchResults[index]);
              setTriggerSearch(!modal);
            } else if (event.keyCode === keyCodes.ARROW_UP) {
              const index =
                searchResultsIndex > 0
                  ? searchResultsIndex - 1
                  : searchResults.length - 1;
              setSearchResultsIndex(index);
              setSearchTerm(searchResults[index]);
              getNewExtent(searchResults[index]);
              setTriggerSearch(!modal);
            } else {
              setSearchResultsActive(true);
            }
          }}
        />
        {searchResultsActive && searchResults.length ? (
          <div className="search-results">
            <List>
              {searchResults.map((result, index) => {
                return (
                  <List.Item
                    key={`search-result-${index}`}
                    className={searchResultsIndex === index ? 'selected' : ''}
                    onClick={() => {
                      setSearchResultsIndex(index);
                      setSearchResultsActive(false);
                      setSearchTerm(result);
                      getNewExtent(result);
                      setTriggerSearch(!modal);
                    }}
                  >
                    <Highlighter
                      className="suggestion-term"
                      highlightClassName="highlight"
                      searchWords={searchTerm?.split(' ') || []}
                      autoEscape={true}
                      textToHighlight={result}
                    />
                    {sitesResults.indexOf(result) > -1 ? (
                      <span className="info">site</span>
                    ) : (
                      ''
                    )}
                    {sitesResults.indexOf(result) === -1 &&
                    locationResultsTexts.indexOf(result) > -1 ? (
                      <span className="info">location</span>
                    ) : (
                      ''
                    )}
                  </List.Item>
                );
              })}
            </List>
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  );

  if (!__CLIENT__) return '';
  return (
    <div className="filters-container">
      <DiscodataSqlBuilderView
        data={{
          '@type': 'discodata_sql_builder',
          sql: {
            value:
              '{"fieldsets":[{"id":"sql_metadata","title":"SQL","fields":["filters_eprtr_countries"]}],"properties":{"filters_eprtr_countries":{"title":"filters EPRTR Countries","isCollection":true,"hasPagination":false,"urlQuery":true,"sql":"SELECT (STUFF((\\n    SELECT CONCAT(\',\', countryCode)\\n    FROM [IED].[latest].[SiteMap]\\n    GROUP BY countryCode\\n    FOR XML PATH(\'\')\\n    ), 1, 1, \'\')\\n) AS countries"}}}',
          },
        }}
      />
      {searchView(searchContainer, false)}
      <div className="flex space-between buttons-container">
        <Modal
          className="filters-block"
          onClose={() => setState({ ...state, open: false })}
          onOpen={() => setState({ ...state, open: true })}
          open={state.open}
          trigger={
            <button
              id="modal-show-button"
              aria-label="Show modal button"
              className="outline red ml-0-super mr-0-super"
            >
              {modalButtonTitle ? modalButtonTitle : 'Show modal'}
            </button>
          }
        >
          <Modal.Header>
            {/* eslint-disable-next-line */}
            Advanced search and filter
            <Icon
              className="add-button"
              onClick={() => setState({ ...state, open: false })}
              color="red"
              name={clear}
              size="1em"
            />
          </Modal.Header>
          <Modal.Content>
            {/* <Header>Search terms</Header> */}
            {/* {searchView(searchContainerModal)} */}
            {state.filtersMeta &&
              state.filtersMetaOrder &&
              state.filtersMetaOrder.map((filterKey) => {
                return (
                  <div key={filterKey} className="filter-container">
                    {state.filtersMeta[filterKey]?.title ? (
                      <Header>{state.filtersMeta[filterKey].title}</Header>
                    ) : (
                      ''
                    )}
                    {state.filtersMeta[filterKey]?.filteringInputs?.length &&
                      state.filtersMeta[filterKey].filteringInputs.map(
                        (input, index) => {
                          if (input.type === 'select') {
                            const options = state.filtersMeta[
                              filterKey
                            ].options.filter((option) => {
                              if (
                                typeof state.filters[
                                  state.filtersMeta[filterKey].queryToSet
                                ]?.filter === 'function' &&
                                !state.filters[
                                  state.filtersMeta[filterKey].queryToSet
                                ]
                                  .filter(
                                    (item, itemIndex) => index !== itemIndex,
                                  )
                                  .includes(option.value)
                              ) {
                                return true;
                              } else if (
                                state.filters[
                                  state.filtersMeta[filterKey].queryToSet
                                ] &&
                                state.filters[
                                  state.filtersMeta[filterKey].queryToSet
                                ].includes(option.value)
                              ) {
                                return false;
                              }
                              return true;
                            });
                            const value =
                              state.filters?.[
                                state.filtersMeta[filterKey].queryToSet
                              ]?.[index];

                            return (
                              <div key={input.id} className="input-container">
                                <Select
                                  id={`${filterKey}_${index}`}
                                  key={input.id}
                                  search
                                  onChange={(event, data) =>
                                    changeFilter(
                                      data,
                                      state.filtersMeta[filterKey],
                                      input.position,
                                    )
                                  }
                                  placeholder={
                                    state.filtersMeta[filterKey].placeholder
                                  }
                                  options={options}
                                  value={value}
                                />
                                {state.filtersMeta[filterKey].filteringInputs
                                  .length -
                                  1 ===
                                index ? (
                                  <div className="actions-container">
                                    {index + 2 <
                                    state.filtersMeta[filterKey].options
                                      .length ? (
                                      <Icon
                                        className="add-button"
                                        onClick={() =>
                                          addNewInput(
                                            filterKey,
                                            'select',
                                            index + 1,
                                          )
                                        }
                                        color="red"
                                        name={circlePlus}
                                        size="2em"
                                      />
                                    ) : (
                                      ''
                                    )}
                                    {state.filtersMeta[filterKey]
                                      .filteringInputs.length > 1 ? (
                                      <Icon
                                        className="remove-button"
                                        onClick={() =>
                                          removeInput(
                                            filterKey,
                                            state.filtersMeta[filterKey],
                                            index,
                                          )
                                        }
                                        color="red"
                                        name={circleMinus}
                                        size="2em"
                                      />
                                    ) : (
                                      ''
                                    )}
                                  </div>
                                ) : (
                                  ''
                                )}
                              </div>
                            );
                          }
                          return '';
                        },
                      )}
                  </div>
                );
              })}
          </Modal.Content>
          <Modal.Actions>
            <button
              id="modal-clear-button"
              aria-label="Clear button"
              className="outline red ma-1"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
            <button
              id="modal-search-button"
              aria-label="Search and filter button"
              className="outline dark-blue ma-1"
              onClick={() => {
                submit(true);
              }}
            >
              Search and Filter
            </button>
          </Modal.Actions>
        </Modal>
      </div>
      <Portal node={document.getElementById('map-sidebar-button')}>
        <div id="dynamic-filter-toggle" className="ol-unselectable ol-control">
          <button
            aria-label="Toggle button"
            className="toggle-button"
            onClick={() => {
              setSidebar(!sidebar);
            }}
          >
            <Icon name={menuSVG} size="1em" fill="white" />
          </button>
        </div>
      </Portal>
      {mapSidebarExists
        ? (function () {
            // Trick to rerender the component after dynamic-filter applies
            if (!clock) {
              setClock(1);
              setTimeout(() => {
                if (clock < 2) {
                  setClock(2);
                }
              }, 1000);
            }
            return (
              <Portal node={document.getElementById('map-sidebar')}>
                <div
                  id="dynamic-filter"
                  className={sidebar ? 'show filters-block' : 'filters-block'}
                >
                  <div className="dynamic-filter-header">
                    <Header as="h2">Dynamic filter</Header>
                  </div>
                  <div className="dynamic-filter-body">
                    <Header as="h3">Reporting year</Header>
                    <div className="input-container">
                      <form autoComplete="reporting-year">
                        <Select
                          search
                          onChange={(event, data) => {
                            changeFilterSidebar(
                              data,
                              state.filtersMeta['reporting_years'],
                              [],
                              true,
                            );
                            props.setQueryParam({
                              queryParam: {
                                locationTerm: null,
                                siteTerm: null,
                                advancedFiltering: true,
                                filtersCounter: props.discodata_query.search[
                                  'filtersCounter'
                                ]
                                  ? props.discodata_query.search[
                                      'filtersCounter'
                                    ] + 1
                                  : 1,
                              },
                            });
                            setSearchTerm('');
                          }}
                          placeholder={
                            state.filtersMeta['reporting_years']?.placeholder
                          }
                          options={
                            state.filtersMeta['reporting_years']?.options || []
                          }
                          value={state.filters['reportingYear']?.[0]}
                        />
                      </form>
                    </div>
                    <Header as="h3">Country</Header>
                    <div className="input-container">
                      <form autoComplete="country">
                        <Select
                          search
                          selection
                          onChange={(event, data) => {
                            changeFilterSidebar(
                              data,
                              state.filtersMeta['countries'],
                              [
                                'nuts_latest',
                                'nuts_regions',
                                'province',
                                'region',
                                'riverBasin',
                              ],
                              true,
                            );
                            props.setQueryParam({
                              queryParam: {
                                locationTerm: null,
                                siteTerm: null,
                                advancedFiltering: true,
                                filtersCounter: props.discodata_query.search[
                                  'filtersCounter'
                                ]
                                  ? props.discodata_query.search[
                                      'filtersCounter'
                                    ] + 1
                                  : 1,
                              },
                            });
                            setSearchTerm('');
                          }}
                          placeholder={
                            state.filtersMeta['countries']?.placeholder
                          }
                          options={
                            state.filtersMeta['countries']?.options || []
                          }
                          value={state.filters['siteCountry']?.[0]}
                          autoComplete="country-name"
                        />
                      </form>
                    </div>
                    <Header as="h3">Industry</Header>
                    <div className="input-container">
                      <form autoComplete="industry">
                        <Select
                          search
                          onChange={(event, data) => {
                            changeFilterSidebar(
                              data,
                              state.filtersMeta['industries'],
                              [],
                              true,
                            );
                            props.setQueryParam({
                              queryParam: {
                                locationTerm: null,
                                siteTerm: null,
                                advancedFiltering: true,
                                filtersCounter: props.discodata_query.search[
                                  'filtersCounter'
                                ]
                                  ? props.discodata_query.search[
                                      'filtersCounter'
                                    ] + 1
                                  : 1,
                              },
                            });
                            setSearchTerm('');
                          }}
                          placeholder={
                            state.filtersMeta['industries']?.placeholder
                          }
                          options={
                            state.filtersMeta['industries']?.options || []
                          }
                          value={state.filters['EEAActivity']?.[0]}
                        />
                      </form>
                    </div>
                  </div>
                  <div className="dynamic-filter-actions">
                    <button
                      aria-label="Clear filters button"
                      className="outline red"
                      onClick={clearFilters}
                      style={{ margin: 0 }}
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </Portal>
            );
          })()
        : (function () {
            if (clock) {
              setClock(0);
            }
            return '';
          })()}
    </div>
  );
};

export default compose(
  connect(
    (state, props) => ({
      location: state.router.location,
      content:
        state.prefetch?.[state.router.location.pathname] || state.content.data,
      discodata_query: state.discodata_query,
      discodata_resources: state.discodata_resources.data,
    }),
    {
      setQueryParam,
      deleteQueryParam,
    },
  ),
)(View);
