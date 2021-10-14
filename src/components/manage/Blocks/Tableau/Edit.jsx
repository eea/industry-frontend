import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';
import { defineMessages, injectIntl } from 'react-intl';
import { toast } from 'react-toastify';
import config from '@plone/volto/registry';
import Tableau from './Tableau';
import { compose } from 'redux';
import { Icon } from '@plone/volto/components';
import trashSVG from '@plone/volto/icons/delete.svg';
import { Toast } from '@plone/volto/components';
import RenderFields from '~/components/manage/Widgets/RenderFields';
import qs from 'query-string';

const makeChoices = (keys) => keys && keys.map((k) => [k, k]);

const messages = defineMessages({
  readyForSave: {
    id: 'readyForSave',
    defaultMessage: 'Tableau is ready to be saved',
  },
  modifiedAndReadyForSave: {
    id: 'modifiedAndReadyForSave',
    defaultMessage: 'Your modifications are ready to be saved',
  },
  invalidUrl: {
    id: 'invalidUrl',
    defaultMessage: 'Please make sure you enter a valid url',
  },
});

const getSchema = (props) => {
  const { query } = qs.parse(props.query);
  const { search } = props.discodata_query || {};
  const globalQuery = { ...query, ...search };

  console.log(globalQuery);
  return {
    tableauVersion: {
      type: 'array',
      title: 'Tableau Version',
      defaultValue: props.tableauVersion || '2.3.0',
      choices: [
        ['2.3.0', '2.3.0'],
        ['2.4.0', '2.4.0'],
        ['2.5.0', '2.5.0'],
      ],
    },
    url: {
      type: 'text',
      title: 'Tableau Viz Url',
    },
    queryParameters: {
      title: 'Query parameters',
      type: 'schema',
      fieldSetTitle: 'Query parameters metadata',
      fieldSetId: 'query_parameters_metadata',
      fieldSetSchema: {
        fieldsets: [
          {
            id: 'default',
            title: 'title',
            fields: ['title', 'id', 'urlQuery', 'queryParam'],
          },
        ],
        properties: {
          title: {
            title: 'Title',
            type: 'text',
          },
          id: {
            title: 'Id',
            type: 'text',
            description: 'This will be used as query param key for tableau',
          },
          urlQuery: {
            title: 'Use Query from url',
            type: 'boolean',
            defaultValue: true,
          },
          queryParam: {
            title: 'Query to use',
            type: (formData) => (formData.urlQuery ? 'array' : 'text'),
            choices: (formData) =>
              formData.urlQuery
                ? globalQuery
                  ? makeChoices(Object.keys(globalQuery))
                  : []
                : undefined,
          },
        },
        required: ['id', 'title', 'key'],
      },
      editFieldset: false,
      deleteFieldset: false,
    },
    hideTabs: {
      type: 'boolean',
      title: 'Hide Tabs',
    },
    hideToolbars: {
      type: 'boolean',
      title: 'Hide Toolbars',
    },
    hideShare: {
      type: 'boolean',
      title: 'Hide Share',
    },
  };
};

class TableauEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      schema: getSchema({
        ...props,
        tableauVersion: config.settings.tableauVersion,
      }),
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidCatch(e) {
    this.setState({ error: this.props.data.url?.value }, () => {
      toast.error(
        <Toast
          error
          title={this.props.intl.formatMessage(messages.invalidUrl)}
        />,
        { autoClose: true, toastId: 'vinvalidUrl' },
      );
    });
    this.props.onChangeBlock(this.props.block, {
      ...this.props.data,
      url: {
        value: '',
      },
    });
  }

  onSubmit(saveData) {
    this.props.onChangeBlock(this.props.block, {
      ...this.props.data,
      url: {
        value: saveData.url,
      },
      sheetname: {
        value: saveData.sheetname,
      },
      filters: {
        value: saveData.filters || {},
      },
    });
    toast.success(
      <Toast
        sucess
        title={this.props.intl.formatMessage(messages.readyForSave)}
      />,
      { autoClose: true, toastId: 'readyForSave' },
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      JSON.stringify(prevProps.discodata_query?.search) !==
      JSON.stringify(this.props.discodata_query?.search)
    ) {
      const schema = getSchema({
        ...this.props,
        tableauVersion: config.settings.tableauVersion,
      });
      this.setState({ schema, error: false });
    } else if (this.state.error) {
      this.setState({ error: false });
    }
  }

  render() {
    if (__SERVER__) return '';
    const {
      url,
      tableauVersion,
      filters,
      sheetname,
      hideTabs,
      hideToolbars,
      hideShare,
    } = this.props.data;
    const options = {
      filters: filters?.value || {},
      hideTabs: hideTabs?.value || '',
      hideToolbars: hideToolbars?.value || '',
    };
    const { query } = qs.parse(this.props);
    const { search } = this.props.discodata_query || {};
    const globalQuery = { ...query, ...search };
    const queryParameters = this.props.data?.queryParameters?.value
      ? JSON.parse(this.props.data.queryParameters.value).properties
      : {};
    const queryParametersToSet = {};
    queryParameters &&
      Object.entries(queryParameters).forEach(([key, value]) => {
        queryParametersToSet[key] = globalQuery[value.queryParam] || '';
      });
    return (
      <div className="block chartWrapperEdit">
        <div className="block-inner-wrapper">
          {url?.value && !this.state.error ? (
            <div className="image-add">
              <div className="toolbar">
                <Button.Group>
                  <Button
                    icon
                    basic
                    onClick={() =>
                      this.props.onChangeBlock(this.props.block, {
                        ...this.props.data,
                        filters: { value: {} },
                        url: { value: '' },
                        sheetname: { value: '' },
                      })
                    }
                  >
                    <Icon name={trashSVG} size="24px" color="#e40166" />
                  </Button>
                </Button.Group>
              </div>

              <Tableau
                url={url?.value}
                tableauVersion={
                  tableauVersion?.value || config.settings.tableauVersion
                }
                filters={filters?.value}
                sheetname={sheetname?.value}
                callback={this.onSubmit}
                options={options}
                hideShare={hideShare?.value}
                queryParameters={queryParametersToSet}
              />
            </div>
          ) : (
            <p>Please use Sidebar to set Tableau URL</p>
          )}
        </div>
        <RenderFields
          schema={this.state.schema}
          {...this.props}
          title={'Tableau'}
        />
      </div>
    );
  }
}

export default compose(
  injectIntl,
  connect((state, props) => ({
    query: state.router.location.search,
    discodata_query: state.discodata_query,
  })),
)(TableauEdit);
