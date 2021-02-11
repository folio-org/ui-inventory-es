import React from 'react';
import PropTypes from 'prop-types';
import TextArea from '@folio/stripes-components/lib/TextArea';

const defaultStyle = {
  height: '20px',
  resize: 'none',
};

const propTypes = {
  onChange: PropTypes.func,
  searchButtonRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  style: PropTypes.object,
  value: PropTypes.string,
};

const ElasticQueryField = props => {
  const {
    onChange,
    searchButtonRef = {},
    style = defaultStyle,
    value = '',
  } = props;

  const handleSearchTermsChange = event => {
    onChange(event);
  };

  const handleKeyDown = event => {
    switch (event.keyCode) {
      case 13: // enter
        event.preventDefault();
        if (searchButtonRef.current) {
          searchButtonRef.current.click();
        }
        break;
      default:
    }
  };

  return (
    <TextArea
      style={style}
      marginBottom0
      value={value}
      onChange={handleSearchTermsChange}
      onKeyDown={handleKeyDown}
    />
  );
};

ElasticQueryField.propTypes = propTypes;

export default ElasticQueryField;
