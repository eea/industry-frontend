/* REACT */
import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import {
  Button,
  Header,
  Image,
  Modal,
  Select,
  Input,
  Radio,
  List,
} from 'semantic-ui-react';
import { Portal } from 'react-portal';
import { Icon } from '@plone/volto/components';
import { setQueryParam } from 'volto-datablocks/actions';
import { settings } from '~/config';
import _uniqueId from 'lodash/uniqueId';
import axios from 'axios';
import Highlighter from 'react-highlight-words';

import menuSVG from '@plone/volto/icons/menu-alt.svg';
import circlePlus from '@plone/volto/icons/circle-plus.svg';
import circleMinus from '@plone/volto/icons/circle-minus.svg';
import clear from '@plone/volto/icons/clear.svg';
import './style.css';

let nrOfRequests = 0;
const makeUrl = (providerUrl, url) => {
  return encodeURI(providerUrl + `?query=${url}`);
};

const keyCodes = {
  ENTER: 13,
  ARROW_UP: 38,
  ARROW_DOWN: 40,
};

const View = ({ content, ...props }) => {
  const providerUrl = settings.providerUrl;
  const { search } = props.discodata_query;
  const [state, setState] = useState({
    open: false,
    filters: {},
    filtersMeta: {},
    filtersMetaOrder: [
      'industries',
      'countries',
      'regions',
      'river_basins',
      'town_village',
      'pollutant_groups',
      'pollutants',
      'reporting_years',
      'plant_types',
      'bat_conclusions',
      'permit_types',
      'permit_years',
    ],
    factsDataOrder: ['Country_quick_facts', 'EU_quick_facts'],
    mounted: false,
    firstLoad: false,
  });
  const [loadingData, setLoadingData] = useState(false);
  const [factsData, setFactsData] = useState({});
  const [alphaFeature, setAlphaFeature] = useState({});
  const [sitesResults, setSitesResults] = useState([]);
  const [searchResultsIndex, setSearchResultsIndex] = useState(0);
  const [searchResultsActive, setSearchResultsActive] = useState(false);
  const [locationResults, setLocationResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newSearchTerm, setNewSearchTerm] = useState('');
  const [triggerSearch, setTriggerSearch] = useState(false);
  const [quickFactsListener, setQuickFactsListener] = useState(false);
  const [sidebar, setSidebar] = useState(false);
  const alphaFeatureRef = useRef({});
  const searchContainerModal = useRef(null);
  const searchContainer = useRef(null);
  const modalButtonTitle = props.data.modalButtonTitle?.value;
  const searchButtonTitle = props.data.searchButtonTitle?.value;
  const locationResultsTexts = locationResults.map((result) => result.text);
  const mapSidebarExists = document?.getElementById('map-sidebar');

  const searchResults = [
    ...sitesResults.slice(
      0,
      locationResults.length < 3 ? 6 - locationResults.length : 3,
    ),
    ...locationResults
      .map((result) => result.text)
      .slice(0, sitesResults.length < 3 ? 6 - sitesResults.length : 3),
  ];

  const updateFactsData = (initialization = false) => {
    const promises = [];
    let reqs;
    if (initialization) {
      reqs = [
        {
          factId: 'EU_quick_facts',
          sql: `SELECT count(id) AS AllSites
          FROM [IED].[latest].[ProductionSite_NoGeo]`,
          descriptionDiscodataKey: ['AllSites'],
          title: 'EU Quick facts',
          description: [':descriptionDiscodataKey reporting sites'],
          type: 'firstElement',
        },
      ];
    } else {
      reqs = [
        alphaFeature?.getProperties?.()?.countryCode
          ? {
              factId: 'Country_quick_facts',
              sql: `SELECT DISTINCT
                  PS.countryCode,
                  LC.CountryName as countryName,
                  count(*) as sites
              FROM [IED].[latest].[ProductionSite_NoGeo] as PS
              LEFT JOIN [IED].[latest].[LOV_Countries] as LC
              ON PS.countryCode = LC.CountryCode
              WHERE PS.countryCode = '${
                alphaFeature.getProperties().countryCode
              }'
              GROUP BY PS.countryCode, LC.CountryName`,
              titleDiscodataKey: 'countryName',
              descriptionDiscodataKey: ['sites'],
              title: ':titleDiscodataKey quick facts',
              description: [':descriptionDiscodataKey reporting sites'],
              type: 'firstElement',
            }
          : null,
      ].filter((req) => req);
    }
    reqs.forEach((req) => {
      promises.push(axios.get(makeUrl(providerUrl, req.sql)));
    });

    Promise.all(promises)
      .then((response) => {
        const newFactsData = { ...factsData };
        response.forEach((res, index) => {
          const results = JSON.parse(res.request.response).results;
          if (reqs[index].type === 'firstElement') {
            const title = reqs[index].title.includes(':titleDiscodataKey')
              ? reqs[index].title.replace(
                  ':titleDiscodataKey',
                  results[0]?.[reqs[index].titleDiscodataKey],
                )
              : reqs[index].title;
            const description = reqs[index].description.map((descr, index) => {
              return descr.includes(':descriptionDiscodataKey') &&
                results[0]?.[reqs[index].descriptionDiscodataKey?.[index]]
                ? descr.replace(
                    ':descriptionDiscodataKey',
                    results[0]?.[reqs[index].descriptionDiscodataKey?.[index]],
                  )
                : descr;
            });
            newFactsData[reqs[index].factId] = {
              title,
              description,
            };
          }
        });
        setFactsData({
          ...factsData,
          ...newFactsData,
        });
      })
      .catch((error) => {});
  };

  const onFeaturechange = (e) => {
    if (
      e.detail.feature?.getProperties?.()?.countryCode !==
      alphaFeatureRef.current?.getProperties?.()?.countryCode
    ) {
      setAlphaFeature(e.detail.feature);
    }
  };

  if (!quickFactsListener && document.getElementById('dynamic-filter')) {
    setQuickFactsListener(true);
    document
      .getElementById(`dynamic-filter`)
      .addEventListener('featurechange', onFeaturechange);
  }

  useEffect(function () {
    setState({ ...state, mounted: true });
    updateFactsData(true);
    updateFilters(true);
    return () => {
      if (quickFactsListener && document.getElementById(`dynamic-filter`)) {
        document
          .getElementById(`dynamic-filter`)
          .removeEventListener('featurechange', onFeaturechange);
      }
      setState({ ...state, mounted: false });
    };
    /* eslint-disable-next-line */
  }, []);

  useEffect(() => {
    alphaFeatureRef.current = alphaFeature;
    if (state.mounted) {
      updateFactsData(false);
    }
    /* eslint-disable-next-line */
  }, [alphaFeature])

  useEffect(() => {
    if (triggerSearch) {
      submit();
      setTriggerSearch(false);
    }
    /* eslint-disable-next-line */
  }, [searchTerm, triggerSearch])

  useEffect(() => {
    if (state.open && searchResultsActive) {
      setSearchResultsActive(false);
    }
    /* eslint-disable-next-line */
  }, [state.open]);

  useEffect(() => {
    // register eventListener on each state update
    document.addEventListener('mousedown', handleClickOutside, false);
    return () => {
      // unregister eventListener
      document.removeEventListener('mousedown', handleClickOutside, false);
    };
    /* eslint-disable-next-line */
  }, [state]);

  useEffect(() => {
    if (state.mounted && __CLIENT__) {
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
            placeholder: 'Select country code',
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
          // RIVER BASIN DISTRICT QUERY
          siteCountryFilters &&
            siteCountryFilters.length > 0 &&
            `SELECT DISTINCT thematicIdIdentifier, nameText
            FROM [IED].[latest].[refRBD_NoGeo]
            WHERE countryCode IN (${siteCountryFilters.map((country) => {
              return "'" + country + "'";
            })})
          ORDER BY nameText`,
          // TOWN/VILLAGE QUERY
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
                return (
                  (!index ? '' : 'OR ') + "NUTS_ID LIKE '" + region + "1%'"
                );
              })
              .join(' ')}) AND LEVL_CODE = 3
          ORDER BY NUTS_NAME`,
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
              placeholder: 'Select region',
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
          // TOWN/VILLAGE META
          siteCountryFilters &&
            regionFilters &&
            siteCountryFilters.length > 0 &&
            regionFilters.length && {
              key: 'town_village',
              title: null,
              queryToSet: 'townVillage',
              firstInput: {
                id: _uniqueId('select_'),
                type: 'select',
                position: 0,
              },
              placeholder: 'Select town/village',
              optionKey: 'NUTS_ID',
              optionValue: 'NUTS_ID',
              optionText: 'NUTS_NAME',
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
        setLoadingData(true);
      }
      Promise.all(promises)
        .then((response) => {
          if (state.mounted) {
            const filtersMeta = {
              ...state.filtersMeta,
            };
            Object.entries(filtersMeta).forEach(([key, meta]) => {
              if (!meta.static) {
                delete filtersMeta[key];
              }
            });
            response.forEach((res, index) => {
              nrOfRequests++;
              const results = JSON.parse(res.request.response).results;
              let filteringInputs = [];
              if (state.filtersMeta[metadata[index]?.key]?.filteringInputs) {
                filteringInputs = [
                  ...state.filtersMeta[metadata[index].key].filteringInputs,
                ];
              }
              if (metadata[index]?.key === 'permit_years') {
                // YEAH...FU*K TRACASA
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
              filtersMeta[metadata[index]?.key] = {
                filteringInputs: filteringInputs.length
                  ? filteringInputs
                  : [metadata[index]?.firstInput],
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
            });
            setLoadingData(false);
            setState({
              ...state,
              filtersMeta,
              ...(state.firstLoad === false ? { firstLoad: true } : {}),
            });
          }
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
    state.mounted,
    state.filters?.EEAActivity && JSON.stringify(state.filters.EEAActivity),
    state.filters?.siteCountry && JSON.stringify(state.filters.siteCountry),
    state.filters?.region && JSON.stringify(state.filters.region),
    state.filters?.townVillage && JSON.stringify(state.filters.townVillage),
    state.filters?.pollutantGroup &&
      JSON.stringify(state.filters.pollutantGroup),
  ]);
  useEffect(() => {
    updateFilters();
    /* eslint-disable-next-line */
  }, [JSON.stringify(state.filters), JSON.stringify(state.filtersMeta)])

  const changeFilter = (
    data,
    filter,
    position = 0,
    triggerQueryUpdate = false,
  ) => {
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
      filters: newFilters,
    });
    if (triggerQueryUpdate) {
      props.setQueryParam({
        queryParam: {
          [filter.queryToSet]: newFilters[filter.queryToSet],
        },
      });
    }
  };

  const updateFilters = (mounted = false) => {
    if (state.filters && state.filtersMeta) {
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
          mounted: mounted ? true : state.mounted,
        });
      }
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
    Object.keys(newFilters).forEach((filter) => {
      newFilters[filter] = newFilters[filter].map((value) => null);
    });
    setState({
      ...state,
      filters: newFilters,
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
        query: `SELECT DISTINCT site FROM [IED].[latest].[Browse3_4_infotable] WHERE [site] LIKE '%${data.value}%' ORDER BY [site]`,
        reqKey: 'results',
        searchKey: 'site',
        updateState: setSitesResults,
      },
    ];
    const reqs = [
      {
        url: `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest?f=json&text=${data.value}&maxSuggestions=6`,
        reqKey: 'suggestions',
        searchKeys: ['text', 'magicKey'],
        updateState: setLocationResults,
      },
    ];
    if (data.value.length > 1) {
      sqls.forEach((sql) => {
        promises.push({
          get: axios.get(
            providerUrl + `?query=${encodeURI(sql.query)}&p=1&nrOfHits=6`,
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

  const submit = (advancedFiltering = false) => {
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
    const townVillages = state.filters.townVillage;
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
            const filteredTowns = townVillages
              ? townVillages.filter((town) => {
                  return town && town.includes(region);
                })
              : [];
            if (filteredTowns.length) {
              filteredTowns.forEach((town) => {
                nuts.push(`${town},${region},${country}`);
                nuts_latest.push(town);
              });
            } else {
              nuts.push(`${region},${country}`);
              nuts_latest.push(region);
            }
          });
        } else {
          nuts.push(country);
          nuts_latest.push(country);
        }
      });
    props.setQueryParam({
      queryParam: {
        ...state.filters,
        [searchTermType]:
          searchTermType === 'locationTerm'
            ? locationResults[locationResultsTexts.indexOf(searchTerm)]
            : searchTerm,
        [emptyTermType]: null,
        nuts_regions: nuts,
        nuts_latest,
        filtersCounter: props.discodata_query.search['filtersCounter']
          ? props.discodata_query.search['filtersCounter'] + 1
          : 1,
        advancedFiltering,
      },
    });
    setState({ ...state, open: false });
  };

  const searchView = (ref, modal = true) => (
    <div className="search-input-container">
      <div className="ref" ref={ref}>
        <Input
          className="search"
          icon="search"
          placeholder="Try search for a site name, country, city, region or ZIP code"
          iconPosition="right"
          value={searchTerm}
          onChange={(event, data) => {
            autoComplete(data);
          }}
          onKeyDown={(event) => {
            if (event.keyCode === keyCodes.ENTER) {
              setSearchResultsActive(false);
              setSearchTerm(searchResults[searchResultsIndex]);
              setTriggerSearch(!modal);
            } else if (event.keyCode === keyCodes.ARROW_DOWN) {
              const index =
                searchResultsIndex + 1 < searchResults.length
                  ? searchResultsIndex + 1
                  : 0;
              setSearchResultsIndex(index);
              setSearchTerm(searchResults[index]);
              setTriggerSearch(!modal);
            } else if (event.keyCode === keyCodes.ARROW_UP) {
              const index =
                searchResultsIndex > 0
                  ? searchResultsIndex - 1
                  : searchResults.length - 1;
              setSearchResultsIndex(index);
              setSearchTerm(searchResults[index]);
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

  return (
    <div className="filters-container">
      {searchView(searchContainer, false)}
      <div className="flex space-between buttons-container">
        <Modal
          className="filters-block"
          onClose={() => setState({ ...state, open: false })}
          onOpen={() => setState({ ...state, open: true })}
          open={state.open}
          trigger={
            <button className="outline red ml-0-super mr-0-super">
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
                                state.filters[
                                  state.filtersMeta[filterKey].queryToSet
                                ] &&
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
            <button className="outline red ma-1" onClick={clearFilters}>
              Clear Filters
            </button>
            <button
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
            className="toggle-button"
            onClick={() => {
              setSidebar(!sidebar);
            }}
          >
            <Icon name={menuSVG} size="1em" fill="white" />
          </button>
        </div>
      </Portal>
      {mapSidebarExists ? (
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
                <Select
                  search
                  onChange={(event, data) => {
                    changeFilter(
                      data,
                      state.filtersMeta['reporting_years'],
                      0,
                      true,
                    );
                    props.setQueryParam({
                      queryParam: {
                        ...props.discodata_query.search,
                        advancedFiltering: true,
                        filtersCounter: props.discodata_query.search[
                          'filtersCounter'
                        ]
                          ? props.discodata_query.search['filtersCounter'] + 1
                          : 1,
                      },
                    });
                  }}
                  placeholder={
                    state.filtersMeta['reporting_years']?.placeholder
                  }
                  options={state.filtersMeta['reporting_years']?.options}
                  value={state.filters['reportingYear']?.[0]}
                />
              </div>
              <Header as="h3">Industry</Header>
              <div className="input-container">
                <Select
                  search
                  onChange={(event, data) => {
                    changeFilter(
                      data,
                      state.filtersMeta['industries'],
                      0,
                      true,
                    );
                    props.setQueryParam({
                      queryParam: {
                        ...props.discodata_query.search,
                        advancedFiltering: true,
                        filtersCounter: props.discodata_query.search[
                          'filtersCounter'
                        ]
                          ? props.discodata_query.search['filtersCounter'] + 1
                          : 1,
                      },
                    });
                  }}
                  placeholder={state.filtersMeta['industries']?.placeholder}
                  options={state.filtersMeta['industries']?.options}
                  value={state.filters['EEAActivity']?.[0]}
                />
              </div>
            </div>
            <div className="dynamic-filter-actions">
              <button
                className="outline red"
                onClick={clearFilters}
                style={{ margin: 0 }}
              >
                Clear Filters
              </button>
              <Header as="h3">Quick facts</Header>
              {state.factsDataOrder &&
                state.factsDataOrder.map((key) => {
                  return factsData[key] ? (
                    <React.Fragment key={key}>
                      {factsData[key]?.title && (
                        <Header as="h4">{factsData[key].title}</Header>
                      )}
                      {factsData[key]?.description &&
                        factsData[key].description.map((description, index) => {
                          return <p key={`${key}_${index}`}>{description}</p>;
                        })}
                    </React.Fragment>
                  ) : (
                    ''
                  );
                })}
            </div>
          </div>
        </Portal>
      ) : (
        ''
      )}
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
    }),
    {
      setQueryParam,
    },
  ),
)(View);
