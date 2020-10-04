/* REACT */
import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { isArray, isDate } from 'lodash';
import { Dropdown } from 'semantic-ui-react';
import { setQueryParam } from 'volto-datablocks/actions';
import ReactTooltip from 'react-tooltip';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import moment from 'moment';
import infoSVG from '@plone/volto/icons/info.svg';
import cx from 'classnames';

const getDate = (field) => {
  if (!field) return '-';
  if (Date.parse(field) > 0) {
    return moment(field).format('DD MMM YYYY');
  }
};

const components = {
  eprtrReportingYears: (
    options,
    queryParameters,
    packages,
    search,
    setQueryParam,
    placeholder,
    className,
    mode,
  ) => {
    let activeValue = '';
    if (queryParameters[0]?.queryParameterToSet) {
      activeValue = search[queryParameters[0].queryParameterToSet] || '';
    }
    return (
      <div
        className={cx(
          'eprtrReportingYears custom-selector white pa-1 pl-3-super pr-3-super',
          className,
        )}
      >
        <div>
          <span className="floating-icon" data-tip={'Something'}>
            <Icon
              className="firefox-icon"
              name={infoSVG}
              size="20"
              color="#fff"
            />
          </span>
          <p className="lighter">Last report was submitted on:</p>
          <p className="bold">{getDate(packages[0])}</p>
        </div>
        {/* <div>
          <p className="bold">Reporting year</p>
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
            value={activeValue}
          />
        </div> */}
        <div>
          <p className="bold">Publish date</p>
          <p className="lighter">{getDate(packages[1])}</p>
        </div>
      </div>
    );
  },
};

const View = ({ content, ...props }) => {
  const [packages, setPackages] = useState([]);
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

  const updatePackages = (mounted) => {
    if (props.discodata_resources && props.search && mounted) {
      let newDiscodataValues = [];
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
        if (props.search[discodataPackage.queryParameter]) {
          newDiscodataValues.push(
            props.discodata_resources[discodataPackage.package]?.[
              props.search[discodataPackage.queryParameter]
            ]?.[subResource.query],
          );
        }
      });
      setPackages(newDiscodataValues);
    }
  };

  useEffect(() => {
    setMounted(true);
    updatePackages(true);
    if (props.mode !== 'edit') {
      updateDiscodataValues(true);
    } else {
      setDiscodataValues(props.discodataValues);
    }
    /* eslint-disable-next-line */
  }, []);

  useEffect(() => {
    updatePackages(mounted);
    if (props.mode !== 'edit') {
      updateDiscodataValues(mounted);
    } else {
      setDiscodataValues(props.discodataValues);
    }
    /* eslint-disable-next-line */
  }, [props.search, props.discodata_resources, props.discodataValues])


  return (
    <>
      {components[props.data.component] ? (
        components[props.data.component](
          options,
          queryParametersToSet,
          packages,
          props.search,
          props.setQueryParam,
          placeholder,
          className,
          props.mode,
        )
      ) : props.mode === 'edit' ? (
        <p>Component not selected</p>
      ) : (
        ''
      )}
      <ReactTooltip />
    </>
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
