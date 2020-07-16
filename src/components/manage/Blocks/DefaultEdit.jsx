import React, { useState, useEffect } from 'react';
import RenderFields from 'volto-addons/Widgets/RenderFields';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { settings } from '~/config';

import DB from '~/components/manage/DataBase/DB';

const DefaultEdit = props => {
  useEffect(() => {
    if (
      props.data?.sql_select?.value.table &&
      props.data?.sql_select?.value.columnKey &&
      props.data?.sql_select?.value.columnValue
    )
      DB.table(
        props.data?.provider_url?.value || settings.providerUrl,
        props.data?.sql_select?.value.table,
      )
        .get()
        .where(
          props.data?.sql_select?.value.where,
          props.data?.sql_select?.value.columnKey,
        )
        .where(
          props.data?.data_query?.value?.i,
          props.data?.data_query?.value?.v,
        )
        .log();
    /* eslint-disable-next-line */
  }, [props.data?.data_query?.value, props.data?.sql_select?.value])
  return (
    <div>
      <RenderFields schema={props.schema} {...props} title={props.title} />
    </div>
  );
};
export default compose(
  connect((state, props) => ({
    connected_data_parameters: state.connected_data_parameters,
    pathname: state.router.location.pathname,
  })),
)(DefaultEdit);
