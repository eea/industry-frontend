import React, { Component } from 'react';
import { Button, Input } from 'semantic-ui-react';
import { defineMessages, injectIntl } from 'react-intl';
import { toast } from 'react-toastify';
import config from '@plone/volto/registry';
import TableauReport from './TableauReport';
import { compose } from 'redux';
import editingSVG from '@plone/volto/icons/editing.svg';
import clearSVG from '@plone/volto/icons/clear.svg';
import { Icon } from '@plone/volto/components';
import trashSVG from '@plone/volto/icons/delete.svg';
import { Toast } from '@plone/volto/components';
import { SidebarPortal } from '@plone/volto/components'; // EditBlock
import BlockEditForm from './BlockEditForm';

import schema from './schema';
//
// import { ResponsiveContainer } from 'recharts';
//FormattedMessage, , injectIntl

const messages = defineMessages({
  readyForSave: {
    id: 'readyForSave',
    defaultMessage: 'Tableau is ready to be saved',
  },
  modifiedAndReadyForSave: {
    id: 'modifiedAndReadyForSave',
    defaultMessage: 'Your modifications are ready to be saved',
  },
});

class TableauEdit extends Component {
  constructor(props) {
    super(props);

    const data = this.props.data;
    let show = !__SERVER__ && data ? true : false;

    let filters =
      data && data.filters && data.sheetname
        ? data.filters[data.sheetname]
        : {};

    this.state = {
      show,
      tableauVersion: (data && data.tableauVersion) || '',
      url: (data && data.url) || '',
      filters: data.filters,
      sheetname: (data && data.sheetname) || '',
      error: false,
      hideTabs: (data && data.hideTabs) || false,
      hideToolbars: (data && data.hideToolbars) || false,
      hideShare: (data && data.hideShare) || false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.saveCallback = this.saveCallback.bind(this);
  }
  componentDidCatch(e) {
    console.log(e);
    this.setState({ error: this.state.url, url: '', show: false });
  }

  handleChange(e) {
    e.preventDefault();
    let data = e.target.value;
    try {
      data = e.target.value;
      this.setState({
        url: data,
        error: false,
      });
    } catch {
      console.warning('Invalid JSON data: ', data);
    }
  }

  onSubmit() {
    this.props.onChangeBlock(this.props.block, {
      ...this.props.data,
      filters: this.state.filters,
      tableauVersion: this.state.tableauVersion,
      url: this.state.url,
      sheetname: this.state.sheetname,
    });
    // this.props.handleClose();
    toast.success(
      <Toast
        sucess
        title={this.props.intl.formatMessage(messages.readyForSave)}
        // content={this.props.intl.formatMessage(messages.readyForSaveContent)}
      />,
      { autoClose: true, toastId: 'readyForSave' },
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.url !== this.state.url) {
      this.props.onChangeBlock(this.props.block, {
        ...this.props.data,
        url: this.state.url,
      });
    }

    if (prevState !== this.state) {
      this.props.onChangeBlock(this.props.block, {
        ...this.props.data,
        tableauVersion: this.state.tableauVersion,
        url: this.state.url,
        hideTabs: this.state.hideTabs,
        hideToolbars: this.state.hideToolbars,
        sheetname: this.state.sheetname,
        filters: this.state.filters,
        hideShare: this.state.hideShare,
      });
    }
  }

  onBlockEdit(id, value) {
    console.log('block changed from sidebar', id, value);
    this.setState({ [id]: value });
  }

  saveCallback(saveData) {
    console.log('Received save data', saveData);
    this.setState(
      {
        ...saveData,
      },
      this.onSubmit,
    );
    toast.success(
      <Toast
        sucess
        title={this.props.intl.formatMessage(messages.modifiedAndReadyForSave)}
        // content={this.props.intl.formatMessage(messages.readyForSaveContent)}
      />,
      { autoClose: true, toastId: 'modifiedAndReadyForSave' },
    );
  }

  render() {
    if (__SERVER__) return '';
    // const TableauReport = require('tableau-react');
    // console.log(this.state);
    //
    const options = {
      ...this.state.filters,
      hideTabs: this.state.hideTabs,
      hideToolbars: this.state.hideToolbars,
    };

    // const parameters = {
    // };

    // <ResponsiveContainer style={{ width: '100%', overflowX: 'auto' }}>
    // </ResponsiveContainer>
    return (
      <div className="block chartWrapperEdit">
        <div className="block-inner-wrapper">
          {this.state.url ? (
            <div className="image-add">
              <div className="toolbar">
                <Button.Group>
                  <Button
                    icon
                    basic
                    onClick={() =>
                      console.log('block selected. Can be edited from sidebar.')
                    }
                  >
                    <Icon name={editingSVG} size="24px" color="#e40166" />
                  </Button>
                  <Button
                    icon
                    basic
                    onClick={() => this.props.onDeleteBlock(this.props.block)}
                  >
                    <Icon name={trashSVG} size="24px" color="#e40166" />
                  </Button>
                  <Button
                    icon
                    basic
                    onClick={() => {
                      this.setState({ url: '', show: false });
                      this.props.onChangeBlock(this.props.block, {
                        ...this.props.data,
                        filters: '',
                        url: '',
                        sheetname: '',
                      });
                    }}
                  >
                    <Icon name={clearSVG} size="24px" color="#e40166" />
                  </Button>
                </Button.Group>
              </div>

              <TableauReport
                url={this.state.url}
                tableauVersion={
                  this.props.data.tableauVersion ||
                  config.settings.tableauVersion
                }
                filters={this.state.filters}
                sheetname={this.state.sheetname}
                callback={this.saveCallback}
                options={options}
                // parameters={parameters}
                hideShare={this.state.hideShare}
              />
            </div>
          ) : (
            <p>Please use Sidebar to set Tableau URL</p>
          )}
        </div>
        <SidebarPortal selected={this.props.selected}>
          <BlockEditForm
            schema={schema}
            title={schema.title}
            onChangeField={(id, value) => this.onBlockEdit(id, value)}
            formData={this.props.data}
            block={this.props.block}
          />
        </SidebarPortal>
      </div>
    );
  }
}

export default compose(injectIntl)(TableauEdit);
