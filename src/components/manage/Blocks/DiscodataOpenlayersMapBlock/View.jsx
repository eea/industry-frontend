/* REACT */
import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Portal } from 'react-portal';
// HELPERS
import qs from 'query-string';
import axios from 'axios';
import jsonp from 'jsonp';
import { settings } from '~/config';
import { isArray, isObject } from 'lodash';
// VOLTO
import { Icon as VoltoIcon } from '@plone/volto/components';
// VOLTO-DATABLOCKS
import { setQueryParam } from 'volto-datablocks/actions';
// SEMANTIC REACT UI
import { Grid, Header, Loader, Dimmer } from 'semantic-ui-react';
// SVGs
import clearSVG from '@plone/volto/icons/clear.svg';
import navigationSVG from '@plone/volto/icons/navigation.svg';
// STYLES
import 'ol/ol.css';
import './style.css';

const pinSVG = (fill = '#000') => {
  return `<svg height="16pt" width="16pt" viewBox="-119 -21 682 682.66669" xmlns="http://www.w3.org/2000/svg"><path fill="${fill}" d="m216.210938 0c-122.664063 0-222.460938 99.796875-222.460938 222.460938 0 154.175781 222.679688 417.539062 222.679688 417.539062s222.242187-270.945312 222.242187-417.539062c0-122.664063-99.792969-222.460938-222.460937-222.460938zm67.121093 287.597656c-18.507812 18.503906-42.8125 27.757813-67.121093 27.757813-24.304688 0-48.617188-9.253907-67.117188-27.757813-37.011719-37.007812-37.011719-97.226562 0-134.238281 17.921875-17.929687 41.761719-27.804687 67.117188-27.804687 25.355468 0 49.191406 9.878906 67.121093 27.804687 37.011719 37.011719 37.011719 97.230469 0 134.238281zm0 0"/></svg>`;
};

const factorySVG = () => {
  return `<svg height="32pt" width="32pt" viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg"><circle cx="75" cy="75" fill="#709584" r="64"/><path d="m59.11 50.02h-7.34l-1.04 24.71h9.42z" fill="#3a556a"/><path d="m75.38 50.02h-7.35l-1.04 24.71h9.43z" fill="#3a556a"/><path d="m42.63 71.48h64.74v32.72h-64.74z" fill="#e1e6e9"/><g fill="#3a556a"><path d="m47.11 77.17h3.62v3.62h-3.62z"/><path d="m53.63 77.17h3.62v3.62h-3.62z"/><path d="m60.15 77.17h3.62v3.62h-3.62z"/><path d="m66.67 77.17h3.62v3.62h-3.62z"/><path d="m73.19 77.17h3.62v3.62h-3.62z"/><path d="m79.71 77.17h3.62v3.62h-3.62z"/><path d="m86.23 77.17h3.62v3.62h-3.62z"/><path d="m92.75 77.17h3.62v3.62h-3.62z"/><path d="m99.28 77.17h3.62v3.62h-3.62z"/></g><path d="m39.52 70.38h70.95v3.09h-70.95z" fill="#d5d6db"/><path d="m69.86 44.24a4 4 0 0 0 -1.52-.69 9.51 9.51 0 0 0 -4.56-.09 8.66 8.66 0 0 1 -2.73.47c-1-.09-1.84-.65-2.81-.74a3 3 0 0 0 -2.65 1.18 5.72 5.72 0 0 0 -.59 2.63 1.79 1.79 0 0 0 .12.69.58.58 0 0 0 .54.37c.34 0 .52-.44.52-.78a2.83 2.83 0 0 1 .05-1 1.21 1.21 0 0 1 1.41-.54c.53.12 1 .44 1.52.6a12.79 12.79 0 0 0 3.16.11 14.09 14.09 0 0 1 3.35.85 5.75 5.75 0 0 0 3.4.23 2.13 2.13 0 0 0 1.59-1.86 2 2 0 0 0 -.8-1.43z" fill="#ebf0f3"/><path d="m83.29 45.62a3 3 0 0 0 -1.14-.53 7.19 7.19 0 0 0 -3.45-.09 6.35 6.35 0 0 1 -2 .35c-.73-.07-1.39-.49-2.12-.56a2.28 2.28 0 0 0 -2 .89 4.28 4.28 0 0 0 -.46 2 1.29 1.29 0 0 0 .08.52.47.47 0 0 0 .41.28c.26 0 .39-.33.39-.59a2.13 2.13 0 0 1 0-.76.91.91 0 0 1 1.06-.41c.4.09.76.33 1.15.45a9.94 9.94 0 0 0 2.38.09 10.22 10.22 0 0 1 2.53.64 4.25 4.25 0 0 0 2.56.17 1.59 1.59 0 0 0 1.2-1.4 1.44 1.44 0 0 0 -.59-1.05z" fill="#ebf0f3"/><path d="m60 104.18h-8.5v-7.7a4.25 4.25 0 1 1 8.5 0z" fill="#3a556a"/><path d="m79.1 104.18h-8.51v-7.7a4.26 4.26 0 1 1 8.51 0z" fill="#3a556a"/><path d="m98.19 104.18h-8.51v-7.7a4.26 4.26 0 1 1 8.51 0z" fill="#3a556a"/><path d="m39.52 103.74h70.95v3.09h-70.95z" fill="#d5d6db"/></svg>`;
};

const refinerieSVG = () => {
  return `<svg height="32pt" width="32pt" viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg"><circle cx="75" cy="75" fill="#334d5c" r="64"/><path d="m74.37 65.05v-6.65a4.1 4.1 0 0 0 -4.1-4.1h-15a4.11 4.11 0 0 0 -4.1 4.1v22.6h2v-22.6a2.11 2.11 0 0 1 2.1-2.1h15a2.1 2.1 0 0 1 2.1 2.1v6.65z" fill="#d5d6db"/><path d="m93.39 71.67h-8.67l1.63-25.3h5.4z" fill="#d5d6db"/><path d="m92.12 52.02-.17-2.61h-5.79l-.17 2.61z" fill="#e56353"/><path d="m69.36 61.11h8.02v10.57h-8.02z" fill="#d5d6db"/><path d="m46.44 101.49h11.73v7.85h-11.73z" fill="#f7be56"/><path d="m63.61 69.26h44.52v40.88h-44.52z" fill="#e1e6e9"/><path d="m71.76 75.46h5.62v8.5h-5.62z" fill="#3a556a"/><path d="m83.06 75.46h5.62v8.5h-5.62z" fill="#3a556a"/><path d="m94.35 75.46h5.62v8.5h-5.62z" fill="#3a556a"/><path d="m55 72.39v-3.13h-5.42v3.13a15.77 15.77 0 1 0 5.46 0z" fill="#fcd462"/><path d="m55.43 68.88h-6.24a.53.53 0 0 0 -.53.53.52.52 0 0 0 .53.52h6.24a.52.52 0 0 0 .53-.52.53.53 0 0 0 -.53-.53z" fill="#f7be56"/><path d="m67.83 87.1h-31.26a1.53 1.53 0 1 0 0 3.06h31.26a1.53 1.53 0 0 0 0-3.06z" fill="#f7be56"/><path d="m37.6 107.4h77.35v2.74h-77.35z" fill="#d5d6db"/><path d="m91.42 90.16h20.67v17.24h-20.67z" fill="#ebf0f3"/><g fill="#3a556a"><path d="m93.88 92.59h2.47v2.47h-2.47z"/><path d="m98.31 92.59h2.47v2.47h-2.47z"/><path d="m102.73 92.59h2.47v2.47h-2.47z"/><path d="m107.16 92.59h2.47v2.47h-2.47z"/></g><path d="m109.78 41.64a7.11 7.11 0 0 0 -4.47-1c-1.66.11-3.36.6-4.94.09a7.5 7.5 0 0 0 -2.66-.81c-1.15.08-2 1.16-3.1 1.48a6.81 6.81 0 0 1 -2.8-.1 2.87 2.87 0 0 0 -2.61.7c-.76.94-.45 2.08-.45 3.46l.81-1.74a2 2 0 0 1 .51-.75 1.52 1.52 0 0 1 1.41-.07 12.41 12.41 0 0 0 1.35.57c1.13.28 2.34-.36 3.46 0s1.71 1.16 2.71 1.41c1.28.33 2.59-.61 3.9-.47 2.23.25 3.21 3.32 5.41 3.76a3 3 0 0 0 3.35-2.51 4.22 4.22 0 0 0 -1.88-4.02z" fill="#ebf0f3"/></svg>`;
};

const nop = () => {
  return null;
};

const SVG_COLLECTION = {
  Chemicals: nop,
  'Electricity and heat production': nop,
  'Extractive industry': nop,
  'Ferrous metal': nop,
  'Food and drink': nop,
  'Fuel processing': nop,
  'Incineration with energy recovery': nop,
  Landfill: nop,
  Livestock: nop,
  'Non-ferrous metal': nop,
  'Non-metallic minerals': nop,
  'Other manufacturing': nop,
  'Other waste management': nop,
  'Pulp, paper and wood': nop,
  Refineries: refinerieSVG,
  'Waste management': nop,
  'Wastewater treatment': nop,
};

const splitBy = (arr, delimiter) => {
  if (Array.isArray(arr)) {
    return (
      arr
        .filter((value) => value)
        .map((value) => `'${value}'`)
        .join(delimiter) || ''
    );
  }
  return '';
};

let Map,
  View,
  Overlay,
  EsriJSON,
  VectorSource,
  VectorSourceEvent,
  bboxStrategy,
  XYZ,
  fromLonLat,
  toLonLat,
  toStringHDMS,
  createXYZ,
  Icon,
  CircleStyle,
  Fill,
  Stroke,
  Style,
  TileLayer,
  VectorLayer,
  Group,
  tile,
  Control,
  defaultsControls,
  defaultsInteractions,
  DragRotateAndZoom;
let OL_LOADED = false;
const initialExtent = [
  -10686671.0000035,
  -2430148.00000588,
  6199975.99999531,
  10421410.9999871,
];
let renderExtent = [];

const getDistance = (P1, P2) => {
  const cathetus_1 = Math.pow(P1[0] - P2[0], 2);
  const cathetus_2 = Math.pow(P1[1] - P2[1], 2);
  return Math.sqrt(cathetus_1 + cathetus_2);
};

const OpenlayersMapView = (props) => {
  const stateRef = useRef({
    map: {
      element: null,
      sitesSourceQuery: { whereStatements: {}, where: '' },
      oldSitesSourceQuery: { whereStatements: {}, where: '' },
      sitesSourceLayer: null,
    },
    popup: { element: null, properties: {} },
    popupDetails: { element: null, properties: {} },
    locationTerm: null,
    siteTerm: null,
    updateMapPosition: null,
  });
  const [state, setState] = useState({
    map: {
      element: null,
      sitesSourceQuery: { whereStatements: {}, where: '' },
      oldSitesSourceQuery: { whereStatements: {}, where: '' },
      sitesSourceLayer: null,
    },
    popup: { element: null, properties: {} },
    popupDetails: { element: null, properties: {} },
    locationTerm: null,
    siteTerm: null,
    updateMapPosition: null,
  });
  const [loader, setLoader] = useState(false);
  const [mapRendered, setMapRendered] = useState(false);
  const [firstFilteringUpdate, setFirstFilteringUpdate] = useState(false);
  const firstFilteringDone = useRef(false);
  const ToggleSidebarControl = useRef(null);
  const ViewYourAreaControl = useRef(null);
  const siteTermRef = useRef(null);
  const mounted = useRef(false);
  const history = useHistory();
  const draggable = !!props.data?.draggable?.value;
  const hasPopups = !!props.data?.hasPopups?.value;
  const hasSidebar = !!props.data?.hasSidebar?.value;
  const hasRegionsFeatures = !!props.data?.hasRegionsFeatures?.value;
  const filterSource = props.data?.filterSource?.value || 'query_params';
  const zoomSwitch = 6;
  const currentMapZoom = state.map?.element
    ? state.map.element.getView().getZoom()
    : null;
  let queryParams;
  if (filterSource === 'query_params') {
    try {
      queryParams = JSON.parse(props.data?.query?.value)?.properties;
      Object.entries(queryParams).forEach(([key, value]) => {
        queryParams[key].sql = `(${value.param} LIKE '%:options%')`;
        queryParams[key].type = 'string';
      });
    } catch {
      queryParams = {};
    }
  }
  const locationTerm = props.discodata_query.search.locationTerm || null;
  const siteTerm =
    filterSource !== 'query_params'
      ? props.discodata_query.search.siteTerm || null
      : props.discodata_query.search[queryParams?.siteName?.param] || null;

  useEffect(() => {
    if (__CLIENT__ && document) {
      // MOuNT
      if (!OL_LOADED) {
        Map = require('ol/Map').default;
        View = require('ol/View').default;
        Overlay = require('ol/Overlay').default;
        EsriJSON = require('ol/format/EsriJSON').default;
        VectorSource = require('ol/source/Vector').default;
        VectorSourceEvent = require('ol/source/Vector').VectorSourceEvent;
        bboxStrategy = require('ol/loadingstrategy').bbox;
        XYZ = require('ol/source/XYZ').default;
        fromLonLat = require('ol/proj').fromLonLat;
        toLonLat = require('ol/proj').toLonLat;
        toStringHDMS = require('ol/coordinate').toStringHDMS;
        createXYZ = require('ol/tilegrid').createXYZ;
        Icon = require('ol/style/Icon.js').default;
        CircleStyle = require('ol/style/Circle.js').default;
        Fill = require('ol/style/Fill.js').default;
        Stroke = require('ol/style/Stroke.js').default;
        Style = require('ol/style/Style.js').default;
        TileLayer = require('ol/layer/Tile.js').default;
        VectorLayer = require('ol/layer/Vector.js').default;
        Group = require('ol/layer/Group.js').default;
        tile = require('ol/loadingstrategy').tile;
        Control = require('ol/control/Control.js').default;
        defaultsControls = require('ol/control.js').defaults;
        defaultsInteractions = require('ol/interaction.js').defaults;
        DragRotateAndZoom = require('ol/interaction.js').DragRotateAndZoom;
        OL_LOADED = true;
      }
      if (OL_LOADED && !ToggleSidebarControl.current && hasSidebar) {
        ToggleSidebarControl.current = /*@__PURE__*/ (function (Control) {
          function ToggleSidebarControl(opt_options) {
            const options = opt_options || {};
            const buttonContainer = document.createElement('div');
            buttonContainer.setAttribute('id', 'map-sidebar-button');
            buttonContainer.setAttribute('class', 'ol-unselectable ol-control');
            Control.call(this, {
              element: buttonContainer,
              target: options.target,
            });
          }
          if (Control) ToggleSidebarControl.__proto__ = Control;
          ToggleSidebarControl.prototype = Object.create(
            Control && Control.prototype,
          );
          ToggleSidebarControl.prototype.constructor = ToggleSidebarControl;

          return ToggleSidebarControl;
        })(Control);
      }

      if (OL_LOADED && !ViewYourAreaControl.current) {
        ViewYourAreaControl.current = /*@__PURE__*/ (function (Control) {
          function ViewYourAreaControl(opt_options) {
            const options = opt_options || {};
            const buttonContainer = document.createElement('div');
            buttonContainer.setAttribute('id', 'map-view-your-area-button');
            buttonContainer.setAttribute('class', 'ol-unselectable ol-control');
            Control.call(this, {
              element: buttonContainer,
              target: options.target,
            });
          }
          if (Control) ViewYourAreaControl.__proto__ = Control;
          ViewYourAreaControl.prototype = Object.create(
            Control && Control.prototype,
          );
          ViewYourAreaControl.prototype.constructor = ViewYourAreaControl;

          return ViewYourAreaControl;
        })(Control);
      }
      renderMap();
      setMapRendered(true);
    }
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
    /* eslint-disable-next-line */
  }, [])

  useEffect(() => {
    siteTermRef.current = siteTerm;
  }, [siteTerm]);

  useEffect(() => {
    if (mapRendered) {
      updateFilters();
    }
    /* eslint-disable-next-line */
  }, [
    JSON.stringify(props.discodata_query.search.filtersCounter),
  ]);

  useEffect(() => {
    stateRef.current = { ...state };
    /* eslint-disable-next-line */
  }, [state])

  useEffect(() => {
    if (mapRendered) {
      if (['byLocationTerm', 'bySiteTerm'].includes(state.updateMapPosition)) {
        onSourceChange();
      } else if (
        state.map.sitesSourceQuery.where !== state.map.oldSitesSourceQuery.where
      ) {
        state.map.sitesSourceLayer &&
          state.map.sitesSourceLayer.getSource().refresh();
      }
      if (!firstFilteringDone.current) {
        firstFilteringDone.current = true;
      }
    }
    /* eslint-disable-next-line */
  }, [state.map.sitesSourceQuery?.where, state.updateMapPosition])

  if (mapRendered && !firstFilteringUpdate) {
    updateFilters();
    setFirstFilteringUpdate(true);
  }

  function updateFilters() {
    const sitesSourceQuery = { ...state.map.sitesSourceQuery };
    if (hasSidebar && filterSource === 'eprtr_filters') {
      sitesSourceQuery.whereStatements = {
        ...sitesSourceQuery.whereStatements,
        // Industries
        EEAActivity: {
          sql: `(eea_activities LIKE '%:options%')`,
          type: 'multiple',
        },
        // Country / Region / Town
        nuts_latest: {
          sql: `(nuts_regions LIKE '%:options%')`,
          type: 'multiple',
        },
        // River basin district
        riverBasin: {
          sql: `(rbds LIKE '%:options%')`,
          type: 'multiple',
        },
        // Pollutants grouops
        pollutantGroup: {
          sql: `((air_groups LIKE '%:options%') OR (water_groups LIKE '%:options%'))`,
          type: 'multiple',
        },
        // Pollutants
        pollutant: {
          sql: `(pollutants LIKE '%:options%')`,
          type: 'multiple',
        },
        // Reporting year
        reportingYear: {
          sql: `(Site_reporting_year IN (:options))`,
        },
        // Plant type
        plantTypes: {
          sql: `(plantTypes LIKE '%:options%')`,
          type: 'multiple',
        },
        // BAT conclusion
        batConclusionCode: {
          sql: `(bat_conclusions LIKE '%:options%')`,
          type: 'multiple',
        },
        // Permit type
        permitType: {
          sql: `(permit_types LIKE '%:options%')`,
          type: 'multiple',
        },
        // Permit year
        permitYear: {
          sql: `(permit_years LIKE '%:options%')`,
          type: 'multiple',
        },
      };
    } else if (filterSource === 'query_params') {
      sitesSourceQuery.whereStatements = {
        ...sitesSourceQuery.whereStatements,
        ...queryParams,
      };
    }

    Object.entries(sitesSourceQuery.whereStatements).forEach(([id, where]) => {
      let options;
      if (['string', 'multiple'].includes(where.type)) {
        options = props.discodata_query.search[id];
      } else if (!props.discodata_query.search[id]) {
        options = null;
      } else {
        options = splitBy(props.discodata_query.search[id], ',');
      }
      if (where.type === 'multiple') {
        options = isArray(options) ? options?.filter((option) => option) : [];
        const conditions = [];
        if (options?.length) {
          options.forEach((option) => {
            let baseSql = where.sql;
            option && conditions.push(baseSql.replace(/:options/g, option));
          });
          where.sql = `(${conditions.join(' OR ')})`;
        } else {
          where.sql = null;
        }
      } else {
        where.sql = options ? where.sql.replace(/:options/g, options) : null;
      }
      if (!where.sql) delete sitesSourceQuery.whereStatements[id];
    });

    sitesSourceQuery.where = Object.entries(sitesSourceQuery.whereStatements)
      .map(([id, where]) => where.sql)
      .join(' AND ');
    if (
      sitesSourceQuery.where !== state.map.sitesSourceQuery.where ||
      locationTerm?.text ||
      siteTerm
    ) {
      let updateMapPosition = null;
      if (
        filterSource !== 'query_params' &&
        sitesSourceQuery.where === state.map.sitesSourceQuery.where &&
        !props.discodata_query.search.advancedFiltering
      ) {
        if (siteTerm) {
          updateMapPosition = 'bySiteTerm';
        } else if (locationTerm?.text) {
          updateMapPosition = 'byLocationTerm';
        }
      } else if (filterSource === 'query_params') {
        if (siteTerm) {
          updateMapPosition = 'bySiteTerm';
        }
      }
      if (
        sitesSourceQuery.where !== state.map.sitesSourceQuery.where ||
        updateMapPosition !== stateRef.current.updateMapPosition
      ) {
        setState({
          ...state,
          map: {
            ...state.map,
            sitesSourceQuery,
          },
          updateMapPosition,
          locationTerm,
          siteTerm,
        });
      }
    } else if (!firstFilteringDone.current) {
      firstFilteringDone.current = true;
    }
  }

  function makeMap() {
    if (document.getElementById('map')) {
      document.getElementById('map').innerHTML = '';
      const map = new Map({
        controls: draggable
          ? hasSidebar
            ? defaultsControls().extend([
                new ToggleSidebarControl.current(),
                new ViewYourAreaControl.current(),
              ])
            : defaultsControls().extend([new ViewYourAreaControl.current()])
          : [],
        interactions: draggable
          ? defaultsInteractions().extend([new DragRotateAndZoom()])
          : [],
        target: document.getElementById('map'),
        view: new View({
          center: fromLonLat([20, 50]),
          zoom: 4.5,
        }),
      });
      return map;
    }
    return false;
  }

  function makeTileLayer(url, visible, title) {
    const layer = new TileLayer({
      source: new XYZ({
        url,
      }),
      visible,
      title,
    });
    return layer;
  }

  function makeOverlay(element, className, positioning, stopEvent) {
    if (element) {
      return new Overlay({
        element,
        className,
        positioning,
        stopEvent,
      });
    }
    return false;
  }

  function getLocation(options) {
    if (
      stateRef.current.locationTerm?.text &&
      stateRef.current.locationTerm?.magicKey
    ) {
      axios
        .get(
          encodeURI(
            'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine=' +
              stateRef.current.locationTerm?.text +
              '&f=json&outSR={"wkid":102100,"latestWkid":3857}&outFields=Match_addr,Addr_type,StAddr,City&magicKey=' +
              stateRef.current.locationTerm?.magicKey +
              '&maxLocations=6',
          ),
        )
        .then((response) => {
          const data = JSON.parse(response.request.response) || {};
          if (data.error) {
            // setLoader(false);
          } else if (data.candidates?.length > 0) {
            stateRef.current.map.element
              .getView()
              .fit(
                [
                  data.candidates[0].extent.xmin,
                  data.candidates[0].extent.ymin,
                  data.candidates[0].extent.xmax,
                  data.candidates[0].extent.ymax,
                ],
                {
                  ...options,
                  callback: function () {},
                },
              );
            setTimeout(() => {
              stateRef?.current?.map?.sitesSourceLayer &&
                stateRef.current.map.sitesSourceLayer.getSource().refresh();
            }, options.duration + 100);
          }
        })
        .catch((error) => {});
    }
  }

  function getSiteTermLocation(options) {
    if (stateRef.current.siteTerm) {
      axios
        .get(
          encodeURI(
            `${settings.providerUrl}?query=SELECT DISTINCT * FROM [IED].[latest].[Browse3_4_infotable] WHERE site LIKE '%${stateRef.current.siteTerm}%' ORDER BY [reportingYear] DESC`,
          ),
        )
        .then((response) => {
          const data = JSON.parse(response.request.response);
          const item = data.results?.[0];
          if (item) {
            const x_3857 = item.x_3857;
            const y_3857 = item.y_3857;
            stateRef.current.map.element.getView().animate({
              center: [x_3857, y_3857],
              duration: filterSource !== 'query_params' ? 1000 : 0,
              zoom: 15,
            });
          }
          setTimeout(() => {
            stateRef?.current?.map?.sitesSourceLayer &&
              stateRef.current.map.sitesSourceLayer.getSource().refresh();
          }, 1100);
        })
        .catch((error) => {});
    }
  }

  function onSourceChange() {
    const options = {
      duration: 2000,
      maxZoom: 15,
    };
    if (stateRef.current.updateMapPosition === 'bySiteTerm') {
      getSiteTermLocation(options);
    }
    if (stateRef.current.updateMapPosition === 'byLocationTerm') {
      getLocation(options);
    }
    //  UPDATE OLD FILTERS
    if (
      stateRef.current.map.sitesSourceQuery.where !==
        stateRef.current.map.oldSitesSourceQuery.where ||
      stateRef.current.updateMapPosition !== null
    ) {
      setState({
        ...stateRef.current,
        map: {
          ...stateRef.current.map,
          oldSitesSourceQuery: {
            ...stateRef.current.map.sitesSourceQuery,
          },
        },
        updateMapPosition: null,
      });
    }
  }

  function centerPosition(map, position, zoom) {
    map.getView().animate({
      center: fromLonLat([position.coords.longitude, position.coords.latitude]),
      duration: 1000,
      zoom,
    });
  }

  function setFeatureInfo(map, pixel, coordinate, detailed) {
    let features = [];
    map.forEachFeatureAtPixel(pixel, function (feature) {
      features.push(feature);
    });
    if (features.length) {
      let hdms = toStringHDMS(
        toLonLat(features[0].getGeometry().flatCoordinates),
      );
      const featuresProperties = features[0].getProperties();
      if (
        detailed &&
        JSON.stringify(stateRef.current.popupDetails.properties) !==
          JSON.stringify(featuresProperties)
      ) {
        setState({
          ...stateRef.current,
          popupDetails: {
            ...stateRef.current.popupDetails,
            properties: {
              ...featuresProperties,
              hdms,
              flatCoordinates: features[0].getGeometry().flatCoordinates,
            },
          },
        });
      } else if (
        !detailed &&
        JSON.stringify(stateRef.current.popup.properties) !==
          JSON.stringify(featuresProperties)
      ) {
        setState({
          ...stateRef.current,
          popup: {
            ...stateRef.current.popup,
            properties: {
              ...featuresProperties,
              hdms,
              flatCoordinates: features[0].getGeometry().flatCoordinates,
            },
          },
        });
      }
      return true;
    }
    return false;
  }

  function displayPopup(map, pixel, coordinate, popup, detailed = false) {
    if (setFeatureInfo(map, pixel, coordinate, detailed)) {
      map.getTarget().style.cursor = 'pointer';
      popup.element.classList.add('show');
      popup.setPosition(coordinate);
    } else {
      map.getTarget().style.cursor = '';
      if (!detailed) {
        popup.element.classList.remove('show');
        popup.setPosition(undefined);
      }
    }
  }

  function renderMap() {
    //  MAP
    const map = makeMap();
    //  Layers
    let worldLightGrayBase, worldHillshade;
    //  Overlayers
    let popup, popupDetails, dynamicFilters;
    //  Features Formater
    let esrijsonFormat = new EsriJSON();
    //  Vector Layers
    let sitesSourceLayer, regionsSourceLayer;
    //  Vector Sources
    let sitesSource, regionsSource;
    //  Global variables
    let currentZoom;
    if (map) {
      /* ======== TILE LAYERS ======== */
      //  Make TileLayers
      worldLightGrayBase = makeTileLayer(
        'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        true,
        'World_Light_Gray_Base',
      );
      worldHillshade = makeTileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}',
        false,
        'World_Hillshade',
      );
      /* ======== OVERLAYS ======== */
      //  Make popups overlays
      if (hasPopups) {
        popup = makeOverlay(
          document.getElementById('popup'),
          'ol-overlay-container ol-popup',
          'center-center',
          true,
        );
        popupDetails = makeOverlay(
          document.getElementById('popup-details'),
          'ol-overlay-container ol-popup-details',
          'center-center',
          true,
        );
      }
      //  Make dynamic filters overlay
      if (hasSidebar) {
        const sideBar = document.createElement('div');
        sideBar.setAttribute('id', 'map-sidebar');
        dynamicFilters = makeOverlay(
          sideBar,
          'ol-dynamic-filter',
          'center-center',
          true,
        );
      }
      /* ======== SOURCES ======== */
      //  Make sites source
      let reqs = 0;
      sitesSource = new VectorSource({
        loader: function (extent, resolution, projection) {
          if (mounted.current && firstFilteringDone.current) {
            var url = `https://services.arcgis.com/LcQjj2sL7Txk9Lag/arcgis/rest/services/SiteMap_v2/FeatureServer/0/query/?f=json&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=${encodeURIComponent(
              '{"xmin":' +
                extent[0] +
                ',"ymin":' +
                extent[1] +
                ',"xmax":' +
                extent[2] +
                ',"ymax":' +
                extent[3] +
                ',"spatialReference":{"wkid":102100}}',
            )}&geometryType=esriGeometryEnvelope&inSR=102100&outFields=*&outSR=102100`;
            reqs++;
            jsonp(
              url,
              {
                param:
                  (stateRef.current.map.sitesSourceQuery.where
                    ? qs.stringify({
                        where: stateRef.current.map.sitesSourceQuery.where,
                      })
                    : '') + '&callback',
              },
              (error, response) => {
                reqs--;
                if (error) {
                  // setLoader(false);
                  console.log(error.message);
                } else {
                  var features = esrijsonFormat.readFeatures(response, {
                    featureProjection: projection,
                  });
                  if (features.length > 0) {
                    sitesSource.addFeatures(features);
                  } else {
                    // setLoader(false);
                  }
                  sitesSource.dispatchEvent(
                    new VectorSourceEvent('updateFilters'),
                  );
                }
              },
            );
          }
        },
        strategy: function (extent, resolution) {
          const tileGrid = createXYZ({
            tileSize: 512,
            maxZoom: zoomSwitch,
          });
          var z = tileGrid.getZForResolution(resolution);
          var tileRange = tileGrid.getTileRangeForExtentAndZ(extent, z);
          /** @type {Array<import("./extent.js").Extent>} */
          var extents = [];
          /** @type {import("./tilecoord.js").TileCoord} */
          var tileCoord = [z, 0, 0];
          for (
            tileCoord[1] = tileRange.minX;
            tileCoord[1] <= tileRange.maxX;
            ++tileCoord[1]
          ) {
            for (
              tileCoord[2] = tileRange.minY;
              tileCoord[2] <= tileRange.maxY;
              ++tileCoord[2]
            ) {
              extents.push(tileGrid.getTileCoordExtent(tileCoord));
            }
          }
          return extents;
        },
      });
      //  Make regions source layer
      if (hasRegionsFeatures) {
        regionsSource = new VectorSource({
          loader: function (extent, resolution, projection) {
            var url = `https://services.arcgis.com/LcQjj2sL7Txk9Lag/ArcGIS/rest/services/ly_IED_SiteClusters_WM/FeatureServer/0/query/?f=json&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=${encodeURIComponent(
              '{"xmin":' +
                extent[0] +
                ',"ymin":' +
                extent[1] +
                ',"xmax":' +
                extent[2] +
                ',"ymax":' +
                extent[3] +
                ',"spatialReference":{"wkid":102100}}',
            )}&geometryType=esriGeometryEnvelope&inSR=102100&outFields=*&outSR=102100`;
            jsonp(url, null, (error, response) => {
              if (error) {
                console.log(error.message);
              } else {
                var features = esrijsonFormat.readFeatures(response, {
                  featureProjection: projection,
                });
                if (features.length > 0) {
                  regionsSource.addFeatures(features);
                }
              }
            });
          },
          strategy: tile(
            createXYZ({
              tileSize: 512,
            }),
          ),
        });
      }
      /* ======== SOURCE LAYERS ======== */
      //  Sites source layer
      sitesSourceLayer = new VectorLayer({
        source: sitesSource,
        style: new Style({
          image: new CircleStyle({
            radius: 3,
            fill: new Fill({ color: '#000' }),
            stroke: new Stroke({ color: '#6A6A6A', width: 1 }),
            zIndex: 0,
          }),
        }),
        // style: (feature, resolution) => {
        //   const featureProperties = feature.getProperties();
        //   if (
        //     featureProperties.siteName === siteTermRef.current ||
        //     (SVG_COLLECTION[featureProperties.eea_activities]?.() &&
        //       stateRef.current.map.element?.getView?.()?.getZoom?.() > 11)
        //   ) {
        //     return new Style({
        //       image: new Icon({
        //         src:
        //           featureProperties.siteName === siteTermRef.current
        //             ? `data:image/svg+xml;utf8,${encodeURIComponent(
        //                 pinSVG('#50C878'),
        //               )}`
        //             : `data:image/svg+xml;utf8,${encodeURIComponent(
        //                 SVG_COLLECTION[featureProperties.eea_activities](),
        //               )}`,
        //         opacity: 1,
        //         scale: 1,
        //       }),
        //       zIndex:
        //         featureProperties.siteName === siteTermRef.current ? 1 : 0,
        //     });
        //   } else {
        //     return new Style({
        //       image: new CircleStyle({
        //         radius: 3,
        //         fill:
        //           featureProperties.siteName === siteTermRef.current
        //             ? new Fill({ color: '#50C878' })
        //             : new Fill({ color: '#000' }),
        //         stroke:
        //           featureProperties.siteName === siteTermRef.current
        //             ? new Stroke({ color: '#6A6A6A', width: 1 })
        //             : new Stroke({ color: '#6A6A6A', width: 1 }),
        //         zIndex:
        //           featureProperties.siteName === siteTermRef.current ? 1 : 0,
        //       }),
        //     });
        //   }
        // },
        visible: true,
        title: 'ly_IED_SiteMap_WM',
      });
      //  Regions source layer
      if (hasRegionsFeatures) {
        regionsSourceLayer = new VectorLayer({
          source: regionsSource,
          style: new Style({
            image: new CircleStyle({
              radius: 3,
              fill: new Fill({ color: '#4296B2' }),
              stroke: new Stroke({ color: '#6A6A6A', width: 1 }),
            }),
          }),
          visible: true,
          title: 'ly_IED_SiteClusters_WM',
        });
      }
      /* ======== APPEND TO THE MAP ======== */
      //  Append TileLayers to the map
      map.addLayer(
        new Group({
          layers: [worldLightGrayBase, worldHillshade],
        }),
      );
      popupDetails && map.addOverlay(popupDetails);
      //  Append dynamic filters to the map
      dynamicFilters && map.addOverlay(dynamicFilters);
      dynamicFilters && dynamicFilters.setPosition([0, 0]);
      //  Append popups to the map
      popup && map.addOverlay(popup);
      //  Append source layers to the map
      map.addLayer(
        new Group({
          layers: hasRegionsFeatures
            ? [sitesSourceLayer, regionsSourceLayer]
            : [sitesSourceLayer],
        }),
      );
      //  Center by user location
      if (navigator.geolocation && filterSource !== 'query_params') {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            return centerPosition(map, position, 12);
          },
          (error) => {
            console.log(error);
          },
        );
      }
      //  Events
      sitesSource.on('updateFilters', function (e) {
        if (!reqs && e.target.getState() === 'ready') {
          onSourceChange();
        }
      });
      if (hasPopups) {
        map.on('pointermove', function (evt) {
          if (evt.dragging) {
            return;
          }
          const pixel = map.getEventPixel(evt.originalEvent);
          displayPopup(map, pixel, evt.coordinate, popup);
        });
        map.on('click', function (evt) {
          let newZoom = map.getView().getZoom();
          if (newZoom > zoomSwitch) {
            displayPopup(map, evt.pixel, evt.coordinate, popupDetails, true);
          }
        });
      }
      map.on('moveend', function (e) {
        if (mounted.current) {
          if (hasSidebar && document.getElementById('dynamic-filter')) {
            const closestFeature = stateRef.current.map.sitesSourceLayer
              ?.getSource?.()
              ?.getClosestFeatureToCoordinate?.(
                stateRef.current.map.element?.getView?.()?.getCenter?.(),
              );
            document.getElementById('dynamic-filter').dispatchEvent(
              new CustomEvent('featurechange', {
                detail: {
                  feature: closestFeature,
                },
              }),
            );
          }
          let newZoom = map.getView().getZoom();
          if (currentZoom !== newZoom) {
            if (newZoom > zoomSwitch) {
              sitesSourceLayer.setVisible(true);
              hasRegionsFeatures && regionsSourceLayer.setVisible(false);
            } else if (newZoom > 2) {
              sitesSourceLayer.setVisible(false);
              hasRegionsFeatures && regionsSourceLayer.setVisible(true);
            } else {
              sitesSourceLayer.setVisible(false);
              hasRegionsFeatures && regionsSourceLayer.setVisible(false);
            }
            currentZoom = newZoom;
          }
        }
      });
      setState({
        ...stateRef.current,
        map: {
          ...stateRef.current.map,
          element: map,
          sitesSourceLayer,
        },
        popup: {
          ...stateRef.current.popup,
          element: popup,
        },
        popupDetails: {
          ...stateRef.current.popupDetails,
          element: popupDetails,
        },
      });
    }
  }

  const setSiteQueryParams = () => {
    axios
      .get(
        encodeURI(
          `${settings.providerUrl}?query=SELECT DISTINCT siteId, siteInspireId FROM [IED].[latest].[FacilitiesPerSite] WHERE siteId = '${state.popupDetails.properties.id}'`,
        ),
      )
      .then((response) => {
        const data = JSON.parse(response.request.response);
        props.setQueryParam({
          queryParam: {
            siteInspireId: data.results[0].siteInspireId,
            siteId: state.popupDetails.properties.id,
            siteName: state.popupDetails.properties.siteName,
            siteReportingYear:
              state.popupDetails.properties.Site_reporting_year,
          },
        });
      })
      .catch((error) => {});
  };
  if (!__CLIENT__) return '';
  return (
    <div className="openlayer-map-container">
      {props.mode === 'edit' ? <p>Openlayer map</p> : ''}
      <div id="map" className="map" />
      <div id="popup" className="popup">
        {state.popup.element && (
          <>
            <div className="popover-header">
              {currentMapZoom && currentMapZoom > zoomSwitch ? (
                <Header as="h3">{state.popup.properties.siteName}</Header>
              ) : (
                <Header as="h3">{`${state.popup.properties.NUTS_NAME}, ${state.popup.properties.CNTR_CODE}, ${state.popup.properties.COUNTRY}`}</Header>
              )}
            </div>
            <div className="popover-body">
              <Grid.Column stretched>
                {currentMapZoom && currentMapZoom > zoomSwitch ? (
                  ''
                ) : (
                  <Grid.Row>
                    <p>
                      Number of sites:{' '}
                      <code>{state.popup.properties.num_sites}</code>
                    </p>
                  </Grid.Row>
                )}
                {/* HDMS */}
                <Grid.Row>
                  {state.popup.properties.hdms ? (
                    <>
                      <p className="mb-1">The location you are viewing is:</p>
                      <code>{state.popup.properties.hdms}</code>
                    </>
                  ) : (
                    ''
                  )}
                </Grid.Row>
              </Grid.Column>
            </div>
          </>
        )}
      </div>
      <div id="popup-details" className="popup">
        {state.popupDetails.element && (
          <>
            <div className="popover-header">
              <Header as="h2">
                {state.popupDetails.properties.siteName
                  ? state.popupDetails.properties.siteName
                  : ''}
              </Header>
              <VoltoIcon
                onClick={() =>
                  state.popupDetails.element.setPosition(undefined)
                }
                name={clearSVG}
                size="2em"
              />
            </div>
            <div className="popover-body">
              <div className="grid-layout">
                {/* SITE CONTENTS */}
                <div className="row mb-1-super mt-0-super">
                  <div className="column column-12">
                    <Header as="h3">Site contents</Header>
                  </div>
                  <div className="column  column-12">
                    <p>
                      <Link
                        as="a"
                        className={
                          !state.popupDetails.properties.nFacilities
                            ? 'disabled-link'
                            : ''
                        }
                        onClick={setSiteQueryParams}
                        to={
                          '/industrial-site/pollutant-releases-and-transfers/site-overview'
                        }
                      >
                        {state.popupDetails.properties.nFacilities || 0}{' '}
                        Facilities
                      </Link>
                    </p>
                  </div>
                  <div className="column  column-12">
                    <p>
                      <Link
                        as="a"
                        className={
                          !state.popupDetails.properties.nLCP
                            ? 'disabled-link'
                            : ''
                        }
                        onClick={setSiteQueryParams}
                        to={'/industrial-site/large-scale-fuel-combustion'}
                      >
                        {state.popupDetails.properties.nLCP || 0} Large
                        combustion plants
                      </Link>
                    </p>
                  </div>
                  <div className="column  column-12">
                    <p>
                      <Link
                        as="a"
                        className={
                          !state.popupDetails.properties.nInstallations
                            ? 'disabled-link'
                            : ''
                        }
                        onClick={setSiteQueryParams}
                        to={
                          '/industrial-site/regulatory-information/site-overview'
                        }
                      >
                        {state.popupDetails.properties.nInstallations || 0}{' '}
                        Installations
                      </Link>
                    </p>
                  </div>
                </div>
                {/* SITE POLLUTANT EMISSIONS */}
                <div className="row mb-1-super mt-0-super">
                  <div className="column  column-12">
                    <Header as="h3">Pollutant emissions</Header>
                  </div>
                  <div className="column  column-12 description">
                    {state.popupDetails.properties.pollutants ? (
                      <p>
                        {state.popupDetails.properties.pollutants}
                        {/* {state.popupDetails.properties.pollutants.substring(
                          0,
                          256,
                        )}
                        {state.popupDetails.properties.pollutants.length > 256
                          ? '...'
                          : ''} */}
                      </p>
                    ) : (
                      <p>There are no data regarding the pollutants</p>
                    )}
                  </div>
                </div>
                {/* REGULATORY INFORMATION */}
                <div className="row mb-1-super mt-0-super">
                  <div className="column  column-12">
                    <Header as="h3">Regulatory information</Header>
                  </div>
                  <div className="column  column-12">
                    {state.popupDetails.properties.Site_reporting_year ? (
                      <p>
                        Inspections in{' '}
                        {state.popupDetails.properties.Site_reporting_year}:{' '}
                        {state.popupDetails.properties.numInspections || 0}
                      </p>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="popover-actions">
              <button
                onClick={() => {
                  setSiteQueryParams();
                  history.push('/industrial-site');
                }}
                className="solid dark-blue"
              >
                Site Details
              </button>
            </div>
          </>
        )}
      </div>
      <Dimmer id="map-loader" active={loader}>
        <Loader />
      </Dimmer>
      <Portal node={document.getElementById('map-view-your-area-button')}>
        <div id="view-your-area" className="ol-unselectable ol-control">
          <button
            className="toggle-button"
            onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    return centerPosition(state.map.element, position, 12);
                  },
                  (error) => {
                    console.log(error);
                  },
                  { timeout: 10000 },
                );
              }
            }}
          >
            <VoltoIcon name={navigationSVG} size="1em" fill="white" />
          </button>
        </div>
      </Portal>
    </div>
  );
};

export default compose(
  connect(
    (state, props) => ({
      query: state.router.location.search,
      content:
        state.prefetch?.[state.router.location.pathname] || state.content.data,
      discodata_query: state.discodata_query,
    }),
    {
      setQueryParam,
    },
  ),
)(OpenlayersMapView);
