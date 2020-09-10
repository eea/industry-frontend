/* REACT */
import React from 'react';

const View = ({ content, ...props }) => {
  if (props.mode === 'edit')
    return <p>Dummy block with {props.data.portalId} id</p>;
  return <div id={props.data.portalId} />;
};

export default View;
