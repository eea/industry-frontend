/* REACT */
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Button, Header, Image, Modal, Select, Input } from 'semantic-ui-react';
import { setQueryParam } from 'volto-datablocks/actions';
import _uniqueId from 'lodash/uniqueId';
import axios from 'axios';
import './style.css';
const View = ({ content, ...props }) => {
  const [state, setState] = useState({
    open: false,
    filters: {},
    filtersMeta: {},
  });
  const title = props.data.title?.value;

  useEffect(() => {
    const requestsMeta = [
      {
        key: 'industries',
        title: 'Industries',
        queryToSet: 'eprtrSectorName',
        firstInput: { id: _uniqueId('select_'), type: 'select', position: 0 },
        placeholder: 'Select industry',
        optionKey: 'eprtrSectorName',
        optionValue: 'eprtrSectorName',
        optionText: 'eprtrSectorName',
      },
      {
        key: 'countries',
        title: 'Countries',
        queryToSet: 'siteCountry',
        firstInput: { id: _uniqueId('select_'), type: 'select', position: 0 },
        placeholder: 'Select country code',
        optionKey: 'siteCountry',
        optionValue: 'siteCountry',
        optionText: 'siteCountryName',
      },
    ];
    let promises = [];
    promises.push(
      axios.get(
        'https://discodata.eea.europa.eu/sql?query=SELECT%20DISTINCT%20eprtrSectorName%20FROM%20%5BIED%5D.%5Blatest%5D.%5BEPRTR_sectors%5D%20ORDER%20BY%20eprtrSectorName&p=1&nrOfHits=100',
      ),
      axios.get(
        'https://discodata.eea.europa.eu/sql?query=SELECT%20DISTINCT%20siteCountry%2C%20siteCountryName%20FROM%20%5BIED%5D.%5Blatest%5D.%5Bvw_Browse2_MapPOPUP%5D%20ORDER%20BY%20siteCountryName',
      ),
    );
    Promise.all(promises)
      .then(response => {
        const filtersMeta = { ...state.filtersMeta };
        response.forEach((res, index) => {
          const results = JSON.parse(res.request.response).results;
          filtersMeta[(requestsMeta[index]?.key)] = {
            filteringInputs: [requestsMeta[index]?.firstInput],
            placeholder: requestsMeta[index]?.placeholder,
            queryToSet: requestsMeta[index]?.queryToSet,
            title: requestsMeta[index]?.title,
            options: results.map(item => {
              return {
                key: item[(requestsMeta[index]?.optionKey)],
                value: item[(requestsMeta[index]?.optionValue)],
                text: item[(requestsMeta[index]?.optionText)],
              };
            }),
          };
        });
        setState({
          ...state,
          filtersMeta,
        });
      })
      .catch(error => {});
    /* eslint-disable-next-line */
  }, [])

  const updateFilters = (data, filter, position = 0) => {
    const newFilters = { ...state.filters };
    if (!newFilters[filter.queryToSet]) newFilters[filter.queryToSet] = [];
    if (newFilters[filter.queryToSet]?.length - 1 < position) {
      for (let i = 0; i < newFilters[filter.queryToSet].length; i++) {
        if (typeof newFilters[filter.queryToSet][i] === 'undefined')
          newFilters[filter.queryToSet][i] = null;
      }
      newFilters[filter.queryToSet][position] = data.value;
    } else if (newFilters[filter.queryToSet]?.length - 1 >= position) {
      newFilters[filter.queryToSet][position] = data.value;
    }
    setState({
      ...state,
      filters: newFilters,
    });
  };

  const addNewInput = (key, type, position = 0) => {
    const newFiltersMeta = { ...state.filtersMeta };
    newFiltersMeta[key].filteringInputs.push({
      id: _uniqueId(type + '_'),
      type,
      position,
    });
    setState({
      ...state.filtersMeta,
      filtersMeta: newFiltersMeta,
    });
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
        Advanced search and filter<span onClick={() => setState({ ...state, open: false })}>X</span>
      </Modal.Header>
      <Modal.Content>
        <Header>Search terms</Header>
        <Modal.Description>
          <Input
            className="search"
            icon="search"
            placeholder="Try search for a facility name, country, city, region or ZIP code"
            iconPosition="left"
          />
        </Modal.Description>
        {state.filtersMeta &&
          Object.entries(state.filtersMeta).map(([filterKey, filterValue]) => {
            return (
              <React.Fragment key={filterKey}>
                <Header>{filterValue.title}</Header>
                {filterValue?.filteringInputs?.length &&
                  filterValue.filteringInputs.map((input, index) => {
                    if (input.type === 'select') {
                      return (
                        <>
                          <Select
                            style={{ marginRight: '1em' }}
                            key={input.id}
                            onChange={(event, data) =>
                              updateFilters(
                                data,
                                state.filtersMeta[filterKey],
                                input.position,
                              )
                            }
                            placeholder={state.filtersMeta[filterKey].placeholder}
                            options={state.filtersMeta[filterKey].options}
                          />
                          {state.filtersMeta[filterKey].filteringInputs.length -
                            1 ===
                          index ? (
                            <button
                              className="add-button"
                              onClick={() =>
                                addNewInput(filterKey, 'select', index + 1)
                              }
                            >
                              <i aria-hidden="true" class="plus icon" />
                            </button>
                          ) : (
                            ''
                          )}
                        </>
                      );
                    }
                    return '';
                  })}
              </React.Fragment>
            );
          })}
      </Modal.Content>
      <Modal.Actions>
        <Button
          content="Search and filter"
          labelPosition="center"
          onClick={() => setState({ ...state, open: false })}
          positive
        />
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
