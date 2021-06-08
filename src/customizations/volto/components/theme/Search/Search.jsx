/**
 * Search component.
 * @module components/theme/Search/Search
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { asyncConnect } from 'redux-connect';
import { FormattedMessage } from 'react-intl';
import { Portal } from 'react-portal';
import { Container, Pagination } from 'semantic-ui-react';
import qs from 'query-string';
import { isArray, isObject } from 'lodash';
import config from '@plone/volto/registry';
import { Helmet } from '@plone/volto/helpers';
import { searchContent } from '@plone/volto/actions';
import { Toolbar, Icon } from '@plone/volto/components';
import Highlighter from 'react-highlight-words';
import { DiscodataSqlBuilderView } from '@eeacms/volto-datablocks/components';
import { setQueryParam } from '@eeacms/volto-datablocks/actions';
import paginationLeftSVG from '@plone/volto/icons/left-key.svg';
import paginationRightSVG from '@plone/volto/icons/right-key.svg';

const toSearchOptions = (searchableText, subject, queryOptions) => {
  return {
    fullobjects: true,
    ...(searchableText && { SearchableText: searchableText }),
    ...(subject && {
      Subject: subject,
    }),
    ...(queryOptions && queryOptions),
  };
};

const getQueryOptions = (query, schema = false) => {
  const options = {};
  isObject(query) &&
    Object.entries(query).forEach(([key, value]) => {
      if (key.includes(':query'))
        options[key.split(':')[0]] = !schema
          ? value
          : { value: isArray(value) ? value : [value] };
    });
  return options;
};

const getText = (block) => {
  let text = '';
  if (block.text && typeof block.text === 'string') text = block.text;
  if (block.text && block.text.blocks && isArray(block.text.blocks)) {
    block.text.blocks.forEach((block) => {
      text += getText(block);
    });
  }
  return text;
};

const matchedText = (text, searchableText) => {
  let matchedText = text;
  if (text.length > 256) {
    const pos = text.toLowerCase().indexOf(searchableText.toLowerCase());
    const rightPart = text.substring(pos, text.length);
    const leftPart = text.substring(0, pos - 1);
    matchedText = `[...${leftPart.slice(-128)} ${rightPart.substring(
      0,
      128,
    )}...]`;
  }
  return matchedText;
};

const smallText = (text) => {
  if (text.length > 256) return `[...${text.substring(0, 256)}...]`;
  return text;
};

const paragraph = (text, searchableText) => (
  <p>
    <Highlighter
      highlightClassName="highlight"
      searchWords={searchableText?.split(' ') || []}
      autoEscape={true}
      textToHighlight={text}
    />
  </p>
);

const getSummary = (item, searchableText) => {
  let summary = {
    fullSummary: [],
    matchedParagraph: [],
    firstParagraph: [],
  };
  item.blocks &&
    Object.entries(item.blocks).forEach(([key, block], index) => {
      const text = getText(block);
      if (text && text.length > 0) {
        summary.fullSummary.push(paragraph(text, searchableText));
      }
      if (text && text.length > 0 && summary.firstParagraph.length === 0) {
        summary.firstParagraph.push(paragraph(smallText(text), searchableText));
      }
      if (
        text.toLowerCase().includes(searchableText.toLowerCase()) &&
        summary.matchedParagraph.length === 0
      ) {
        summary.matchedParagraph.push(
          paragraph(matchedText(text, searchableText), searchableText),
        );
      }
    });

  return summary;
};

/**
 * Search class.
 * @class SearchComponent
 * @extends Component
 */
class Search extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    searchContent: PropTypes.func.isRequired,
    searchableText: PropTypes.string,
    subject: PropTypes.string,
    path: PropTypes.string,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        '@id': PropTypes.string,
        '@type': PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
      }),
    ),
    pathname: PropTypes.string.isRequired,
  };

  /**
   * Default properties.
   * @property {Object} defaultProps Default properties.
   * @static
   */
  static defaultProps = {
    items: [],
    searchableText: null,
    subject: null,
    path: null,
  };

  constructor(props) {
    super(props);
    this.state = { currentPage: 1, expendedItemIndex: -1 };
  }

  /**
   * Component will mount
   * @method componentWillMount
   * @returns {undefined}
   */
  UNSAFE_componentWillMount() {
    this.doSearch(
      this.props.searchableText,
      this.props.subject,
      getQueryOptions(this.props.query),
    );
  }

  /**
   * Component will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  UNSAFE_componentWillReceiveProps = (nextProps) => {
    if (
      nextProps.searchableText !== this.props.searchableText ||
      nextProps.subject !== this.props.subject
    ) {
      this.doSearch(
        nextProps.searchableText,
        nextProps.subject,
        getQueryOptions(this.props.query),
      );
    }
  };

  /**
   * Search based on the given searchableText, subject and path.
   * @method doSearch
   * @param {string} searchableText The searchable text string
   * @param {string} subject The subject (tag)
   * @param {string} path The path to restrict the search to
   * @returns {undefined}
   */

  doSearch = (searchableText, subject, queryOptions) => {
    this.setState({ currentPage: 1 });
    this.props.searchContent(
      '',
      toSearchOptions(searchableText, subject, queryOptions),
    );
  };

  makeQuery(key) {
    let query = '';
    const propsQuery = this.props.data?.[key]?.value;
    isObject(propsQuery) &&
      Object.entries(propsQuery).forEach(([itemKey, item]) => {
        if (isArray(item)) query += `&${itemKey}:${key}=${item.join(',')}&`;
      });
    return query;
  }

  handleQueryPaginationChange = (e, { activePage }) => {
    window.scrollTo(0, 0);
    this.setState({ currentPage: activePage, expendedItemIndex: -1 }, () => {
      const options = toSearchOptions(
        qs.parse(this.props.location.search).SearchableText,
        qs.parse(this.props.location.search).Subject,
        getQueryOptions(this.props.query),
      );

      this.props.searchContent('', {
        ...options,
        b_start: (this.state.currentPage - 1) * config.settings.defaultPageSize,
      });
    });
  };

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const pollutants =
      this.props.discodata_resources.data.index_pollutants || [];

    return (
      <Container id="page-search">
        <DiscodataSqlBuilderView
          data={{
            '@type': 'discodata_sql_builder',
            sql: {
              value:
                '{"fieldsets":[{"id":"sql_metadata","title":"SQL","fields":["index_pollutants"]}],"properties":{"index_pollutants":{"title":"Index pollutants","isCollection":true,"hasPagination":false,"urlQuery":false,"sql":"SELECT POL.code,\\nPOL.name,\\nPOL.startYear,\\nPOL.endYear,\\nPOL.parentId,\\nPOL.cas,\\nPOL.eperPollutantId,\\nPOL.codeEPER,\\nPOL_DET.*\\nFROM [IED].[latest].[Glo_Pollutants] as POL\\nLEFT JOIN [IED].[latest].[Glo_PollutantsDetails] AS POL_DET\\nON POL.pollutantId = POL_DET.pollutantId\\nORDER BY name","packageName":"index_pollutant_group_id"}},"required":[]}',
            },
            where: {
              value:
                '{"fieldsets":[{"id":"where_statements_metadata","title":"Where statements","fields":["w1","w2"]}],"properties":{"w1":{"title":"W1","sqlId":"index_pollutant_iso","urlQuery":false,"key":"pollutantId","queryParam":"index_pollutant_id"},"w2":{"title":"W2","sqlId":"index_pollutant_other_provisions","urlQuery":false,"key":"other_provision_id","queryParam":"index_pollutant_other_provisions","isExact":true}},"required":[]}',
            },
          }}
        />
        <Helmet title="Search" />
        <div className="container">
          <article id="content">
            <header>
              <h1 className="documentFirstHeading mb-0">
                {this.props.title ? (
                  `${this.props.title}`
                ) : (
                  <FormattedMessage
                    id="Search results"
                    defaultMessage="Search results"
                  />
                )}
              </h1>
              {this.props.description ? (
                <p style={{ marginBottom: '3em' }}>{this.props.description}</p>
              ) : (
                ''
              )}
              {/* <SearchBlock
                data={{
                  title: { value: this.props.title },
                  description: { value: this.props.description },
                  query: {
                    value: {
                      properties: {
                        ...getQueryOptions(this.props.query, true),
                      },
                    },
                  },
                  placeholder: { value: 'Search site' },
                  searchButton: { value: false },
                }}
              /> */}

              <div className="search-meta mb-2">
                {this.props.searchableText ? (
                  <span>
                    Results for:{' '}
                    <mark className="highlight green bold ma-0">
                      {this.props.searchableText}
                    </mark>
                  </span>
                ) : (
                  ''
                )}
                {this.props.search?.items_total ? (
                  <span>{this.props.search.items_total} results</span>
                ) : (
                  ''
                )}
              </div>
            </header>
            <section id="content-core">
              {this.props.items.map((item, index) => (
                <article
                  className="tileItem"
                  key={`article_${item['@id']}`}
                  id={`article_${item['@id']}`}
                >
                  <Link to={item['@id']}>
                    <h3 className="tileHeadline mb-1">
                      <Highlighter
                        highlightClassName="highlight"
                        searchWords={
                          this.props.searchableText?.split(' ') || []
                        }
                        autoEscape={true}
                        textToHighlight={item.title}
                      />
                    </h3>
                  </Link>
                  <div className="tileBody">
                    <div className="description">
                      {this.state.expendedItemIndex === index
                        ? item.summary.fullSummary.length > 0
                          ? item.summary.fullSummary.map((paragraph, index) => (
                              <React.Fragment
                                key={`summary_paragraph_${item['@id']}_${index}}`}
                              >
                                {paragraph}
                              </React.Fragment>
                            ))
                          : item.description
                        : item.summary.matchedParagraph.length > 0
                        ? item.summary.matchedParagraph[0]
                        : item.summary.firstParagraph.length > 0
                        ? item.summary.firstParagraph[0]
                        : item.description}
                    </div>
                    {item.summary.fullSummary.length ? (
                      <button
                        className="outline dark-blue expendButton"
                        onClick={() => {
                          if (this.state.expendedItemIndex === index) {
                            this.setState({ expendedItemIndex: -1 }, () => {
                              window.scrollTo(
                                0,
                                document.getElementById(
                                  `article_${item['@id']}`,
                                ).offsetTop,
                              );
                            });
                          } else {
                            this.setState({ expendedItemIndex: index }, () => {
                              window.scrollTo(
                                0,
                                document.getElementById(
                                  `article_${item['@id']}`,
                                ).offsetTop,
                              );
                            });
                          }
                        }}
                      >
                        {this.state.expendedItemIndex === index
                          ? 'Collapse'
                          : 'Read more'}
                      </button>
                    ) : (
                      ''
                    )}
                  </div>
                  <div className="visualClear" />
                </article>
              ))}

              <div className="discodata-list mb-3">
                <h3 style={{ margin: '5px' }}>Pollutants</h3>
                {pollutants
                  .filter(
                    (pollutant) =>
                      pollutant.pollutantId &&
                      pollutant.name
                        .toLowerCase()
                        .includes(this.props.searchableText.toLowerCase()),
                  )
                  .map((pollutant) => (
                    <Link
                      key={`item-${pollutant.pollutantId}`}
                      className="outline dark-blue"
                      as="a"
                      to="/glossary/pollutants/pollutant-index"
                      onClick={() => {
                        this.props.setQueryParam({
                          queryParam: {
                            index_pollutant_group_id: parseInt(
                              pollutant.parentId,
                            ),
                            index_pollutant_id: parseInt(pollutant.pollutantId),
                          },
                        });
                      }}
                    >
                      <Highlighter
                        highlightClassName="highlight"
                        searchWords={
                          this.props.searchableText?.split(' ') || []
                        }
                        autoEscape={true}
                        textToHighlight={pollutant.name}
                      />
                    </Link>
                  ))}
              </div>

              {this.props.search?.batching && (
                <div className="search-footer">
                  <Pagination
                    activePage={this.state.currentPage}
                    totalPages={Math.ceil(
                      this.props.search.items_total /
                        config.settings.defaultPageSize,
                    )}
                    onPageChange={this.handleQueryPaginationChange}
                    firstItem={null}
                    lastItem={null}
                    prevItem={{
                      content: <Icon name={paginationLeftSVG} size="18px" />,
                      icon: true,
                      'aria-disabled': !this.props.search.batching.prev,
                      className: !this.props.search.batching.prev
                        ? 'disabled'
                        : null,
                    }}
                    nextItem={{
                      content: <Icon name={paginationRightSVG} size="18px" />,
                      icon: true,
                      'aria-disabled': !this.props.search.batching.next,
                      className: !this.props.search.batching.next
                        ? 'disabled'
                        : null,
                    }}
                  />
                </div>
              )}
            </section>
          </article>
        </div>
        <Portal node={__CLIENT__ && document.getElementById('toolbar')}>
          <Toolbar
            pathname={this.props.pathname}
            hideDefaultViewButtons
            inner={<span />}
          />
        </Portal>
      </Container>
    );
  }
}

export const __test__ = connect(
  (state, props) => ({
    items: state.search.items,
    searchableText: qs.parse(props.location.search).SearchableText,
    subject: qs.parse(props.location.search).Subject,
    path: qs.parse(props.location.search).path,
    pathname: props.location.pathname,
  }),
  { searchContent },
)(Search);

export default compose(
  connect(
    (state, props) => ({
      searchableText: qs.parse(props.location.search).SearchableText,
      items: state.search.items.map((item) => {
        return {
          ...item,
          '@id': item['@id'].replace(config.settings.apiPath, ''),
          summary: getSummary(
            item,
            qs.parse(props.location.search).SearchableText,
          ),
        };
      }),
      subject: qs.parse(props.location.search).Subject,
      query: qs.parse(props.location.search),
      title: qs.parse(props.location.search).title,
      description: qs.parse(props.location.search).description,
      pathname: props.location.pathname,
      discodata_resources: state.discodata_resources,
    }),
    { searchContent, setQueryParam },
  ),
  asyncConnect([
    {
      key: 'search',
      promise: ({ location, store: { dispatch } }) =>
        dispatch(
          searchContent(
            '',
            toSearchOptions(
              qs.parse(location.search).SearchableText,
              qs.parse(location.search).Subject,
              getQueryOptions(qs.parse(location.search)),
            ),
          ),
        ),
    },
  ]),
)(Search);
