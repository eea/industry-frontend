import React, { useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { CompactPicker } from 'react-color';
import { TextareaWidget } from '@plone/volto/components';
import './style.css';

const ColorPickerWidget = (props) => {
  const [state, setState] = useState({
    color: '#fff',
  });

  const handleChangeComplete = (color) => {
    props.onChange(props.id, color.hex);
  };

  return (
    <div className="color-picker-widget">
      <span className="color-picker-label">{props.title}</span>
      <CompactPicker
        className="color-picker"
        color={props.value || '#000'}
        onChangeComplete={handleChangeComplete}
      />
    </div>
  );
};

export default compose(
  connect((state, props) => ({
    pathname: state.router.location.pathname,
    discodata_query: state.discodata_query,
  })),
)(ColorPickerWidget);
