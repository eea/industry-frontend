/**
 * Routes.
 * @module routes
 */

import { App } from '@plone/volto/components';
import { defaultRoutes } from '@plone/volto/routes';

import { addonRoutes } from '~/config';
import BrowseView from '~/components/theme/View/BrowseView';

/**
 * Routes array.
 * @array
 * @returns {array} Routes.
 */
const routes = [
  {
    path: '/',
    component: App, // Change this if you want a different component
    routes: [
      // Add your routes here
      {
        path: '/browse',
        component: BrowseView,
      },


      // {
      //   path: '/',
      //   component: HomepageView,
      //   exact: true,
      // },
      // {
      //   path: '/manage-slider',
      //   component: EditSlider,
      // },
      // {
      //   path: '*/**/manage-slider',
      //   component: EditSlider,
      // },

      // addon routes have a higher priority then default routes
      // {
      //   path: '/',
      //   component: HomepageView,
      //   exact: true,
      // },
      ...(addonRoutes || []),

      ...defaultRoutes,
    ],
  },
];

export default routes;
