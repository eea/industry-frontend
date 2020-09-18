// import RedirectView from '~/components/theme/View/RedirectView';
import DiscodataView from '~/components/theme/View/DiscodataView';
import DefaultView from '~/components/theme/View/DefaultView';
import DefaultViewNoHeading from '~/components/theme/View/DefaultViewNoHeading';
import RedirectView from '~/components/theme/View/RedirectView';

import DetailedLinkView from '~/components/manage/Blocks/DetailedLink/View';
import DetailedLinkEdit from '~/components/manage/Blocks/DetailedLink/Edit';

import ArticlesSparqlView from '~/components/manage/Blocks/ArticlesSparql/View';
import ArticlesSparqlEdit from '~/components/manage/Blocks/ArticlesSparql/Edit';

import FolderContentsBlockView from '~/components/manage/Blocks/FolderContentsBlock/View';
import FolderContentsBlockEdit from '~/components/manage/Blocks/FolderContentsBlock/Edit';

import ArticlesListView from '~/components/manage/Blocks/ArticlesList/View';
import ArticlesListEdit from '~/components/manage/Blocks/ArticlesList/Edit';

import ChildrenLinksView from '~/components/manage/Blocks/ChildrenLinks/View';
import ChildrenLinksEdit from '~/components/manage/Blocks/ChildrenLinks/Edit';

import EprtrFiltersBlockEdit from '~/components/manage/Blocks/FiltersBlock/Edit';
import EprtrFiltersBlockView from '~/components/manage/Blocks/FiltersBlock/View';

import DiscodataOpenlayersMapBlockEdit from '~/components/manage/Blocks/DiscodataOpenlayersMapBlock/Edit';
import DiscodataOpenlayersMapBlockView from '~/components/manage/Blocks/DiscodataOpenlayersMapBlock/View';

import NavigationBlockEdit from '~/components/manage/Blocks/NavigationBlock/Edit';
import NavigationBlockView from '~/components/manage/Blocks/NavigationBlock/View';

import SidebarBlockEdit from '~/components/manage/Blocks/SidebarBlock/Edit';
import SidebarBlockView from '~/components/manage/Blocks/SidebarBlock/View';

import QueryParamTextEdit from '~/components/manage/Blocks/QueryParamText/Edit';
import QueryParamTextView from '~/components/manage/Blocks/QueryParamText/View';

import QueryParamButtonEdit from '~/components/manage/Blocks/QueryParamButton/Edit';
import QueryParamButtonView from '~/components/manage/Blocks/QueryParamButton/View';

import IframeEdit from '~/components/manage/Blocks/Iframe/Edit';
import IframeView from '~/components/manage/Blocks/Iframe/View';

import DummyBlockEdit from '~/components/manage/Blocks/DummyBlock/Edit';
import DummyBlockView from '~/components/manage/Blocks/DummyBlock/View';

// Discodata components
import DiscodataComponentsBlockEdit from '~/components/manage/Blocks/DiscodataComponentsBlock/Edit';
import DiscodataComponentsBlockView from '~/components/manage/Blocks/DiscodataComponentsBlock/View';

import TextEdit from '~/components/manage/Blocks/DiscodataComponents/Text/Edit';
import TextView from '~/components/manage/Blocks/DiscodataComponents/Text/View';

import SelectEdit from '~/components/manage/Blocks/DiscodataComponents/Select/Edit';
import SelectView from '~/components/manage/Blocks/DiscodataComponents/Select/View';

import CustomEdit from '~/components/manage/Blocks/DiscodataComponents/Custom/Edit';
import CustomView from '~/components/manage/Blocks/DiscodataComponents/Custom/View';

import ListEdit from '~/components/manage/Blocks/DiscodataComponents/List/Edit';
import ListView from '~/components/manage/Blocks/DiscodataComponents/List/View';

// import QueryParamButtonEdit from '~/components/manage/Blocks/LinkButton/Edit';
// import QueryParamButtonView from '~/components/manage/Blocks/QueryParamButton/View';

import BlocksWidget from '~/components/manage/Widgets/BlocksWidget';
import QueryParametersListWidget from '~/components/manage/Blocks/DiscodataComponents/Widgets/QueryParametersListWidget';

import { addCustomGroup } from '~/helpers';

import packSVG from '@plone/volto/icons/pack.svg';
import folderSVG from '@plone/volto/icons/folder.svg';
import linkSVG from '@plone/volto/icons/link.svg';
import listSVG from '@plone/volto/icons/content-listing.svg';
import worldSVG from '@plone/volto/icons/world.svg';

export function applyConfig(voltoConfig) {
  const config = { ...voltoConfig };
  addCustomGroup(config, { id: 'eprtr_blocks', title: 'Eprtr Blocks' });
  addCustomGroup(config, {
    id: 'discodata_components',
    title: 'Discodata components',
  });

  config.views = {
    ...config.views,
    layoutViews: {
      ...config.views.layoutViews,
      discodata_view: DiscodataView,
      default_view: DefaultView,
      default_view_no_heading: DefaultViewNoHeading,
      redirect_view: RedirectView,
    },
  };

  config.widgets = {
    ...config.widgets,
    id: {
      ...config.widgets.id,
      blocks: BlocksWidget,
      blocks_layout: BlocksWidget,
    },
    widget: {
      ...config.widgets.widget,
      query_param_list: QueryParametersListWidget,
    },
  };

  config.blocks.blocksConfig.folder_contents = {
    id: 'folder_contents',
    title: 'Folder Contents',
    group: 'eprtr_blocks',
    view: FolderContentsBlockView,
    edit: FolderContentsBlockEdit,
    icon: folderSVG,
  };

  config.blocks.blocksConfig.articles_list = {
    id: 'articles_list',
    title: 'Articles List',
    group: 'eprtr_blocks',
    view: ArticlesListView,
    edit: ArticlesListEdit,
    icon: listSVG,
  };

  config.blocks.blocksConfig.articles_sparql = {
    id: 'articles_sparql',
    title: 'Articles sparql',
    group: 'eprtr_blocks',
    view: ArticlesSparqlView,
    edit: ArticlesSparqlEdit,
    icon: listSVG,
  };

  config.blocks.blocksConfig.detailed_link = {
    id: 'detailed_link',
    title: 'Detailed Link',
    group: 'eprtr_blocks',
    view: DetailedLinkView,
    edit: DetailedLinkEdit,
    icon: linkSVG,
  };

  config.blocks.blocksConfig.children_links = {
    id: 'children_links',
    title: 'Children Links',
    group: 'eprtr_blocks',
    view: ChildrenLinksView,
    edit: ChildrenLinksEdit,
    icon: linkSVG,
  };

  config.blocks.blocksConfig.navigation_block = {
    id: 'navigation_block',
    title: 'Navigation block',
    group: 'eprtr_blocks',
    view: NavigationBlockView,
    edit: NavigationBlockEdit,
    icon: linkSVG,
  };

  config.blocks.blocksConfig.sidebar_block = {
    id: 'sidebar_block',
    title: 'Sidebar Block',
    group: 'eprtr_blocks',
    view: SidebarBlockView,
    edit: SidebarBlockEdit,
    icon: linkSVG,
  };

  config.blocks.blocksConfig.eprtr_filters_block = {
    id: 'eprtr_filters_block',
    title: 'Eprtr filters block',
    group: 'eprtr_blocks',
    view: EprtrFiltersBlockView,
    edit: EprtrFiltersBlockEdit,
    icon: packSVG,
  };

  config.blocks.blocksConfig.eprtr_query_param_text = {
    id: 'eprtr_query_param_text',
    title: 'Eprtr query param text',
    group: 'eprtr_blocks',
    view: QueryParamTextView,
    edit: QueryParamTextEdit,
    icon: packSVG,
  };

  config.blocks.blocksConfig.eprtr_query_param_button = {
    id: 'eprtr_query_param_button',
    title: 'Eprtr query param button',
    group: 'eprtr_blocks',
    view: QueryParamButtonView,
    edit: QueryParamButtonEdit,
    icon: packSVG,
  };

  config.blocks.blocksConfig.eprtr_iframe = {
    id: 'eprtr_iframe',
    title: 'Eprtr iframe',
    group: 'eprtr_blocks',
    view: IframeView,
    edit: IframeEdit,
    icon: packSVG,
  };

  config.blocks.blocksConfig.eprtr_dummy_block = {
    id: 'eprtr_dummy_block',
    title: 'Eprtr dummy block',
    group: 'eprtr_blocks',
    view: DummyBlockView,
    edit: DummyBlockEdit,
    icon: packSVG,
  };

  config.blocks.blocksConfig.eprtr_openlayers_map_block = {
    id: 'eprtr_openlayers_map_block',
    title: 'Eprtr openlayers map block',
    group: 'eprtr_blocks',
    view: DiscodataOpenlayersMapBlockView,
    edit: DiscodataOpenlayersMapBlockEdit,
    icon: worldSVG,
  };

  // DISCODATA COMPONENTS

  config.blocks.blocksConfig.discodata_components_text = {
    id: 'discodata_components_text',
    title: 'Text',
    group: 'discodata_components',
    view: TextView,
    edit: TextEdit,
    icon: packSVG,
  };

  config.blocks.blocksConfig.discodata_components_select = {
    id: 'discodata_components_select',
    title: 'Select',
    group: 'discodata_components',
    view: SelectView,
    edit: SelectEdit,
    icon: packSVG,
  };

  config.blocks.blocksConfig.discodata_components_list = {
    id: 'discodata_components_list',
    title: 'List',
    group: 'discodata_components',
    view: ListView,
    edit: ListEdit,
    icon: packSVG,
  };

  config.blocks.blocksConfig.discodata_components_custom = {
    id: 'discodata_components_custom',
    title: 'Custom',
    group: 'discodata_components',
    view: CustomView,
    edit: CustomEdit,
    icon: packSVG,
  };

  config.blocks.blocksConfig.discodata_components_block = {
    id: 'discodata_components_block',
    title: 'Discodata components block',
    view: DiscodataComponentsBlockView,
    edit: DiscodataComponentsBlockEdit,
    icon: packSVG,
    group: 'data_blocks',
  };

  return config;
}
