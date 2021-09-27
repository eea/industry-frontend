import React, { useState, useRef } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import jsonp from 'jsonp';
import qs from 'querystring';
import { Grid, Header } from 'semantic-ui-react';
import { toast } from 'react-toastify';
import config from '@plone/volto/registry';
import { Icon, Toast, UniversalLink } from '@plone/volto/components';
import { Map } from '@eeacms/volto-openlayers-map/Map';
import { Interactions } from '@eeacms/volto-openlayers-map/Interactions';
import { Overlays } from '@eeacms/volto-openlayers-map/Overlays';
import { Controls, Control } from '@eeacms/volto-openlayers-map/Controls';
import { Layers, Layer } from '@eeacms/volto-openlayers-map/Layers';
import { openlayers } from '@eeacms/volto-openlayers-map';
import { setQueryParam } from '@eeacms/volto-datablocks/actions';
import PrivacyProtection from '../PrivacyProtection';
import { getEncodedQueryString } from '~/utils';
import {
  getSitesUrl,
  getLayerBase,
  getWhereStatement,
  getRegionsWhereStatement,
} from './index';

import clearSVG from '@plone/volto/icons/clear.svg';
import navigationSVG from '@plone/volto/icons/navigation.svg';
import mapPlaceholder from '../PrivacyProtection/map_placeholder.png';

import './style.css';

let _REQS = 0;
const zoomSwitch = 6;

// const PopupDetails = ({ data }) => {
//   const countFactypeEprtr = data.count_factype_EPRTR;
//   const countFactypeNonEprtr = data.count_factype_NONEPRTR;
//   const countInstypeIed = data.count_instype_IED;
//   const countInstypeNonIed = data.count_instype_NONIED;
//   const countPlantypeLcp = data.count_plantType_LCP;
//   const countPlantypeCoWi = data.count_plantType_coWI;
//   const countPlantypeWi = data.count_plantType_WI;

//   return (
//     <div className="grid-layout">
//       {/* SITE CONTENTS */}
//       {data.nFacilities || data.nInstallations || data.nLCP ? (
//         <div className="row mb-1-super mt-0-super">
//           <div className="column column-12">
//             <Header as="h3">Site contents</Header>
//           </div>
//           {countFactypeEprtr ? (
//             <div className="column  column-12">
//               <p>
//                 {`${countFactypeEprtr} ${
//                   countFactypeEprtr === 1
//                     ? 'EPRTR Facility'
//                     : 'EPRTR Facilities'
//                 }`}
//               </p>
//             </div>
//           ) : (
//             ''
//           )}
//           {countFactypeNonEprtr ? (
//             <div className="column  column-12">
//               <p>
//                 {`${countFactypeNonEprtr} ${
//                   countFactypeNonEprtr === 1
//                     ? 'NON-EPRTR Facility'
//                     : 'NON-EPRTR Facilities'
//                 }`}
//               </p>
//             </div>
//           ) : (
//             ''
//           )}

//           {countInstypeIed ? (
//             <div className="column  column-12">
//               <p>
//                 {`${countInstypeIed} ${
//                   countInstypeIed === 1
//                     ? 'IED Installation'
//                     : 'IED Installations'
//                 }`}
//               </p>
//             </div>
//           ) : (
//             ''
//           )}

//           {countInstypeNonIed ? (
//             <div className="column  column-12">
//               <p>
//                 {`${countInstypeNonIed} ${
//                   countInstypeNonIed === 1
//                     ? 'NON-IED Installation'
//                     : 'NON-IED Installations'
//                 }`}
//               </p>
//             </div>
//           ) : (
//             ''
//           )}

//           {countPlantypeLcp ? (
//             <div className="column  column-12">
//               <p>
//                 {`${countPlantypeLcp} ${
//                   countPlantypeLcp === 1
//                     ? 'Large combustion plant'
//                     : 'Large combustion plants'
//                 }`}
//               </p>
//             </div>
//           ) : (
//             ''
//           )}

//           {countPlantypeCoWi ? (
//             <div className="column  column-12">
//               <p>
//                 {`${countPlantypeCoWi} ${
//                   countPlantypeCoWi === 1
//                     ? 'Co-waste incinerator'
//                     : 'Large combustion plants'
//                 }`}
//               </p>
//             </div>
//           ) : (
//             ''
//           )}

//           {countPlantypeWi ? (
//             <div className="column  column-12">
//               <p>
//                 {`${countPlantypeWi} ${
//                   countPlantypeWi === 1
//                     ? 'Co-waste incinerator'
//                     : 'Co-waste incinerator'
//                 }`}
//               </p>
//             </div>
//           ) : (
//             ''
//           )}
//         </div>
//       ) : (
//         ''
//       )}

//       {/* SITE POLLUTANT EMISSIONS */}
//       <div className="row mb-1-super mt-0-super">
//         <div className="column  column-12">
//           <Header as="h3">Pollutant emissions</Header>
//         </div>
//         <div className="column  column-12 description">
//           {data.pollutants ? (
//             <p>{data.pollutants}</p>
//           ) : (
//             <p>There are no data regarding the pollutants</p>
//           )}
//         </div>
//       </div>
//       {/* REGULATORY INFORMATION */}
//       <div className="row mb-1-super mt-0-super">
//         <div className="column  column-12">
//           <Header as="h3">Regulatory information</Header>
//         </div>
//         <div className="column  column-12">
//           {data.Site_reporting_year ? (
//             <p>
//               Inspections in {data.Site_reporting_year}:{' '}
//               {data.numInspections || 0}
//             </p>
//           ) : (
//             ''
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

const View = (props) => {
  const map = useRef();
  const popup = useRef();
  const popupDetails = useRef();
  const sitesLayer = useRef();
  const regionsLayer = useRef();
  const whereStatement = useRef();
  const prevWhereStatement = useRef();
  const regionsWhereStatement = useRef();
  const discodataQuery = useRef();
  const [popupData, setPopupData] = useState();
  const [popupDetailsData, setPopupDetailsData] = useState();
  const [mapRendered, setMapRendered] = useState(false);
  const [firstFit, setFirstFit] = useState(true);
  const [loading, setLoading] = useState(false);
  const {
    coordinate,
    format,
    loadingstrategy,
    proj,
    source,
    style,
    tilegrid,
  } = openlayers;
  const { discodata_query } = props;

  const dataprotection = {
    enabled: true,
    privacy_statement:
      'This map is hosted by a third party [Environmental Systems Research Institute, INC: "ESRI"]. By showing th external content you accept the terms and conditions of www.esri.com. This includes their cookie policies, which e have no control over.',
    privacy_cookie_key: 'site-location-map',
    placeholder_image: mapPlaceholder,
    type: 'big',
  };

  const db_version =
    process.env.RAZZLE_DB_VERSION || config.settings.db_version || 'latest';

  React.useEffect(() => {
    if (mapRendered && firstFit) {
      centerToUserLocation();
      setTimeout(() => {
        setFirstFit(false);
      }, 1000);
    }
    /* eslint-disable-next-line */
  }, [mapRendered]);

  React.useEffect(() => {
    // let extent = openlayers.extent.createEmpty();
    if (!sitesLayer.current) return;
    async function updateMap() {
      let positionUpdating = false;
      const where = getWhereStatement(discodata_query);
      const regionWhere = getRegionsWhereStatement(discodata_query);
      const countriesLocations = [];
      const countries = discodata_query.siteCountryNames.filter(
        (country) =>
          discodata_query.siteCountry &&
          discodata_query.siteCountry?.indexOf(country.siteCountry) !== -1,
      );
      prevWhereStatement.current = whereStatement.current;
      whereStatement.current = where;
      regionsWhereStatement.current = regionWhere;
      discodataQuery.current = { ...discodata_query };
      if (!discodata_query.locationTerm) {
        clearSource();
      }
      if (
        discodata_query.locationTerm?.text &&
        discodata_query.locationTerm?.magicKey
      ) {
        const response = await fetch(
          encodeURI(
            'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine=' +
              discodata_query.locationTerm.text +
              '&f=json&outSR={"wkid":102100,"latestWkid":3857}&outFields=Match_addr,Addr_type,StAddr,City&magicKey=' +
              discodata_query.locationTerm.magicKey +
              '&maxLocations=6',
          ),
        );
        const data = await response.json();
        if (data.candidates?.length > 0) {
          map.current
            .getView()
            .fit(
              [
                data.candidates[0].extent.xmin,
                data.candidates[0].extent.ymin,
                data.candidates[0].extent.xmax,
                data.candidates[0].extent.ymax,
              ],
              {
                maxZoom: 16,
                duration: 1000,
              },
            );
        }
      } else if (
        !discodata_query.siteTerm &&
        !discodata_query.locationTerm &&
        countries.length &&
        discodata_query.advancedFiltering
      ) {
        const extent = openlayers.extent.createEmpty();
        for (let country = 0; country < countries.length; country++) {
          const response = await fetch(
            encodeURI(
              'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine=' +
                countries[country].siteCountryName +
                '&forStorage=false&f=pjson&' +
                '&maxLocations=1',
            ),
          );
          countriesLocations.push(await response.json());
        }
        countriesLocations.forEach((data) => {
          openlayers.extent.extend(
            extent,
            proj.transformExtent(
              [
                data.candidates[0].extent.xmin,
                data.candidates[0].extent.ymin,
                data.candidates[0].extent.xmax,
                data.candidates[0].extent.ymax,
              ],
              'EPSG:4326',
              'EPSG:3857',
            ),
          );
        });
        if (!openlayers.extent.isEmpty(extent)) {
          positionUpdating = true;
          map.current.getView().fit(extent, {
            maxZoom: 16,
            duration: 1000,
          });
        }
      }
      if (where) {
        let response = await fetch(
          `${config.settings.providerUrl}?${getEncodedQueryString(`SELECT
          MIN(shape_wm.STX) AS MIN_X,
          MIN(shape_wm.STY) AS MIN_Y,
          MAX(shape_wm.STX) AS MAX_X,
          MAX(shape_wm.STY) AS MAX_Y
          FROM [IED].[${db_version}].[SiteMap]
          ${where ? 'WHERE ' + where : ''}`)}`,
        );
        response = await response.json();
        const extent = response?.results?.[0] || {};
        if (
          extent.MIN_X === null ||
          extent.MIN_Y === null ||
          extent.MAX_X === null ||
          extent.MAX_Y === null
        ) {
          toast.warn(
            <Toast
              warn
              title=""
              content="No results for selected filters. Please change or clear the filters."
            />,
          );
        } else if (discodata_query.siteTerm && !positionUpdating) {
          map.current
            .getView()
            .fit([extent.MIN_X, extent.MIN_Y, extent.MAX_X, extent.MAX_Y], {
              maxZoom: 16,
              duration: 1000,
            });
        }
      }
    }

    if (!firstFit) {
      updateMap();
    }
    /* eslint-disable-next-line */
  }, [discodata_query.filtersCounter]);

  const centerToUserLocation = (ignoreExtent = false) => {
    if (__SERVER__ || !map.current || !navigator?.geolocation) return;
    const extent = props.discodata_query.mapExtent;
    if (!extent || ignoreExtent) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          return centerToPosition(position, 12);
        },
        // Errors
        () => {},
      );
    } else {
      map.current.getView().fit([extent[0], extent[1], extent[2], extent[3]], {
        maxZoom: 16,
        duration: 1000,
      });
    }
  };

  const centerToPosition = (position, zoom) => {
    if (__SERVER__ || !map.current) return;
    return map.current.getView().animate({
      center: proj.fromLonLat([
        position.coords.longitude,
        position.coords.latitude,
      ]),
      duration: 1000,
      zoom,
    });
  };

  function getFeatureInRange(map, point, range = 3) {
    let x = 0;
    let y = 0;
    let dx = 0;
    let dy = -1;
    for (let i = 0; i <= range * range; i++) {
      const features =
        map.getFeaturesAtPixel([point[0] + x, point[1] + y]) || null;
      if (features?.length) {
        return features;
      }
      if (x === y || (x < 0 && x === -y) || (x > 0 && x === 1 - y)) {
        let temp = dx;
        dx = -dy;
        dy = temp;
      }
      x += dx;
      y += dy;
    }
    return null;
  }

  const onPointermove = (e) => {
    if (e.dragging || !popup.current) {
      return;
    }
    let features = [];
    const pixel = e.map.getEventPixel(e.originalEvent);
    e.map.forEachFeatureAtPixel(pixel, function (feature) {
      features.push(feature);
    });
    if (features?.length) {
      let hdms = coordinate.toStringHDMS(
        proj.toLonLat(features[0].getGeometry().flatCoordinates),
      );
      const featuresProperties = features[0].getProperties();
      if (
        JSON.stringify(popupData?.properties) !==
        JSON.stringify(featuresProperties)
      ) {
        setPopupData({
          properties: { ...featuresProperties },
          hdms,
          flatCoordinates: features[0].getGeometry().flatCoordinates,
        });
      }
      e.map.getTarget().style.cursor = 'pointer';
      popup.current.setPosition(e.coordinate);
    } else {
      e.map.getTarget().style.cursor = '';
      popup.current.setPosition(undefined);
      setPopupData(null);
    }
  };

  const onFeatureClick = (e) => {
    if (
      e.map.getView().getZoom() < zoomSwitch ||
      !popup.current ||
      !popupDetails.current
    )
      return;
    const pixel = e.map.getEventPixel(e.originalEvent);
    let features = getFeatureInRange(e.map, pixel, 9);
    if (features?.length) {
      let hdms = coordinate.toStringHDMS(
        proj.toLonLat(features[0].getGeometry().flatCoordinates),
      );
      const featuresProperties = features[0].getProperties();
      if (
        JSON.stringify(popupDetailsData?.properties) !==
        JSON.stringify(featuresProperties)
      ) {
        setPopupDetailsData({
          properties: { ...featuresProperties },
          hdms,
          flatCoordinates: features[0].getGeometry().flatCoordinates,
        });
      }
      e.map.getTarget().style.cursor = '';
      popup.current.setPosition(undefined);
      popupDetails.current.setPosition(e.coordinate);
    } else {
      setPopupDetailsData(undefined);
    }
  };

  const onMoveend = (e) => {
    const extent = e.map.getView().calculateExtent(e.map.getSize());
    props.setQueryParam({
      queryParam: {
        extent,
        mapExtent: extent,
      },
    });
  };

  const clearSource = () => {
    if (!sitesLayer.current) return;
    const sitesSource = sitesLayer.current.getSource();
    const regionsSource = regionsLayer.current.getSource();
    sitesSource.clear();
    regionsSource.clear();
    sitesSource.loadedExtentsRtree_.clear();
    regionsSource.loadedExtentsRtree_.clear();
  };

  if (__SERVER__) return '';

  const smallCircle = new style.Style({
    image: new style.Circle({
      radius: 3,
      fill: new style.Fill({ color: '#000' }),
      stroke: new style.Stroke({ color: '#6A6A6A', width: 1 }),
      zIndex: 0,
    }),
  });

  const bigCircle = new style.Style({
    image: new style.Circle({
      radius: 6,
      fill: new style.Fill({ color: '#000' }),
      stroke: new style.Stroke({ color: '#6A6A6A', width: 1 }),
      zIndex: 0,
    }),
  });

  const smallGreenCircle = new style.Style({
    image: new style.Circle({
      radius: 3,
      fill: new style.Fill({ color: '#00FF00' }),
      stroke: new style.Stroke({ color: '#6A6A6A', width: 1 }),
      zIndex: 0,
    }),
  });

  const bigGreenCircle = new style.Style({
    image: new style.Circle({
      radius: 6,
      fill: new style.Fill({ color: '#00FF00' }),
      stroke: new style.Stroke({ color: '#6A6A6A', width: 1 }),
      zIndex: 0,
    }),
  });

  const regionCircle = new style.Style({
    image: new style.Circle({
      radius: 6,
      fill: new style.Fill({ color: '#4296B2' }),
      stroke: new style.Stroke({ color: '#6A6A6A', width: 1 }),
      zIndex: 0,
    }),
  });

  return (
    <div className="industry-map-wrapper">
      <div id="industry-map" className="industry-map">
        <PrivacyProtection data={{ dataprotection }}>
          <Map
            ref={(element) => {
              if (!element || map.current) return;
              const newMap = element.state.map;
              if (newMap) {
                map.current = newMap;
                setMapRendered(true);
              }
            }}
            view={{
              center: proj.fromLonLat([20, 50]),
              showFullExtent: true,
              maxZoom: 16,
              minZoom: 2,
              zoom: 2,
            }}
            renderer="webgl"
            onPointermove={onPointermove}
            onClick={onFeatureClick}
            onMoveend={onMoveend}
          >
            <Layers>
              <Layer.Tile
                source={
                  new source.XYZ({
                    url: getLayerBase(),
                  })
                }
                zIndex={0}
              />
              <Layer.VectorImage
                ref={(element) => {
                  if (!element || regionsLayer.current) return;
                  if (element.layer) {
                    regionsLayer.current = element.layer;
                  }
                }}
                source={
                  new source.Vector({
                    loader: function (extent, _, projection) {
                      const esrijsonFormat = new format.EsriJSON();
                      let url = `https://air.discomap.eea.europa.eu/arcgis/rest/services/Air/IED_Clusters_WM/FeatureServer/0/query/?f=json&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=${encodeURIComponent(
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
                            (regionsWhereStatement.current
                              ? qs.stringify({
                                  where: regionsWhereStatement.current,
                                })
                              : '') + '&callback',
                        },
                        (error, response) => {
                          if (!error) {
                            let features = esrijsonFormat.readFeatures(
                              response,
                              {
                                featureProjection: projection,
                              },
                            );
                            if (features?.length > 0) {
                              this.addFeatures(features);
                            }
                          }
                        },
                      );
                    },
                    strategy: loadingstrategy.tile(
                      tilegrid.createXYZ({
                        tileSize: 256,
                      }),
                    ),
                  })
                }
                style={() => {
                  if (!map.current) return;
                  const zoom = map.current.getView()?.getZoom();
                  if (zoom >= zoomSwitch || discodataQuery.current?.siteTerm)
                    return;
                  return regionCircle;
                }}
                title="1.Regions"
                zIndex={1}
              />
              <Layer.VectorImage
                ref={(element) => {
                  if (!element || sitesLayer.current) return;
                  if (element.layer) {
                    sitesLayer.current = element.layer;
                  }
                }}
                className="ol-layer-sites"
                source={
                  new source.Vector({
                    loader: function (extent, resolution, projection) {
                      _REQS++;
                      const esrijsonFormat = new format.EsriJSON();
                      this.resolution = resolution;
                      let url = getSitesUrl(extent);
                      jsonp(
                        url,
                        {
                          param:
                            (whereStatement.current
                              ? qs.stringify({
                                  where: whereStatement.current,
                                })
                              : '') + '&callback',
                        },
                        (error, response) => {
                          if (!error) {
                            let features = esrijsonFormat.readFeatures(
                              response,
                              {
                                featureProjection: projection,
                              },
                            );
                            if (features?.length > 0) {
                              this.addFeatures(features);
                            }
                          }
                          if (!--_REQS) {
                            setLoading(false);
                          }
                        },
                      );
                      if (!loading) {
                        setLoading(true);
                      }
                    },
                    strategy: function (extent, resolution) {
                      const tileGrid = tilegrid.createXYZ({
                        tileSize: 256,
                      });
                      let z = tileGrid.getZForResolution(resolution);
                      let tileRange = tileGrid.getTileRangeForExtentAndZ(
                        extent,
                        z,
                      );
                      /** @type {Array<import("./extent.js").Extent>} */
                      let extents = [];
                      /** @type {import("./tilecoord.js").TileCoord} */
                      let tileCoord = [z, 0, 0];
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
                      if (this.resolution && this.resolution !== resolution) {
                        extents.forEach((newExtent) => {
                          this.loadedExtentsRtree_.forEach((loadedExtent) => {
                            const bigExtent = loadedExtent.extent;
                            if (
                              openlayers.extent.containsExtent(
                                bigExtent,
                                newExtent,
                              ) &&
                              bigExtent[0] !== newExtent[0] &&
                              bigExtent[1] !== newExtent[1] &&
                              bigExtent[2] !== newExtent[2] &&
                              bigExtent[3] !== newExtent[3]
                            ) {
                              this.loadedExtentsRtree_.remove(loadedExtent);
                            }
                          });
                        });
                      }
                      return extents;
                    },
                  })
                }
                style={(feature) => {
                  if (!map.current) return;
                  const zoom = map.current.getView()?.getZoom();
                  const properties = feature.getProperties();
                  if (zoom < zoomSwitch && !discodataQuery.current?.siteTerm)
                    return;
                  if (
                    discodataQuery.current?.siteTerm &&
                    properties?.siteName === discodataQuery.current?.siteTerm
                  ) {
                    return zoom >= 8 ? bigGreenCircle : smallGreenCircle;
                  }
                  return zoom >= 8 ? bigCircle : smallCircle;
                }}
                title="2.Sites"
                zIndex={1}
              />
            </Layers>
            <Controls attribution={false} zoom={true}>
              <Control className="ol-location" id="ol-sidebar">
                <button
                  title="User location"
                  onClick={() => {
                    centerToUserLocation(true);
                  }}
                >
                  <Icon name={navigationSVG} size="1em" fill="white" />
                </button>
              </Control>
            </Controls>
            <Interactions
              doubleClickZoom={true}
              keyboardZoom={true}
              mouseWheelZoom={true}
              pointer={true}
              select={true}
            />
            <Overlays
              className="ol-dynamic-filter"
              positioning="center-center"
              stopEvent={true}
            >
              <div id="map-sidebar" />
            </Overlays>
            <Overlays
              ref={(element) => {
                if (!element || popup.current) return;
                if (element.overlay) {
                  popup.current = element.overlay;
                }
              }}
              className="ol-overlay-container ol-popup"
              positioning="center-center"
              stopEvent={true}
            >
              <div id="popup" className="popup">
                <div className="popover-header">
                  {popupData?.properties.siteName ? (
                    <Header as="h3">{popupData?.properties.siteName}</Header>
                  ) : popupData?.properties.NUTS_NAME &&
                    popupData?.properties.CNTR_CODE &&
                    popupData?.properties.COUNTRY ? (
                    <Header as="h3">{`${popupData.properties.NUTS_NAME}, ${popupData.properties.CNTR_CODE}, ${popupData.properties.COUNTRY}`}</Header>
                  ) : (
                    ''
                  )}
                </div>
                <div className="popover-body">
                  <Grid.Column stretched>
                    {!popupData?.properties.num_sites ? (
                      ''
                    ) : (
                      <Grid.Row>
                        <p>
                          Number of sites:{' '}
                          <code>{popupData?.properties.num_sites}</code>
                        </p>
                      </Grid.Row>
                    )}
                    <Grid.Row>
                      {popupData?.hdms ? (
                        <>
                          <p className="mb-1">
                            The location you are viewing is:
                          </p>
                          <code>{popupData?.hdms}</code>
                        </>
                      ) : (
                        ''
                      )}
                    </Grid.Row>
                  </Grid.Column>
                </div>
              </div>
            </Overlays>
            <Overlays
              ref={(props) => {
                if (!props || popupDetails.current) return;
                if (props.overlay) {
                  popupDetails.current = props.overlay;
                }
              }}
              className="ol-overlay-container ol-popup-details"
              positioning="center-center"
              stopEvent={true}
            >
              <div id="popup-details" className="popup">
                {popupDetailsData ? (
                  <>
                    {' '}
                    <div className="popover-header">
                      <Header as="h2">
                        {popupDetailsData.properties.siteName
                          ? popupDetailsData.properties.siteName
                          : ''}
                      </Header>
                      <Icon
                        onClick={() =>
                          popupDetails.current.setPosition(undefined)
                        }
                        name={clearSVG}
                        size="2em"
                      />
                    </div>
                    <div className="popover-body">
                      <div className="grid-layout">
                        {/* SITE CONTENTS */}
                        {popupDetailsData.properties.nFacilities ||
                        popupDetailsData.properties.nInstallations ||
                        popupDetailsData.properties.nLCP ? (
                          <div className="row mb-1-super mt-0-super">
                            <div className="column column-12">
                              <Header as="h3">Site contents</Header>
                            </div>
                            {popupDetailsData.properties.nFacilities ? (
                              <div className="column  column-12">
                                <p>
                                  {popupDetailsData.properties.nFacilities +
                                    ' '}
                                  Facilit
                                  {popupDetailsData.properties.nFacilities > 1
                                    ? 'ies'
                                    : 'y'}
                                </p>
                              </div>
                            ) : (
                              ''
                            )}
                            {popupDetailsData.properties.nInstallations ? (
                              <div className="column  column-12">
                                <p>
                                  {popupDetailsData.properties.nInstallations +
                                    ' '}
                                  Installation
                                  {popupDetailsData.properties.nInstallations >
                                  1
                                    ? 's'
                                    : ''}
                                </p>
                              </div>
                            ) : (
                              ''
                            )}
                            {popupDetailsData.properties.nLCP ? (
                              <div className="column  column-12">
                                <p>
                                  {popupDetailsData.properties.nLCP + ' '}
                                  Large combustion plant
                                  {popupDetailsData.properties.nLCP > 1
                                    ? 's'
                                    : ''}
                                </p>
                              </div>
                            ) : (
                              ''
                            )}
                          </div>
                        ) : (
                          ''
                        )}

                        {/* SITE POLLUTANT EMISSIONS */}
                        <div className="row mb-1-super mt-0-super">
                          <div className="column  column-12">
                            <Header as="h3">Pollutant emissions</Header>
                          </div>
                          <div className="column  column-12 description">
                            {popupDetailsData.properties.pollutants ? (
                              <p>{popupDetailsData.properties.pollutants}</p>
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
                            {popupDetailsData.properties.Site_reporting_year ? (
                              <p>
                                Inspections in{' '}
                                {
                                  popupDetailsData.properties
                                    .Site_reporting_year
                                }
                                :{' '}
                                {popupDetailsData.properties.numInspections ||
                                  0}
                              </p>
                            ) : (
                              ''
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="popover-actions">
                      <UniversalLink
                        className="solid dark-blue display-inline-block"
                        href={`/industrial-site/environmental-information?siteInspireId=${popupDetailsData.properties.InspireSiteId?.encoded()}&siteName=${popupDetailsData.properties.siteName?.encoded()}&siteReportingYear=${
                          popupDetailsData.properties.Site_reporting_year
                        }`}
                      >
                        Site Details
                      </UniversalLink>
                    </div>
                  </>
                ) : (
                  ''
                )}
              </div>
            </Overlays>
            {loading ? (
              <div className="loader">
                <svg className="circular-loader" viewBox="25 25 50 50">
                  <circle
                    className="loader-path"
                    cx="50"
                    cy="50"
                    r="20"
                    fill="none"
                    stroke="#7C9AC0"
                    stroke-width="8"
                  />
                </svg>
              </div>
            ) : (
              ''
            )}
          </Map>
        </PrivacyProtection>
      </div>
    </div>
  );
};

export default compose(
  connect(
    (state) => ({
      query: qs.parse(state.router.location.search.replace('?', '')),
      discodata_query: state.discodata_query.search,
    }),
    {
      setQueryParam,
    },
  ),
)(View);
