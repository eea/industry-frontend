/* REACT */
import React, { useState, useEffect } from 'react';
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
} from 'semantic-ui-react';
import { Icon } from '@plone/volto/components';
import { setQueryParam } from 'volto-datablocks/actions';
import { settings } from '~/config';
import _uniqueId from 'lodash/uniqueId';
import axios from 'axios';

import circlePlus from '@plone/volto/icons/circle-plus.svg';
import circleMinus from '@plone/volto/icons/circle-minus.svg';
import clear from '@plone/volto/icons/clear.svg';

import './style.css';

let nrOfRequests = 0;
const makeUrl = (providerUrl, url) => {
  return encodeURI(providerUrl + `?query=${url}`);
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
      'town_village',
      'pollutant_groups',
      'pollutants',
      'reporting_years',
      'bat_conclusions',
    ],
    mounted: false,
    firstLoad: false,
  });
  const title = props.data.title?.value;
  useEffect(() => {
    setState({ ...state, mounted: true });
    return () => {
      setState({ ...state, mounted: false });
    };
    /* eslint-disable-next-line */
  }, []);
  useEffect(() => {
    if (state.mounted) {
      let promises = [];
      let metadata = [];
      const siteCountryFilters =
        state.filters.siteCountry &&
        state.filters.siteCountry.filter(country => country);
      const regionFilters =
        state.filters.region && state.filters.region.filter(region => region);
      const pollutantGroupFilter =
        state.filters.pollutantGroup &&
        state.filters.pollutantGroup.filter(pollutant => pollutant);
      const onMountRequests = {
        sqls: [
          // INDUSTRIES QUERY
          `SELECT DISTINCT eprtrSectorName
        FROM [IED].[latest].[EPRTR_sectors]
        ORDER BY eprtrSectorName`,
          // COUNTRIES QUERY
          `SELECT DISTINCT siteCountry, siteCountryName
        FROM [IED].[latest].[vw_Browse2_MapPOPUP]
        ORDER BY siteCountryName`,
          // POLLUTANT GROUPS QUERY
          `SELECT DISTINCT pollutantgroup
        FROM [IED].[latest].[vw_Browse2_MapPOPUP]
        WHERE NOT(pollutantgroup='')
        ORDER BY pollutantgroup`,
          // REPORTING YEARS QUERY
          `SELECT DISTINCT reportingYear FROM [IED].[latest].[ReportData] ORDER BY reportingYear`,
          // BAT CONCLUSSIONS QUERY
          `SELECT DISTINCT code, Label, AcceptedDate FROM [IED].[latest].[BATConclusionValue] ORDER BY Label`,
        ],
        meta: [
          // INDUSTRIES META
          {
            key: 'industries',
            title: 'Industries',
            queryToSet: 'eprtrSectorName',
            firstInput: {
              id: _uniqueId('select_'),
              type: 'select',
              position: 0,
            },
            placeholder: 'Select industry',
            optionKey: 'eprtrSectorName',
            optionValue: 'eprtrSectorName',
            optionText: 'eprtrSectorName',
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
            optionKey: 'code',
            optionValue: 'code',
            optionText: 'Label',
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
          WHERE CNTR_CODE IN (${siteCountryFilters.map(country => {
            return "'" + country + "'";
          })}) AND LEVL_CODE = 1
          ORDER BY NUTS_NAME`,
          // TOWN/VILLAGE QUERY
          siteCountryFilters &&
            regionFilters &&
            siteCountryFilters.length > 0 &&
            regionFilters.length &&
            `SELECT DISTINCT NUTS_ID, NUTS_NAME
          FROM [IED].[latest].[refNuts_NoGeo]
          WHERE CNTR_CODE IN (${siteCountryFilters.map(country => {
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
              return (!index ? "LIKE '%" : "OR '%") + group + "%'";
            })
            .join(' ')} OR WaterPollutantGroup ${pollutantGroupFilter
              .map((group, index) => {
                return (!index ? "LIKE '%" : "OR '%") + group + "%'";
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
          // TOWN/VILLAGE META
          siteCountryFilters &&
            regionFilters &&
            siteCountryFilters.length > 0 &&
            regionFilters.length && {
              key: 'town_village',
              title: null,
              queryToSet: 'town_village',
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
      Promise.all(promises)
        .then(response => {
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
              if (state.filtersMeta[(metadata[index]?.key)]?.filteringInputs) {
                filteringInputs = [
                  ...state.filtersMeta[metadata[index].key].filteringInputs,
                ];
              }
              filtersMeta[(metadata[index]?.key)] = {
                filteringInputs: filteringInputs.length
                  ? filteringInputs
                  : [metadata[index]?.firstInput],
                placeholder: metadata[index]?.placeholder,
                queryToSet: metadata[index]?.queryToSet,
                title: metadata[index]?.title,
                static: metadata[index]?.static,
                options: [
                  { key: null, value: null, text: 'No value' },
                  ...(results.map(item => {
                    return {
                      key: item[(metadata[index]?.optionKey)],
                      value: item[(metadata[index]?.optionValue)],
                      text: item[(metadata[index]?.optionText)],
                    };
                  }) || []),
                ],
              };
            });
            setState({
              ...state,
              filtersMeta,
              ...(state.firstLoad === false ? { firstLoad: true } : {}),
            });
          }
        })
        .catch(error => {});
    }
    /* eslint-disable-next-line */
  }, [
    state.mounted,
    JSON.stringify(state.filters.eprtrSectorName),
    JSON.stringify(state.filters.siteCountry),
    JSON.stringify(state.filters.region),
    JSON.stringify(state.filters.town_village),
    JSON.stringify(state.filters.pollutantGroup),
  ]);
  // console.log('HERE', nrOfRequests);
  useEffect(() => {
    updateFilters();
    /* eslint-disable-next-line */
  }, [JSON.stringify(state.filters), JSON.stringify(state.filtersMeta)])

  const changeFilter = (data, filter, position = 0) => {
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
  };

  const updateFilters = () => {
    const newFilters = { ...state.filters };
    const newFiltersKeys = Object.keys(newFilters);
    const filtersMetaEntries = Object.entries(state.filtersMeta);
    const filtersMetaKeys = filtersMetaEntries.map(([key, value]) => {
      return value.queryToSet;
    });

    newFiltersKeys
      .filter(key => !filtersMetaKeys.includes(key))
      .forEach(key => {
        newFilters[key] = [];
      });
    filtersMetaEntries.forEach(([key, value]) => {
      if (newFilters[value.queryToSet]) {
        const options = value.options.map(item => item.value);
        newFilters[value.queryToSet] = newFilters[value.queryToSet].map(
          item => {
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
    Object.keys(newFilters).forEach(filter => {
      newFilters[filter] = newFilters[filter].map(value => null);
    });
    setState({
      ...state,
      filters: newFilters,
    });
  };

  const submit = () => {
    props.setQueryParam({
      queryParam: { ...state.filters },
    });
    setState({ ...state, open: false });
  };

  return (
    <Modal
      className="filters-block"
      onClose={() => setState({ ...state, open: false })}
      onOpen={() => setState({ ...state, open: true })}
      open={state.open}
      trigger={<Button>{title ? title : 'Show modal'}</Button>}
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
        <Header>Search terms</Header>
        <div className="search-input-container">
          <Radio label="By site name" name="searchType" value="bySiteName" />
          <Radio
            label="By facility name"
            name="searchType"
            value="byFacilityName"
          />
          <Radio label="By country" name="searchType" value="byCountry" />
          <Radio label="By region" name="searchType" value="byRegion" />
          <Radio label="By ZIP code" name="searchType" value="byZipCode" />
        </div>
        <div className="search-input-container">
          <Input
            className="search"
            icon="search"
            placeholder="Try search for a facility name, country, city, region or ZIP code"
            iconPosition="left"
          />
        </div>
        {state.filtersMeta &&
          state.filtersMetaOrder &&
          state.filtersMetaOrder.map(filterKey => {
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
                        ].options.filter(option => {
                          if (
                            state.filters[
                              state.filtersMeta[filterKey].queryToSet
                            ] &&
                            !state.filters[
                              state.filtersMeta[filterKey].queryToSet
                            ]
                              .filter((item, itemIndex) => index !== itemIndex)
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
                                <Icon
                                  className="add-button"
                                  onClick={() =>
                                    addNewInput(filterKey, 'select', index + 1)
                                  }
                                  color="red"
                                  name={circlePlus}
                                  size="2em"
                                />
                                {state.filtersMeta[filterKey].filteringInputs
                                  .length > 1 ? (
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
        <button className="solid orange" onClick={clearFilters}>
          CLEAR FILTERS
        </button>
        <button className="solid dark-blue" onClick={submit}>
          SEARCH AND FILTER
        </button>
      </Modal.Actions>
    </Modal>
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
