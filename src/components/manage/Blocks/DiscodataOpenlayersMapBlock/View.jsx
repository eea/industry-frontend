/* REACT */
import React, { useState, useRef, useEffect } from 'react';
import cookie from 'react-cookie';
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
import PrivacyProtection from './PrivacyProtection';
// VOLTO-DATABLOCKS
import { setQueryParam } from 'volto-datablocks/actions';
// SEMANTIC REACT UI
import { Grid, Header, Loader, Dimmer, Image } from 'semantic-ui-react';
// SVGs
import clearSVG from '@plone/volto/icons/clear.svg';
import navigationSVG from '@plone/volto/icons/navigation.svg';
import mapPlaceholder from '~/components/manage/Blocks/DiscodataOpenlayersMapBlock/map_placeholder.png';
// STYLES
import 'ol/ol.css';
import './style.css';

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

const key = (domain_key) => `accept-${domain_key}`;

const canShow = (domain_key) => {
  return cookie.load(key(domain_key)) === 'true';
};

let Map,
  View,
  Overlay,
  EsriJSON,
  VectorSource,
  VectorSourceEvent,
  XYZ,
  fromLonLat,
  toLonLat,
  toStringHDMS,
  createXYZ,
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

const OpenlayersMapView = (props) => {
  const stateRef = useRef({
    map: {
      element: null,
      sitesSourceQuery: { whereStatements: {}, where: '' },
      oldSitesSourceQuery: { whereStatements: {}, where: '' },
      sitesSourceLayer: null,
      regionsSourceLayer: null,
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
      regionsSourceLayer: null,
    },
    popup: { element: null, properties: {} },
    popupDetails: { element: null, properties: {} },
    locationTerm: null,
    siteTerm: null,
    updateMapPosition: null,
  });
  const [selectedSite, setSelectedSite] = useState(null);
  const [loader, setLoader] = useState(false);
  const [mapRendered, setMapRendered] = useState(false);
  const [firstFilteringUpdate, setFirstFilteringUpdate] = useState(false);
  const [prepareMapRender, setPrepareMapRender] = useState(false);
  const selectedSiteRef = useRef(null);
  const selectedSiteCoordinates = useRef(null);
  const regionsSourceWhere = useRef('');
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
    ? state.map.element?.getView().getZoom()
    : null;
  const dataprotection = {
    enabled: true,
    privacy_statement:
      'This map is hosted by a third party [Environmental Systems Research Institute, INC: "ESRI"]. By showing th external content you accept the terms and conditions of www.esri.com. This includes their cookie policies, which e have no control over.',
    privacy_cookie_key: 'map',
    placeholder_image: mapPlaceholder,
    type: props.data.privacy?.value || 'big',
  };

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
        XYZ = require('ol/source/XYZ').default;
        fromLonLat = require('ol/proj').fromLonLat;
        toLonLat = require('ol/proj').toLonLat;
        toStringHDMS = require('ol/coordinate').toStringHDMS;
        createXYZ = require('ol/tilegrid').createXYZ;
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
      if (
        canShow(dataprotection.privacy_cookie_key) &&
        document.getElementById('map')
      ) {
        renderMap();
        setMapRendered(true);
      }
    }
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
    /* eslint-disable-next-line */
  }, [])

  useEffect(() => {
    if (selectedSite && mapRendered) {
      selectedSiteRef.current = selectedSite;
      selectedSite.setStyle(
        new Style({
          image: new CircleStyle({
            radius: 3,
            fill: new Fill({ color: '#00FF00' }),
            stroke: new Stroke({ color: '#6A6A6A', width: 1 }),
            zIndex: 1,
          }),
        }),
      );
    }
    /* eslint-disable-next-line */
  }, [selectedSite]);

  useEffect(() => {
    siteTermRef.current = siteTerm;
  }, [siteTerm]);

  useEffect(() => {
    if (mapRendered) {
      updateFilters();
      updateRegionsFilters();
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
    if (mapRendered && stateRef.current.map.element) {
      if (['byLocationTerm', 'bySiteTerm'].includes(state.updateMapPosition)) {
        onSourceChange();
      } else if (['byAdvancedFilters'].includes(state.updateMapPosition)) {
        onSourceChange();
        if (!state.map.sitesSourceLayer.getVisible()) {
          state.map.sitesSourceLayer.setVisible(true);
        }
        if (hasRegionsFeatures && state.map.regionsSourceLayer.getVisible()) {
          state.map.regionsSourceLayer.setVisible(false);
        }
        state.map.sitesSourceLayer &&
          state.map.sitesSourceLayer.getSource().refresh();
      }
      if (!firstFilteringDone.current) {
        firstFilteringDone.current = true;
      }
      if (!state.updateMapPosition && !state.map.sitesSourceQuery.where) {
        applyZoom();
      }
    }
    /* eslint-disable-next-line */
  }, [state.map.sitesSourceQuery?.where, state.updateMapPosition])

  useEffect(() => {
    if (!mapRendered && prepareMapRender && document.getElementById('map')) {
      renderMap();
      setMapRendered(true);
    }
  }, [prepareMapRender]);

  if (mapRendered && !firstFilteringUpdate) {
    updateFilters();
    updateRegionsFilters();
    setFirstFilteringUpdate(true);
  }

  function updateRegionsFilters() {
    const baseSql = `(CNTR_CODE LIKE '%:options%')`;
    const countries =
      props.discodata_query.search.siteCountry?.filter((country) => country) ||
      [];
    const newRegionsSourceWhere =
      countries.length > 0
        ? `(${countries
            .map((country) => baseSql.replace(':options', country))
            .join(' OR ')})`
        : '';
    if (
      hasRegionsFeatures &&
      newRegionsSourceWhere !== regionsSourceWhere.current
    ) {
      regionsSourceWhere.current = newRegionsSourceWhere;
      state.map.regionsSourceLayer.getSource().refresh();
    }
  }

  function updateFilters() {
    const sitesSourceQuery = { ...state.map.sitesSourceQuery };
    let updateMapPosition = null;
    if (hasSidebar && filterSource === 'eprtr_filters') {
      sitesSourceQuery.whereStatements = {
        ...sitesSourceQuery.whereStatements,
        siteTerm: {
          sql: `(siteName LIKE '%:options%')`,
          type: 'string',
        },
        // Industries
        EEAActivity: {
          sql: `(eea_activities LIKE '%:options%')`,
          type: 'multiple',
        },
        // Country / Region / Provinces
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

    if (filterSource !== 'query_params') {
      if (
        props.discodata_query.search.advancedFiltering &&
        props.discodata_query.search.nuts_latest?.length > 0
      ) {
        updateMapPosition = 'byAdvancedFilters';
      } else {
        if (!siteTerm && !locationTerm?.text) {
          updateMapPosition = 'byAdvancedFilters';
        } else if (siteTerm) {
          updateMapPosition = 'bySiteTerm';
        } else if (locationTerm?.text) {
          updateMapPosition = 'byLocationTerm';
        }
      }
    } else if (siteTerm) {
      updateMapPosition = 'bySiteTerm';
    }

    if (updateMapPosition) {
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

  function applyZoom() {
    if (stateRef.current.map && stateRef.current.map.element) {
      const newZoom = stateRef.current.map.element.getView().getZoom();
      if (
        newZoom > zoomSwitch ||
        stateRef.current.map.sitesSourceQuery?.where
      ) {
        // if (!stateRef.current.map.sitesSourceLayer.getVisible()) {
        //   stateRef.current.map.sitesSourceLayer.getSource().refresh();
        // }
        stateRef.current.map.sitesSourceLayer.setVisible(true);
        hasRegionsFeatures &&
          stateRef.current.map.regionsSourceLayer.setVisible(false);
      } else if (newZoom > 2) {
        stateRef.current.map.sitesSourceLayer.setVisible(false);
        // if (!stateRef.current.map.regionsSourceLayer.getVisible()) {
        //   stateRef.current.map.regionsSourceLayer.getSource().refresh();
        // }
        hasRegionsFeatures &&
          stateRef.current.map.regionsSourceLayer.setVisible(true);
      } else {
        stateRef.current.map.sitesSourceLayer.setVisible(false);
        hasRegionsFeatures &&
          stateRef.current.map.regionsSourceLayer.setVisible(false);
      }
    }
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
            `${settings.providerUrl}?query=SELECT shape_wm.STX as x, shape_wm.STY as y, Site_reporting_year from [IED].[latest].[SiteMap] WHERE siteName LIKE '%${stateRef.current.siteTerm}%' ORDER BY [Site_reporting_year] DESC`,
          ),
        )
        .then((response) => {
          const data = JSON.parse(response.request.response);
          const item = data.results?.[0];
          selectedSiteCoordinates.current = [item.x, item.y];
          if (item && item.x && item.y) {
            stateRef.current.map.sitesSourceLayer.getSource().refresh();
            stateRef.current.map.element.getView().animate({
              center: selectedSiteCoordinates.current,
              duration: filterSource !== 'query_params' ? 1000 : 0,
              zoom: 15,
            });
          }
        })
        .catch((error) => {});
    }
  }

  function getLocationByAdvancedFilters(options) {
    axios
      .get(
        encodeURI(
          `${settings.providerUrl}?query=SELECT
            MIN(shape_wm.STX) AS MIN_X,
            MIN(shape_wm.STY) AS MIN_Y,
            MAX(shape_wm.STX) AS MAX_X,
            MAX(shape_wm.STY) AS MAX_Y
        FROM [IED].[latest].[SiteMap]
        ${
          stateRef.current.map.sitesSourceQuery.where
            ? 'WHERE ' + stateRef.current.map.sitesSourceQuery.where
            : ''
        }`,
        ),
      )
      .then((response) => {
        const data = JSON.parse(response.request.response);
        const extent = data.results?.[0];
        if (
          stateRef.current.map.sitesSourceQuery?.where &&
          stateRef.current.map.sitesSourceQuery?.where.includes(
            'nuts_regions',
          ) &&
          extent.MIN_X &&
          extent.MIN_Y &&
          extent.MAX_X &&
          extent.MAX_Y
        ) {
          stateRef.current.map.element
            .getView()
            .fit([extent.MIN_X, extent.MIN_Y, extent.MAX_X, extent.MAX_Y], {
              maxZoom: 15,
            });
        }
      })
      .catch((error) => {});
  }

  function onSourceChange() {
    const options = {
      duration: 2000,
      maxZoom: 15,
    };
    if (stateRef.current.updateMapPosition === 'bySiteTerm') {
      stateRef.current.map.element.getView().cancelAnimations();
      getSiteTermLocation(options);
    }
    if (stateRef.current.updateMapPosition === 'byLocationTerm') {
      stateRef.current.map.element.getView().cancelAnimations();
      setSelectedSite(null);
      getLocation(options);
    }
    if (stateRef.current.updateMapPosition === 'byAdvancedFilters') {
      stateRef.current.map.element.getView().cancelAnimations();
      setSelectedSite(null);
      getLocationByAdvancedFilters(options);
    }
    //  UPDATE OLD FILTERS
    if (stateRef.current.updateMapPosition !== null) {
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
      if (!detailed) {
        map.getTarget().style.cursor = 'pointer';
      }
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
            var url = `https://services.arcgis.com/LcQjj2sL7Txk9Lag/arcgis/rest/services/SiteMap/FeatureServer/0/query/?f=json&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=${encodeURIComponent(
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

            if (
              stateRef.current.map.sitesSourceQuery?.where &&
              stateRef.current.map.sitesSourceQuery?.where.includes(
                'nuts_regions',
              )
            ) {
              url =
                'https://services.arcgis.com/LcQjj2sL7Txk9Lag/arcgis/rest/services/SiteMap/FeatureServer/0/query/?f=json&' +
                'returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometryType=esriGeometryEnvelope&inSR=102100&outFields=*' +
                '&outSR=102100';
            }
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
                  }
                  sitesSource.dispatchEvent(
                    new VectorSourceEvent('updateClosestFeature'),
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
            jsonp(
              url,
              {
                param:
                  (regionsSourceWhere.current
                    ? qs.stringify({
                        where: regionsSourceWhere.current,
                      })
                    : '') + '&callback',
              },
              (error, response) => {
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
              },
            );
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
        visible: true,
        title: 'ly_IED_SiteMap_WM',
      });
      //  Regions source layerq
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
      if (
        navigator.geolocation &&
        filterSource !== 'query_params' &&
        !stateRef.current.updateMapPosition
      ) {
        const extent = props.discodata_query.search?.mapExtent;
        if (!extent) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              return centerPosition(map, position, 12);
            },
            (error) => {
              console.log(error);
            },
          );
        } else {
          map.getView().fit([extent[0], extent[1], extent[2], extent[3]]);
        }
      }
      //  Events
      sitesSource.on('updateClosestFeature', function (e) {
        if (!reqs && e.target.getState() === 'ready') {
          if (selectedSiteCoordinates.current) {
            const closestFeature = sitesSource.getClosestFeatureToCoordinate(
              selectedSiteCoordinates.current,
            );
            setSelectedSite(closestFeature);
            selectedSiteCoordinates.current = null;
          }
        }
      });

      if (hasPopups) {
        if (document && document.documentElement?.clientWidth > 500) {
          map.on('pointermove', function (evt) {
            if (evt.dragging) {
              return;
            }
            const pixel = map.getEventPixel(evt.originalEvent);
            displayPopup(map, pixel, evt.coordinate, popup);
          });
        }
        map.on('click', function (evt) {
          let newZoom = map.getView().getZoom();
          if (newZoom > zoomSwitch) {
            displayPopup(map, evt.pixel, evt.coordinate, popupDetails, true);
          }
        });
      }

      map.once('postrender', function (event) {
        sitesSourceLayer.getSource().refresh();
      });

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
            applyZoom();
            currentZoom = newZoom;
          }
          if (filterSource !== 'query_params') {
            props.setQueryParam({
              queryParam: {
                extent: map.getView().calculateExtent(map.getSize()),
                mapExtent: map.getView().calculateExtent(map.getSize()),
              },
            });
          }
        }
      });
      setState({
        ...stateRef.current,
        map: {
          ...stateRef.current.map,
          element: map,
          sitesSourceLayer,
          regionsSourceLayer: hasRegionsFeatures ? regionsSourceLayer : null,
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

  const view = (
    <>
      <div id="map" className="map" />
      <div id="popup" className="popup">
        {state.popup.element && (
          <>
            <div className="popover-header">
              {state.popup.properties.siteName ? (
                <Header as="h3">{state.popup.properties.siteName}</Header>
              ) : state.popup.properties.NUTS_NAME &&
                state.popup.properties.CNTR_CODE &&
                state.popup.properties.COUNTRY ? (
                <Header as="h3">{`${state.popup.properties.NUTS_NAME}, ${state.popup.properties.CNTR_CODE}, ${state.popup.properties.COUNTRY}`}</Header>
              ) : (
                ''
              )}
            </div>
            <div className="popover-body">
              <Grid.Column stretched>
                {!state.popup.properties.num_sites ? (
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
      {document.getElementById('map-view-your-area-button') ? (
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
      ) : (
        ''
      )}
    </>
  );

  return (
    <div className="openlayer-map-container">
      {props.mode === 'edit' ? <p>Openlayer map</p> : ''}
      {canShow(dataprotection.privacy_cookie_key) ? (
        view
      ) : (
        <PrivacyProtection
          onShow={() => {
            setPrepareMapRender(true);
          }}
          data={{ dataprotection }}
          style={{
            backgroundImage: `url(${mapPlaceholder})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}
        >
          {view}
        </PrivacyProtection>
      )}
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
