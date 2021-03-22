import { isEmpty } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Accordion,
  AccordionSet,
  FilterAccordionHeader,
} from '@folio/stripes/components';

import TagsFilter from '../TagsFilter';
import CheckboxFacet from '../CheckboxFacet';
import { useFacets } from '../../common/hooks';
import { FACETS } from '../../constants';

const ItemFilters = (props) => {
  const {
    activeFilters: {
      materialType,
      itemStatus,
      effectiveLocation,
      holdingsPermanentLocation,
      itemsDiscoverySuppress,
      itemsTags,
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
        label={<FormattedMessage id="ui-inventory.item.status" />}
        id={FACETS.ITEM_STATUS}
        name={FACETS.ITEM_STATUS}
        header={FilterAccordionHeader}
        displayClearButton={!isEmpty(itemStatus)}
        onClearFilter={() => onClear(FACETS.ITEM_STATUS)}
      >
        <CheckboxFacet
          name={FACETS.ITEM_STATUS}
          dataOptions={facetsOptions.itemStatusesOptions}
          selectedValues={itemStatus}
          onChange={onChange}
          onSearch={handleFilterSearch}
          onFetch={handleFetchFacets}
          isPending={getIsPending(FACETS.ITEM_STATUS)}
          isFilterable
        />
      </Accordion>
      <Accordion
        label={<FormattedMessage id={`ui-inventory.filters.${FACETS.EFFECTIVE_LOCATION}`} />}
        id={FACETS.EFFECTIVE_LOCATION}
        name={FACETS.EFFECTIVE_LOCATION}
        separator
        header={FilterAccordionHeader}
        displayClearButton={effectiveLocation?.length > 0}
        onClearFilter={() => onClear(FACETS.EFFECTIVE_LOCATION)}
      >
        <CheckboxFacet
          name={FACETS.EFFECTIVE_LOCATION}
          dataOptions={facetsOptions.effectiveLocationOptions}
          selectedValues={effectiveLocation}
          onChange={onChange}
          onSearch={handleFilterSearch}
          onFetch={handleFetchFacets}
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
          onSearch={handleFilterSearch}
          onFetch={handleFetchFacets}
          isPending={getIsPending(FACETS.HOLDINGS_PERMANENT_LOCATION)}
          isFilterable
        />
      </Accordion>
      <Accordion
        label={<FormattedMessage id={`ui-inventory.${FACETS.MATERIAL_TYPE}`} />}
        id={FACETS.MATERIAL_TYPE}
        name={FACETS.MATERIAL_TYPE}
        separator
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={!isEmpty(materialType)}
        onClearFilter={() => onClear(FACETS.MATERIAL_TYPE)}
      >
        <CheckboxFacet
          name={FACETS.MATERIAL_TYPE}
          id="materialTypeFilter"
          dataOptions={facetsOptions.materialTypesOptions}
          selectedValues={materialType}
          onChange={onChange}
          onSearch={handleFilterSearch}
          onFetch={handleFetchFacets}
          isPending={getIsPending(FACETS.MATERIAL_TYPE)}
          isFilterable
        />
      </Accordion>
      <Accordion
        label={<FormattedMessage id="ui-inventory.discoverySuppress" />}
        id={FACETS.ITEMS_DISCOVERY_SUPPRESS}
        name={FACETS.ITEMS_DISCOVERY_SUPPRESS}
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={itemsDiscoverySuppress?.length > 0}
        onClearFilter={() => onClear(FACETS.ITEMS_DISCOVERY_SUPPRESS)}
      >
        <CheckboxFacet
          data-test-filter-item-discovery-suppress
          name={FACETS.ITEMS_DISCOVERY_SUPPRESS}
          dataOptions={facetsOptions.discoverySuppressOptions}
          selectedValues={itemsDiscoverySuppress}
          onChange={onChange}
          isPending={getIsPending(FACETS.ITEMS_DISCOVERY_SUPPRESS)}
        />
      </Accordion>
      <TagsFilter
        id={FACETS.ITEMS_TAGS}
        onChange={onChange}
        onClear={onClear}
        onSearch={handleFilterSearch}
        onFetch={handleFetchFacets}
        selectedValues={itemsTags}
        tagsRecords={facetsOptions.tagsRecords}
        isPending={getIsPending(FACETS.ITEMS_TAGS)}
      />
    </AccordionSet>
  );
};

ItemFilters.propTypes = {
  activeFilters: PropTypes.objectOf(PropTypes.array),
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  data: PropTypes.object,
};

ItemFilters.defaultProps = {
  activeFilters: {},
};

export default ItemFilters;
