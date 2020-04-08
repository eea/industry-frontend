
import TabsView from '~/components/theme/View/TabsView';
import RedirectView from '~/components/theme/View/RedirectView';
import TabsChildView from '~/components/theme/View/TabsChildView';

import ChildrenListView from '~/components/manage/Blocks/DetailedLink/View';
import ChildrenListEdit from '~/components/manage/Blocks/DetailedLink/Edit';

const applyConfig = config => {
console.log('config', config)
  config.views = {
    ...config.views,
    layoutViews: {
      ...config.views.layoutViews,
      tabs_view: TabsView,
      tabs_child_view: TabsChildView,

      redirect_view: RedirectView,

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

  return config;
}

export default applyConfig