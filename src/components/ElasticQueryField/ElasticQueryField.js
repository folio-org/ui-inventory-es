import React from 'react';
import PropTypes from 'prop-types';
import TextArea from '@folio/stripes-components/lib/TextArea';

const propTypes = {
  onChange: PropTypes.func,
  searchButtonRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  value: PropTypes.string,
};

const ElasticQueryField = props => {
  const {
    onChange,
    searchButtonRef = {},
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
      marginBottom0
      value={value}
      onChange={handleSearchTermsChange}
      onKeyDown={handleKeyDown}
    />
  );
};

ElasticQueryField.propTypes = propTypes;

export default ElasticQueryField;
