import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Form, Input } from 'semantic-ui-react';
import { compose } from 'redux';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import qs from 'query-string';
import { isArray, isObject, isString } from 'lodash';
import { Icon } from '@plone/volto/components';
import zoomSVG from '@plone/volto/icons/zoom.svg';
import clearSVG from '@plone/volto/icons/clear.svg';
import config from '@plone/volto/registry';
import { quickResetSearchContent, quickSearchContent } from '~/actions';
import Highlighter from 'react-highlight-words';
import cx from 'classnames';
import { setQueryParam, deleteQueryParam } from '@eeacms/volto-datablocks/actions';
import './style.css';

const messages = defineMessages({
  search: {
    id: 'Search',
    defaultMessage: 'Search',
  },
  searchSite: {
    id: 'Search Site',
    defaultMessage: 'Search Site',
  },
});

/**
 * View search block component.
 * @class View
 * @extends Component
 */
class View extends Component {
  constructor(props) {
    super(props);
    this.state = {
      providerUrl: config.settings.providerUrl,
      text: '',
      apiRoot: new URL(config.settings.apiPath).pathname,
      active: false,
      query: {},
      loading: false,
    };
    this.linkFormContainer = React.createRef();
    this.linkInput = React.createRef();
    this.onSubmit = this.onSubmit.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.onSelectItem = this.onSelectItem.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onChange = this.onChange.bind(this);
    this.makeQuery = this.makeQuery.bind(this);
  }

  componentDidMount() {
    if (
      this.props.data?.query?.value &&
      isString(this.props.data.query.value)
    ) {
      const query = JSON.parse(this.props.data.query.value);
      this.setState({ query });
    } else if (
      this.props.data?.query?.value &&
      isObject(this.props.data.query.value)
    ) {
      this.setState({ query: this.props.data.query.value });
    }
    this.props.quickResetSearchContent();
    document.addEventListener('mousedown', this.handleClickOutside, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside, false);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location?.state?.text && this.props?.location?.state?.text) {
      if (prevProps.location.state.text !== this.props.location.state.text) {
        this.setState(
          {
            text: this.props?.location?.state?.text,
          },
          () => {
            const title = this.props.data?.title
              ? `&title=${this.props.data.title.value}`
              : '';
            const description = this.props.data?.description
              ? `&description=${this.props.data.description.value}`
              : '';
            this.props.history.push({
              pathname: `/search`,
              search: `?SearchableText=${
                this.state.text
              }${this.makeQuery()}${title}${description}`,
              state: { text: this.state.text },
            });
          },
        );
      }
    }
    if (prevProps.data.query?.value !== this.props.data.query?.value) {
      if (
        this.props.data.query.value &&
        isString(this.props.data.query.value)
      ) {
        const query = JSON.parse(this.props.data.query.value);
        this.setState({ query });
      } else if (
        this.props.data.query.value &&
        isObject(this.props.data.query.value)
      ) {
        this.setState({ query: this.props.data.query.value });
      }
    }
  }

  onSubmit(event) {
    const title = this.props.data?.title
      ? `&title=${this.props.data.title.value}`
      : '';
    const description = this.props.data?.description
      ? `&description=${this.props.data.description.value}`
      : '';
    this.props.history.push({
      pathname: `/search`,
      search: `?SearchableText=${
        this.state.text
      }${this.makeQuery()}${title}${description}`,
      state: { text: this.state.text },
    });
    this.setState({ active: false });
    event && event.preventDefault();
  }

  handleClickOutside(e) {
    if (
      this.linkFormContainer &&
      !this.linkFormContainer.current.contains(e.target)
    ) {
      return this.setState({ active: false });
    } else {
      this.setState({ active: true });
    }
  }

  onChange(event, { value }) {
    if (value && value !== '') {
      this.props.quickSearchContent('', {
        SearchableText: `*${value}*`,
        ...this.makeQueryObject(),
      });
    } else {
      this.props.quickResetSearchContent();
    }
    this.setState({ text: value });
  }

  onSelectItem(item) {
    item?.['@id'] && this.props.history.push(item['@id']);
  }

  onClose() {
    this.props.quickResetSearchContent();
    this.setState({ active: false });
  }

  makeQuery() {
    let query = '';
    this.state.query.properties &&
      isObject(this.state.query.properties) &&
      Object.entries(this.state.query.properties).forEach(([itemKey, item]) => {
        if (isArray(item.value)) {
          item.value.forEach((value) => {
            query += `&${itemKey}:query=${value}`;
          });
        } else if (item.value) {
          query += `&${itemKey}:query=${item.value}`;
        }
      });
    return query;
  }

  makeQueryObject() {
    const queryObj = {};
    this.state.query.properties &&
      isObject(this.state.query.properties) &&
      Object.entries(this.state.query.properties).forEach(([itemKey, item]) => {
        if (isArray(item.value)) {
          queryObj[itemKey] = item.value;
        } else if (item.value) {
          queryObj[itemKey] = [];
          queryObj[itemKey].push(item.value);
        }
      });
    return queryObj;
  }

  render() {
    return (
      <div ref={this.linkFormContainer}>
        <Form
          className="searchform"
          autoComplete="off"
          action="/search"
          onSubmit={this.onSubmit}
        >
          <Form.Field className="searchbox">
            <div
              style={{
                width: '100%',
                position: 'relative',
                marginRight: this.props.data?.searchButton?.value
                  ? '1rem'
                  : '0',
              }}
            >
              <Icon
                className="searchIcon"
                onClick={this.onSubmit}
                name={zoomSVG}
                size="26px"
              />
              <Input
                className={cx(this.props.data.className?.value)}
                ref={this.linkInput}
                aria-label="Glossary search"
                placeholder={this.props.data?.placeholder?.value || ''}
                title={this.props.intl.formatMessage(messages.search)}
                onChange={this.onChange}
                value={this.state.text}
                name="SearchableText"
                transparent
              />
              {this.state.text.length ? (
                <Icon
                  className="clearIcon"
                  name={clearSVG}
                  size="26px"
                  onClick={() => {
                    this.setState({
                      text: '',
                    });
                    this.onClose();
                  }}
                />
              ) : (
                ''
              )}
              {this.state.active &&
              this.props.search &&
              !this.state.loading &&
              this.props.search.length ? (
                <ul className="floating_search_results">
                  {this.props.search.map((item, index) => {
                    return (
                      <li
                        key={`${index}_${item['@id']}`}
                        onClick={() => this.onSelectItem(item)}
                        role="presentation"
                      >
                        <Highlighter
                          highlightClassName="highlight"
                          searchWords={this.state.text?.split(' ') || []}
                          autoEscape={true}
                          textToHighlight={item.title}
                        />
                      </li>
                    );
                  })}
                </ul>
              ) : (
                ''
              )}
            </div>
            {this.props.data?.searchButton?.value ? (
              <button
                aria-label={this.props.intl.formatMessage(messages.search)}
                className={this.props.data?.buttonClassName?.value}
              >
                {this.props.data?.buttonText?.value}
              </button>
            ) : (
              ''
            )}
          </Form.Field>
        </Form>
      </div>
    );
  }
}

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
View.propTypes = {
  //   data: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default compose(
  withRouter,
  injectIntl,
  connect(
    (state, props) => ({
      search: state.quicksearch.items,
      path: qs.parse(props.location.search).path,
    }),
    {
      quickResetSearchContent,
      quickSearchContent,
      setQueryParam,
      deleteQueryParam,
    },
  ),
)(View);
