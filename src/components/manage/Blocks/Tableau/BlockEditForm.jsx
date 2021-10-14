import React from 'react';
import { keys, map } from 'lodash';
import { Field } from '@plone/volto/components';
import { Segment, Message } from 'semantic-ui-react';

const BlockEditForm = ({
  schema,
  title,
  description,
  onChangeField,
  error, // Such as {message: "It's not good"}
  errors = {},
  formData,
  block,
}) => {
  const defaultFieldset = schema.fieldsets.find((o) => o.id === 'default');
  const other = schema.fieldsets.filter((o) => o.id !== 'default');
  return (
    <Segment.Group raised>
      <header className="header pulled">
        <h2>{title || 'Edit values'}</h2>
      </header>
      {description && <Segment secondary>{description}</Segment>}
      {keys(errors).length > 0 && (
        <Message
          icon="warning"
          negative
          attached
          header="Error"
          content="There were some errors"
        />
      )}
      {error && (
        <Message
          icon="warning"
          negative
          attached
          header="Error"
          content={error.message}
        />
      )}

      <div id={`blockform-fieldset-${defaultFieldset.id}`}>
        <Segment className="form sidebar-image-data">
          {map(defaultFieldset.fields, (field, index) => (
            <Field
              {...schema.properties[field]}
              id={field}
              fieldSet={defaultFieldset.title.toLowerCase()}
              focus={index === 0}
              value={formData[field] || schema.properties[field].defaultValue}
              required={schema.required.indexOf(field) !== -1}
              onChange={(id, value) => {
                onChangeField(id, value);
              }}
              key={field}
              error={errors[field]}
              block={block}
            />
          ))}
        </Segment>
      </div>

      {other.map((fieldset) => (
        <div key={fieldset.id} id={`blockform-fieldset-${fieldset.id}`}>
          {title && <Segment className="secondary">{fieldset.title}</Segment>}
          <Segment className="form sidebar-image-data">
            {map(fieldset.fields, (field) => (
              <Field
                {...schema.properties[field]}
                id={field}
                value={formData[field]}
                required={schema.required.indexOf(field) !== -1}
                onChange={(id, value) => {
                  onChangeField(id, value);
                }}
                key={field}
                error={errors[field]}
                block={block}
              />
            ))}
          </Segment>
        </div>
      ))}
    </Segment.Group>
  );
};

export default BlockEditForm;
