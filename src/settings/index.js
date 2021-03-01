import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { Settings } from '@folio/stripes/smart-components';

class InventorySettings extends React.Component {
  render() {
    return (
      <Settings
        {...this.props}
        paneTitle={<FormattedMessage id="ui-inventory-es.inventory.label" />}
        data-test-inventory-settings
      />
    );
  }
}

InventorySettings.propTypes = {
  stripes: PropTypes.object,
};

export default InventorySettings;
