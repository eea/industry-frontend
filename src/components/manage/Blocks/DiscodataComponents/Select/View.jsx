/* REACT */
import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { isArray } from 'lodash';
import { Dropdown } from 'semantic-ui-react';
import { setQueryParam } from 'volto-datablocks/actions';

import cx from 'classnames';

const Select = (props) => {
  const {
    options = [],
    queryParameters = [],
    search = {},
    setQueryParam = () => {},
    placeholder = '',
    className = '',
    mode = '',
  } = props;
  const [dataReady, setDataReady] = useState(false);

  if (
    !dataReady &&
    queryParameters[0]?.queryParameterToSet &&
    queryParameters[0]?.selectorOptionKey &&
    !search[queryParameters[0]?.queryParameterToSet] &&
    options.length
  ) {
    setQueryParam({
      queryParam: {
        [queryParameters[0].queryParameterToSet]:
          options[0]?.[queryParameters[0]?.selectorOptionKey],
      },
    });
    setDataReady(true);
  }

  return (
    <div className={cx(className, mode === 'edit' ? 'pa-1' : '')}>
      <Dropdown
        selection
        onChange={(event, data) => {
          const queryParametersToSet = {};
          queryParameters.forEach((queryParam) => {
            queryParametersToSet[
              queryParam.queryParameterToSet
            ] = data.options.filter((opt) => {
              return opt.value === data.value;
            })[0]?.[queryParam.selectorOptionKey];
          });
          setQueryParam({
            queryParam: {
              ...(queryParametersToSet || {}),
            },
          });
        }}
        placeholder={placeholder}
        options={options}
        value={search[queryParameters[0]?.queryParameterToSet] || ''}
      />
    </div>
  );
};

const View = ({ content, ...props }) => {
  const [discodataValues, setDiscodataValues] = useState([]);
  const [mounted, setMounted] = useState(false);
  const { data } = props;
  const { resources = [], subResources = [] } = data;
  const { placeholder = 'Select', className = '' } = data;
  const { key = '', value = '', text = '', queryParametersToSet = [] } = data;

  const options = discodataValues
    .filter((discodata) => discodata[value])
    .map((discodata, index) => ({
      key: discodata[key] || index,
      value: discodata[value] || index,
      text: discodata[text] || index,
    }));

  const updateDiscodataValues = (mounted) => {
    if (props.discodata_resources && props.search && mounted) {
      let newDiscodataValues = [];
      resources.forEach((resource) => {
        if (isArray(props.discodata_resources[resource.package])) {
          newDiscodataValues = [
            ...newDiscodataValues,
            ...(props.discodata_resources[resource.package] || []),
          ];
        }
      });
      const selectedSubResources = subResources.map((subResource) => {
        const keyValue = subResource.package?.split('@') || [null, null];
        return {
          package: keyValue[0],
          query: keyValue[1],
        };
      });
      selectedSubResources.forEach((subResource) => {
        const discodataPackage = resources.filter(
          (resource) => resource.package === subResource.package,
        )[0];
        if (
          props.search[discodataPackage.queryParameter] &&
          isArray(
            props.discodata_resources[discodataPackage.package]?.[
              props.search[discodataPackage.queryParameter]
            ]?.[subResource.query],
          )
        ) {
          newDiscodataValues = [
            ...newDiscodataValues,
            ...(props.discodata_resources[discodataPackage.package]?.[
              props.search[discodataPackage.queryParameter]
            ][subResource.query] || []),
          ];
        }
      });
      setDiscodataValues(newDiscodataValues);
    }
  };

  useEffect(() => {
    setMounted(true);
    if (props.mode !== 'edit') {
      updateDiscodataValues(true);
    } else {
      setDiscodataValues(props.discodataValues);
    }
    /* eslint-disable-next-line */
  }, []);

  useEffect(() => {
    if (props.mode !== 'edit') {
      updateDiscodataValues(mounted);
    } else {
      setDiscodataValues(props.discodataValues);
    }
    /* eslint-disable-next-line */
  }, [props.search, props.discodata_resources, props.discodataValues])

  return (
    <Select
      options={options}
      queryParameters={queryParametersToSet}
      search={props.search}
      setQueryParam={props.setQueryParam}
      placeholder={placeholder}
      className={className}
      mode={props.mode || 'view'}
    />
  );
};

export default compose(
  connect(
    (state, props) => ({
      query: state.router.location.search,
      search: state.discodata_query.search,
      discodata_resources: state.discodata_resources.data,
    }),
    { setQueryParam },
  ),
)(View);
