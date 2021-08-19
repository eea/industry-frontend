import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Dropdown } from 'semantic-ui-react';
import cx from 'classnames';
import { setQueryParam } from '@eeacms/volto-datablocks/actions';
import './style.css';

const items = [
  {
    title: 'Item 1',
    parentId: null,
  },
  {
    title: 'Item 2',
    parentId: null,
    items: [
      {
        title: 'Item 2.1',
        parentId: 'Item 2',
      },
      {
        title: 'Item 2.2',
        parentId: 'Item 2',
      },
      {
        title: 'Item 2.3',
        parentId: 'Item 2',
      },
    ],
  },
  {
    title: 'Item 3',
    parentId: null,
  },
  {
    title: 'Item 4',
    parentId: null,
    items: [
      {
        title: 'Item 4.1',
        parentId: 'Item 4',
        items: [
          {
            title: 'Item 4.1.1',
            parentId: 'Item 4.1',
          },
        ],
      },
      {
        title: 'Item 4.2',
        parentId: 'Item 4',
      },
      {
        title: 'Item 4.3',
        parentId: 'Item 4',
      },
    ],
  },
];

const activeItems = ['Item 4', 'Item 4.1', 'Item 4.1.1', 'Item 2'];

const getVisibility = (activeItems, item) => {
  return activeItems.indexOf(item.parentId) !== -1;
};

let collapsing = {
  title: 'Item 4',
  parentId: null,
  items: [
    {
      title: 'Item 4.1',
      parentId: 'Item 4',
      items: [
        {
          title: 'Item 4.1.1',
          parentId: 'Item 4.1',
        },
      ],
    },
    {
      title: 'Item 4.2',
      parentId: 'Item 4',
    },
    {
      title: 'Item 4.3',
      parentId: 'Item 4',
    },
  ],
};

// let test = ['Item 4', 'Item 4.1', 'Item 4.1.1', 'Item 4.2', 'Item 4.3'];

const getIds = (item) => {
  if (!item.items) return [item.title];
  let children = [];
  item.items.forEach((child) => {
    children = [...children, ...getIds(child)];
  });
  return [item.title, ...children];
};

const collapsingItems = getIds(collapsing);

collapsingItems.forEach((item) => {
  const index = activeItems.indexOf(item);
  if (index !== -1) {
    activeItems.splice(index, 1);
  }
});
console.log('HERE', activeItems);
// activeItems.splice(activeItems.indexOf(collapsing.title), 1);

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
