import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  FilterAccordionHeader,
} from '@folio/stripes/components';
import { AccordionSet } from '@folio/stripes-components';

import TagsFilter from '../TagsFilter';
import CheckboxFacet from '../CheckboxFacet';
import { useFacets } from '../../common/hooks';
import { FACETS } from '../../constants';

const HoldingsRecordFilters = (props) => {
  const {
    activeFilters: {
      holdingsDiscoverySuppress,
      effectiveLocation,
      holdingsPermanentLocation,
      holdingsTags,
    },
    data,
    onChange,
    onClear,
  } = props;

  const [
    accordions,
    onToggleSection,
    handleFetchFacets,
    handleFilterSearch,
    facetsOptions,
    getIsPending,
  ] = useFacets(props.activeFilters, data);

  return (
    <AccordionSet accordionStatus={accordions} onToggle={onToggleSection}>
      <Accordion
        label={<FormattedMessage id={`ui-inventory.filters.${FACETS.EFFECTIVE_LOCATION}`} />}
        id={FACETS.EFFECTIVE_LOCATION}
        name={FACETS.EFFECTIVE_LOCATION}
        separator={false}
        header={FilterAccordionHeader}
        displayClearButton={effectiveLocation?.length > 0}
        onClearFilter={() => onClear(FACETS.EFFECTIVE_LOCATION)}
      >
        <CheckboxFacet
          name={FACETS.EFFECTIVE_LOCATION}
          dataOptions={facetsOptions.effectiveLocationOptions}
          selectedValues={effectiveLocation}
          onChange={onChange}
          onFetch={handleFetchFacets}
          onSearch={handleFilterSearch}
          isPending={getIsPending(FACETS.EFFECTIVE_LOCATION)}
          isFilterable
        />
      </Accordion>
      <Accordion
        label={<FormattedMessage id="ui-inventory.holdings.permanentLocation" />}
        id={FACETS.HOLDINGS_PERMANENT_LOCATION}
        name={FACETS.HOLDINGS_PERMANENT_LOCATION}
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={holdingsPermanentLocation?.length > 0}
        onClearFilter={() => onClear(FACETS.HOLDINGS_PERMANENT_LOCATION)}
      >
        <CheckboxFacet
          name={FACETS.HOLDINGS_PERMANENT_LOCATION}
          dataOptions={facetsOptions.holdingsPermanentLocationOptions}
          selectedValues={holdingsPermanentLocation}
          onChange={onChange}
          onFetch={handleFetchFacets}
          onSearch={handleFilterSearch}
          isPending={getIsPending(FACETS.HOLDINGS_PERMANENT_LOCATION)}
          isFilterable
        />
      </Accordion>
      <Accordion
        data-test-filter-holding-discovery-suppress
        label={<FormattedMessage id="ui-inventory.discoverySuppress" />}
        id={FACETS.HOLDINGS_DISCOVERY_SUPPRESS}
        name={FACETS.HOLDINGS_DISCOVERY_SUPPRESS}
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={holdingsDiscoverySuppress?.length > 0}
        onClearFilter={() => onClear(FACETS.HOLDINGS_DISCOVERY_SUPPRESS)}
      >
        <CheckboxFacet
          data-test-filter-holdings-discovery-suppress
          name={FACETS.HOLDINGS_DISCOVERY_SUPPRESS}
          dataOptions={facetsOptions.discoverySuppressOptions}
          isPending={getIsPending(FACETS.HOLDINGS_DISCOVERY_SUPPRESS)}
          selectedValues={holdingsDiscoverySuppress}
          onChange={onChange}
        />
      </Accordion>
      <TagsFilter
        id={FACETS.HOLDINGS_TAGS}
        onChange={onChange}
        onFetch={handleFetchFacets}
        onSearch={handleFilterSearch}
        onClear={onClear}
        selectedValues={holdingsTags}
        tagsRecords={facetsOptions.tagsRecords}
        isPending={getIsPending(FACETS.HOLDINGS_TAGS)}
      />
    </AccordionSet>
  );
};

HoldingsRecordFilters.propTypes = {
  activeFilters: PropTypes.objectOf(PropTypes.array),
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  data: PropTypes.object,
};

HoldingsRecordFilters.defaultProps = {
  activeFilters: {},
};

export default HoldingsRecordFilters;
