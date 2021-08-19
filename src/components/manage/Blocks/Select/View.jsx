import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Dropdown } from 'semantic-ui-react';
import cx from 'classnames';
import { setQueryParam } from '@eeacms/volto-datablocks/actions';
import './style.css';

const View = (props) => {
  const [value, setValue] = React.useState(null);
  const { data = {} } = props;
  const provider_data = props.provider_data || {};
  const columns = provider_data[Object.keys(provider_data)?.[0]]?.length || 0;

  const options = Array(Math.max(0, columns))
    .fill()
    .map((_, column) => ({
      key: provider_data[data.value][column],
      value: provider_data[data.value][column],
      text: provider_data[data.text][column],
    }));

  React.useEffect(() => {
    if (!value && options.length) {
      const cachedValue = data.queries.filter(
        (query) => query.param === data.value,
      )?.[0]?.paramToSet;
      onChange(props.search[cachedValue] || options[0]?.value);
    }
    /* eslint-disable-next-line */
  }, [provider_data]);

  const onChange = (value) => {
    let index;
    const queries = {};
    for (let i = 0; i < options.length; i++) {
      if (options[i].value === value) {
        index = i;
        break;
      }
    }
    data.queries.forEach((query) => {
      queries[query.paramToSet] = provider_data[query.param][index];
    });
    setValue(value);
    props.setQueryParam({
      queryParam: {
        ...queries,
      },
    });
  };

  return (
    <>
      {props.mode === 'edit' ? <p>Connected select</p> : ''}
      <div className={cx('connected-select', data.className)}>
        <Dropdown
          selection
          onChange={(_, data) => {
            onChange(data.value);
          }}
          placeholder={data.placeholder}
          options={options}
          value={value}
        />
      </div>
    </>
  );
};

export default compose(
  connect(
    (state) => ({
      query: state.router.location.search,
      search: state.discodata_query.search,
    }),
    { setQueryParam },
  ),
)(View);
