/**
 * Document view component.
 * @module components/theme/View/DefaultView
 */

import React, { useEffect, useRef, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';

import { Container, Image } from 'semantic-ui-react';
import { map } from 'lodash';
import qs from 'query-string';
import { setQueryParam } from 'volto-datablocks/actions';

import { blocks } from '~/config';

import {
  getBlocksFieldname,
  getBlocksLayoutFieldname,
  hasBlocksData,
  getBaseUrl,
} from '@plone/volto/helpers';

const messages = defineMessages({
  unknownBlock: {
    id: 'Unknown Block',
    defaultMessage: 'Unknown Block {block}',
  },
});

/**
 * Component to display the default view.
 * @function DefaultView
 * @param {Object} content Content object.
 * @returns {string} Markup of the component.
 */
const DefaultView = ({
  content,
  intl,
  location,
  discodata_query,
  query,
  setQueryParam,
}) => {
  const [mounted, setMounted] = useState(false);
  const history = useHistory();
  const blocksFieldname = getBlocksFieldname(content);
  const blocksLayoutFieldname = getBlocksLayoutFieldname(content);
  const contentTypeBlocks = content['@components']?.layout?.[blocksFieldname];
  const hash = location.hash.replace('#', '');
  const timer = useRef(null);
  const clock = useRef(0);
  const siteTemplateQuery = [
    'siteInspireId',
    'siteName',
    'siteReportingYear',
    'facilityInspireId',
    'installationInspireId',
    'lcpInspireId',
  ];

  useEffect(() => {
    setMounted(true);
    console.log('MOUNTED');
    return () => {
      console.log('UNMOUNTED');
      setMounted(false);
    };
  }, []);

  useEffect(() => {
    if (
      content['layout'] === 'default_view' &&
      content['@type'] === 'site_template' &&
      !discodata_query.search.siteInspireId &&
      !query.siteInspireId
    ) {
      history.push('/browse/explore-data-map/map');
      return;
    }
    if (
      content['layout'] === 'default_view' &&
      content['@type'] === 'site_template' &&
      mounted
    ) {
      const queryParams = { ...query };
      const missingQueryParams = {};

      Object.keys(discodata_query.search)
        .filter((key) => siteTemplateQuery.includes(key))
        .forEach((key) => {
          queryParams[key] = discodata_query.search[key];
        });

      Object.keys(query)
        .filter(
          (key) =>
            siteTemplateQuery.includes(key) && !discodata_query.search[key],
        )
        .forEach((key) => {
          if (key === 'siteReportingYear') {
            missingQueryParams[key] = parseInt(query[key]);
          } else {
            missingQueryParams[key] = query[key];
          }
        });

      if (Object.keys(missingQueryParams).length) {
        setQueryParam({
          queryParam: { ...missingQueryParams },
        });
      }

      if (
        Object.keys(queryParams).filter(
          (key) =>
            JSON.stringify(queryParams[key]) !== JSON.stringify(query[key]),
        ).length
      ) {
        history.push(
          `${location.pathname.replace(/\/$/, '')}?${qs.stringify(
            queryParams,
          )}`,
        );
      }
    }
  }, [mounted, content?.['@id']]);

  return hasBlocksData(content) ? (
    <div id="page-document" className="ui container">
      {map(content[blocksLayoutFieldname].items, (block) => {
        const contentBlock =
          contentTypeBlocks?.[content[blocksFieldname]?.[block]?.['@layout']] &&
          !content[blocksFieldname]?.[block]?.grid_overwrite_layout
            ? contentTypeBlocks?.[
                content[blocksFieldname]?.[block]?.['@layout']
              ]
            : content[blocksFieldname]?.[block];
        const Block =
          blocks.blocksConfig[contentBlock?.['@type']]?.['view'] || null;
        return Block !== null ? (
          <Block
            key={block}
            id={block}
            properties={content}
            data={contentBlock}
            path={getBaseUrl(location?.pathname || '')}
          />
        ) : (
          <div key={block}>
            {intl.formatMessage(messages.unknownBlock, {
              block: contentBlock?.['@type'],
            })}
          </div>
        );
      })}
    </div>
  ) : (
    <Container id="page-document">
      <h1 className="documentFirstHeading">{content.title}</h1>
      {content.description && (
        <p className="documentDescription">{content.description}</p>
      )}
      {content.image && (
        <Image
          className="document-image"
          src={content.image.scales.thumb.download}
          floated="right"
        />
      )}
      {content.remoteUrl && (
        <span>
          The link address is:
          <a href={content.remoteUrl}>{content.remoteUrl}</a>
        </span>
      )}
      {content.text && (
        <div
          dangerouslySetInnerHTML={{
            __html: content.text.data,
          }}
        />
      )}
    </Container>
  );
};

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
DefaultView.propTypes = {
  /**
   * Content of the object
   */
  content: PropTypes.shape({
    /**
     * Title of the object
     */
    title: PropTypes.string,
    /**
     * Description of the object
     */
    description: PropTypes.string,
    /**
     * Text of the object
     */
    text: PropTypes.shape({
      /**
       * Data of the text of the object
       */
      data: PropTypes.string,
    }),
  }).isRequired,
};

export default compose(
  connect(
    (state, props) => ({
      discodata_query: state.discodata_query,
      query: qs.parse(state.router.location.search),
    }),
    { setQueryParam },
  ),
)(injectIntl(DefaultView));
