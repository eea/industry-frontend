import defaultReducers from '@plone/volto/reducers';
import section_tabs from './section_tabs';
import parent_folder_data from './parent_folder_data';
import pages from './pages';

const reducers = {
  section_tabs,
  parent_folder_data,
  pages,
  ...defaultReducers,
};

export default reducers;
