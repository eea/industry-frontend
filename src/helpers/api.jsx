import config from '@plone/volto/registry';
import {
  setDiscodataResource,
  setDiscodataResourcePending,
} from '@eeacms/volto-datablocks/actions';
import axios from 'axios';

export const parseResponse = (response) => {
  try {
    return JSON.parse(response.request.response);
  } catch {
    return {};
  }
};

export const getFacilities = (dispatch, siteInspireId) => {
  const sql = encodeURI(`SELECT DISTINCT facilityInspireId
  FROM [IED].[latest].[Browse6Header] as R
  WHERE R.[siteInspireId] COLLATE Latin1_General_CI_AI LIKE '${siteInspireId}'
  GROUP BY R.[facilityInspireId]`);
  const url = `${config.settings.providerUrl}?query=${sql}`;
  return new Promise((resolve, reject) => {
    dispatch(
      setDiscodataResourcePending({ key: `facilities-${siteInspireId}` }),
    );
    axios
      .get(url)
      .then((response) => {
        const parsedResponse = parseResponse(response)?.results || [];
        dispatch(
          setDiscodataResource({
            collection: parseResponse(response).results,
            resourceKey: 'facilities',
            key: siteInspireId,
          }),
        );
        resolve(parsedResponse);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getInstallations = (dispatch, siteInspireId) => {
  const sql = encodeURI(`SELECT DISTINCT
    facilityInspireId,
    string_agg(concat(installationInspireId, ''), ',') as installations
  FROM [IED].[latest].[Browse8Header] as Results
  WHERE siteInspireId COLLATE Latin1_General_CI_AI LIKE '${siteInspireId}'
  GROUP BY facilityInspireId`);
  const url = `${config.settings.providerUrl}?query=${sql}`;
  return new Promise((resolve, reject) => {
    dispatch(
      setDiscodataResourcePending({ key: `installations-${siteInspireId}` }),
    );
    axios
      .get(url)
      .then((response) => {
        const parsedResponse = parseResponse(response)?.results || [];
        dispatch(
          setDiscodataResource({
            collection: parsedResponse.map((item) => ({
              ...item,
              installations: [...new Set(item.installations.split(','))],
            })),
            resourceKey: 'installations',
            key: siteInspireId,
          }),
        );
        resolve(parsedResponse);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getLcps = (dispatch, siteInspireId) => {
  const sql = encodeURI(`SELECT DISTINCT
    facilityInspireId,
    installationInspireId,
    string_agg(concat(lcpInspireId, ''), ',') as lcps
  FROM [IED].[latest].[Browse10_Header] as Results
  WHERE siteInspireId COLLATE Latin1_General_CI_AI LIKE '${siteInspireId}'
  GROUP BY facilityInspireId, installationInspireId`);
  const url = `${config.settings.providerUrl}?query=${sql}`;
  return new Promise((resolve, reject) => {
    dispatch(setDiscodataResourcePending({ key: `lcps-${siteInspireId}` }));
    axios
      .get(url)
      .then((response) => {
        const parsedResponse = parseResponse(response)?.results || [];
        const collection = [];
        parsedResponse.forEach((item) => {
          const facilityIndex = collection
            .map((facility) => facility.facilityInspireId)
            .indexOf(item.facilityInspireId);
          if (facilityIndex > -1) {
            const installationIndex = collection[facilityIndex].installations
              .map((installation) => installation.installationInspireId)
              .indexOf(item.installationInspireId);
            if (installationIndex > -1) {
              collection[facilityIndex].installations[installationIndex] = {
                ...collection[facilityIndex].installations[installationIndex],
                lcps: [
                  ...collection[facilityIndex].installations[installationIndex]
                    .lcps,
                  [...new Set(item.lcps.split(','))],
                ],
              };
            }
            // else {
            //   collection[facilityIndex].installations[installationIndex] = {
            //     ...collection[facilityIndex].installations[installationIndex],
            //     lcps: [
            //       ...collection[facilityIndex].installations[installationIndex]
            //         .lcps,
            //       [...new Set(item.lcps.split(','))],
            //     ],
            //   };
            // }
          } else {
            collection.push({
              facilityInspireId: item.facilityInspireId,
              installations: [
                {
                  installationInspireId: item.installationInspireId,
                  lcps: [...new Set(item.lcps.split(','))],
                },
              ],
            });
          }
        });
        dispatch(
          setDiscodataResource({
            collection: [...collection],
            resourceKey: 'lcps',
            key: siteInspireId,
          }),
        );
        resolve(parsedResponse);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// AT.CAED/9008390099636.SITE	AT.CAED/9008390731697.FACILITY	AT.CAED/9008390396346.INSTALLATION
// AT.CAED/9008390099636.SITE	AT.CAED/9008390731697.FACILITY	AT.CAED/9008390731864.INSTALLATION
// AT.CAED/9008390099636.SITE	AT.CAED/9008390731697.FACILITY	AT.CAED/9008390733363.INSTALLATION
// AT.CAED/9008390099636.SITE	AT.CAED/9008390731697.FACILITY	AT.CAED/9008390925898.INSTALLATION
// AT.CAED/9008390099636.SITE	AT.CAED/9008390731697.FACILITY	AT.CAED/9008390928080.INSTALLATION
// AT.CAED/9008390099636.SITE	AT.CAED/9008390731697.FACILITY	AT.CAED/9008391004097.INSTALLATION	AT.CAED/9008390405734.PART
// AT.CAED/9008390099636.SITE	AT.CAED/9008390731697.FACILITY	AT.CAED/9008391004097.INSTALLATION	AT.CAED/9008390405741.PART
// AT.CAED/9008390099636.SITE	AT.CAED/9008390731697.FACILITY	AT.CAED/9008391004134.INSTALLATION
// AT.CAED/9008390099636.SITE	AT.CAED/9008390731697.FACILITY	AT.CAED/9008391004196.INSTALLATION
// AT.CAED/9008390099636.SITE	AT.CAED/9008390731697.FACILITY	AT.CAED/9008391004837.INSTALLATION
// AT.CAED/9008390099636.SITE	AT.CAED/9008390731697.FACILITY	AT.CAED/9008391020134.INSTALLATION
// AT.CAED/9008390099636.SITE	AT.CAED/9008390731697.FACILITY	AT.CAED/9008391257066.INSTALLATION	AT.CAED/9008390393697.PART
// AT.CAED/9008390099636.SITE	AT.CAED/9008390731697.FACILITY	AT.CAED/9008391257066.INSTALLATION	AT.CAED/9008390393703.PART
// AT.CAED/9008390099636.SITE	AT.CAED/9008390731697.FACILITY	AT.CAED/9008391257066.INSTALLATION	AT.CAED/9008390394236.PART
// AT.CAED/9008390099636.SITE	AT.CAED/9008390731697.FACILITY	AT.CAED/9008391257066.INSTALLATION	AT.CAED/9008390396933.PART
// AT.CAED/9008390099636.SITE	AT.CAED/9008390731697.FACILITY	AT.CAED/9008391257066.INSTALLATION	AT.CAED/9008390511381.PART
// AT.CAED/9008390099636.SITE	AT.CAED/9008390731697.FACILITY	AT.CAED/9008391257066.INSTALLATION	AT.CAED/9008390925799.PART
// AT.CAED/9008390099636.SITE	AT.CAED/9008390731697.FACILITY	AT.CAED/9008391257080.INSTALLATION
