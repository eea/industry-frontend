import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import _uniqueId from 'lodash/uniqueId';
import View from './View';
import { isArray } from 'lodash';

import InlineForm from '@plone/volto/components/manage/Form/InlineForm';
import { SidebarPortal } from '@plone/volto/components';

import { makeSelectSchema } from '../schema';

const getSchema = (props) => {
  return makeSelectSchema(props);
};

const Edit = (props) => {
  const [discodataValues, setDiscodataValues] = useState([]);
  const [mounted, setMounted] = useState(false);
  const { data } = props;
  const { resources = [], subResources = [] } = data;
  const [state, setState] = useState({
    schema: getSchema({ ...props, discodataValues }),
    id: _uniqueId('block_'),
  });

  const updateDiscodataValues = (mounted) => {
    if (
      props.discodata_resources.data &&
      props.discodata_query.search &&
      mounted
    ) {
      let newDiscodataValues = [];
      resources.forEach((resource) => {
        if (isArray(props.discodata_resources.data[resource.package])) {
          newDiscodataValues = [
            ...newDiscodataValues,
            ...(props.discodata_resources.data[resource.package] || []),
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
          props.discodata_query.search[discodataPackage.queryParameter] &&
          isArray(
            props.discodata_resources.data[discodataPackage.package]?.[
              props.discodata_query.search[discodataPackage.queryParameter]
            ]?.[subResource.query],
          )
        ) {
          newDiscodataValues = [
            ...newDiscodataValues,
            ...(props.discodata_resources.data[discodataPackage.package]?.[
              props.discodata_query.search[discodataPackage.queryParameter]
            ][subResource.query] || []),
          ];
        }
      });
      setDiscodataValues(newDiscodataValues);
      return newDiscodataValues;
    }
    return [];
  };

  useEffect(() => {
    setMounted(true);
    updateDiscodataValues(true);
    /* eslint-disable-next-line */
  }, []);

  useEffect(() => {
    updateDiscodataValues(mounted);
    /* eslint-disable-next-line */
  }, [
    JSON.stringify(props.discodata_query.search),
    JSON.stringify(props.discodata_resources.data),
    JSON.stringify(props.data),
  ]);

  useEffect(() => {
    const schema = getSchema({ ...props, discodataValues });
    setState({
      ...state,
      schema,
    });
    /* eslint-disable-next-line */
  }, [
    JSON.stringify(discodataValues)
  ]);

  return (
    <div>
      <SidebarPortal selected={props.selected}>
        <InlineForm
          schema={state.schema}
          title={state.schema.title}
          onChangeField={(id, value) => {
            const { data } = props;
            props.onChangeBlock(props.block, {
              ...data,
              [id]: value,
            });
          }}
          formData={props.data}
          block={props.block}
        />
      </SidebarPortal>
      <View
        {...props}
        id={state.id}
        mode="edit"
        discodataValues={discodataValues}
      />
    </div>
  );
};

export default compose(
  connect((state, props) => ({
    pathname: state.router.location.pathname,
    discodata_resources: state.discodata_resources,
    discodata_query: state.discodata_query,
  })),
)(Edit);
