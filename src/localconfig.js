
import TabsView from '~/components/theme/View/TabsView';

import ChildrenListView from '~/components/manage/Blocks/DetailedLink/View';
import ChildrenListEdit from '~/components/manage/Blocks/DetailedLink/Edit';

const applyConfig = config => {
console.log('config', config)
  config.views = {
    ...config.views,
    layoutViews: {
      ...config.views.layoutViews,
      tabs_view: TabsView,
    },
  };



  config.blocks.blocksConfig.detailedLink = {
    id: 'detailedlink',
    group: 'custom_addons',
    title: 'Detailed Link',
    view: ChildrenListView,
    edit: ChildrenListEdit,
    icon: config.blocks.blocksConfig.text.icon,
  };

  // config.blocks.blocksConfig.collection_block = {
  //   id: 'collection_block',
  //   title: 'Collection Listing',
  //   view: CollectionBlockView,
  //   edit: CollectionBlockEdit,
  //   icon: chartIcon,
  //   group: 'custom_addons',
  // };
  return config;
}

export default applyConfig