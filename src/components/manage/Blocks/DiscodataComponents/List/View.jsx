/* REACT */
import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { isArray, isDate } from 'lodash';
import { Link } from 'react-router-dom';
import { setQueryParam } from 'volto-datablocks/actions';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import moment from 'moment';
import cx from 'classnames';
import './style.css';

const components = {
  list: (
    key,
    link,
    queryParameters,
    collection = [],
    search,
    setQueryParam,
    limit,
    className,
    mode,
  ) => {
    return (
      <div className="discodata-list">
        {collection.slice(0, limit || collection.length).map((item) => (
          <Link
            key={`item-${item[key]}`}
            className={cx('', className)}
            as="a"
            to={link}
            onClick={() => {
              const queries = {};
              queryParameters.forEach((queryParameter) => {
                queries[queryParameter.queryParameterToSet] =
                  item[queryParameter.selectorOptionKey];
              });
              setQueryParam({
                queryParam: { ...queries },
              });
            }}
          >
            {item[key]}
          </Link>
        ))}
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
  const { className = '' } = data;
  const {
    key = '',
    link = '/',
    queryParametersToSet = [],
    limit = null,
  } = data;

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
      {components['list']
        ? components['list'](
            key,
            link,
            queryParametersToSet,
            discodataValues,
            props.search,
            props.setQueryParam,
            limit,
            className,
            props.mode,
          )
        : ''}
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
