import React, { useState, useEffect } from 'react';
import _uniqueId from 'lodash/uniqueId';
import DefaultEdit from '../DefaultEdit';
import View from './View';
import { settings } from '~/config';

const Edit = props => {
  const [state, setState] = useState({
    schema: {
      provider_url: {
        title: 'Provider url',
        type: 'text',
        default: '',
      },
      sql: {
        title: 'SQL Select',
        type: 'sql',
        selectQueryFields: [
          { title: 'Table', id: 'table' },
          { title: 'Where column', id: 'columnKey' },
          { title: 'Is equal to', id: 'columnValue' },
        ],
        additionalQueryFields: [
          { title: 'Where column', id: 'columnKey' },
          { title: 'Is equal to', id: 'columnValue' },
        ],
      },
    },
    id: _uniqueId('block_'),
  });
  useEffect(() => {
    const schema = { ...state.schema };
    schema.provider_url.default = settings.providerUrl;
    setState({ ...state, schema });
    /* eslint-disable-next-line */
  }, []);
  return (
    <div>
      <DefaultEdit schema={state.schema} {...props} title="Facility block" />
      <View {...props} id={state.id} />
    </div>
  );
};
export default Edit;
