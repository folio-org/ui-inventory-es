import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  AccordionSet,
  FilterAccordionHeader,
} from '@folio/stripes/components';
import {
  DateRangeFilter,
} from '@folio/stripes/smart-components';

import {
  retrieveDatesFromDateRangeFilterString,
  makeDateRangeFilterString,
} from '../../utils';
import {
  DATE_FORMAT,
  FACETS
} from '../../constants';
import TagsFilter from '../TagsFilter';
import CheckboxFacet from '../CheckboxFacet';
import { useFacets } from '../../common/hooks';

const InstanceFilters = props => {
  const {
    activeFilters: {
      effectiveLocation,
      resource,
      language,
      format,
      mode,
      natureOfContent,
      instancesDiscoverySuppress,
      staffSuppress,
      createdDate,
      updatedDate,
      source,
      instancesTags,
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
          onSearch={handleFilterSearch}
          isFilterable
          isPending={getIsPending(FACETS.EFFECTIVE_LOCATION)}
          onFetch={handleFetchFacets}
        />
      </Accordion>
      <Accordion
        label={<FormattedMessage id={`ui-inventory.instances.${FACETS.LANGUAGE}`} />}
        id={FACETS.LANGUAGE}
        name={FACETS.LANGUAGE}
        separator={false}
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={language?.length > 0}
        onClearFilter={() => onClear(FACETS.LANGUAGE)}
      >
        <CheckboxFacet
          name={FACETS.LANGUAGE}
          dataOptions={facetsOptions.langOptions}
          selectedValues={language}
          onChange={onChange}
          onSearch={handleFilterSearch}
          isFilterable
          isPending={getIsPending(FACETS.LANGUAGE)}
          onFetch={handleFetchFacets}
        />
      </Accordion>
      <Accordion
        label={<FormattedMessage id="ui-inventory.instances.resourceType" />}
        id={FACETS.RESOURCE}
        name={FACETS.RESOURCE}
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={resource?.length > 0}
        onClearFilter={() => onClear(FACETS.RESOURCE)}
      >
        <CheckboxFacet
          name={FACETS.RESOURCE}
          dataOptions={facetsOptions.resourceTypeOptions}
          selectedValues={resource}
          onChange={onChange}
          onSearch={handleFilterSearch}
          isFilterable
          isPending={getIsPending(FACETS.RESOURCE)}
          onFetch={handleFetchFacets}
        />
      </Accordion>
      <Accordion
        label={<FormattedMessage id="ui-inventory.instanceFormat" />}
        id={FACETS.FORMAT}
        name={FACETS.FORMAT}
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={format?.length > 0}
        onClearFilter={() => onClear(FACETS.FORMAT)}
      >
        <CheckboxFacet
          name={FACETS.FORMAT}
          dataOptions={facetsOptions.instanceFormatOptions}
          selectedValues={format}
          onChange={onChange}
          onSearch={handleFilterSearch}
          isFilterable
          isPending={getIsPending(FACETS.FORMAT)}
          onFetch={handleFetchFacets}
        />
      </Accordion>
      <Accordion
        label={<FormattedMessage id="ui-inventory.modeOfIssuance" />}
        id={FACETS.MODE}
        name={FACETS.MODE}
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={mode?.length > 0}
        onClearFilter={() => onClear(FACETS.MODE)}
      >
        <CheckboxFacet
          name={FACETS.MODE}
          dataOptions={facetsOptions.modeOfIssuanceOptions}
          selectedValues={mode}
          onChange={onChange}
          onSearch={handleFilterSearch}
          isFilterable
          isPending={getIsPending(FACETS.MODE)}
          onFetch={handleFetchFacets}
        />
      </Accordion>
      <Accordion
        label={<FormattedMessage id="ui-inventory.natureOfContentTerms" />}
        id={FACETS.NATURE_OF_CONTENT}
        name={FACETS.NATURE_OF_CONTENT}
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={mode?.length > 0}
        onClearFilter={() => onClear(FACETS.NATURE_OF_CONTENT)}
      >
        <CheckboxFacet
          name={FACETS.NATURE_OF_CONTENT}
          dataOptions={facetsOptions.natureOfContentOptions}
          selectedValues={natureOfContent}
          onChange={onChange}
          onSearch={handleFilterSearch}
          isFilterable
          isPending={getIsPending(FACETS.NATURE_OF_CONTENT)}
          onFetch={handleFetchFacets}
        />
      </Accordion>
      <Accordion
        label={<FormattedMessage id={`ui-inventory.${FACETS.STAFF_SUPPRESS}`} />}
        id={FACETS.STAFF_SUPPRESS}
        name={FACETS.STAFF_SUPPRESS}
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={staffSuppress?.length > 0}
        onClearFilter={() => onClear(FACETS.STAFF_SUPPRESS)}
      >
        <CheckboxFacet
          name={FACETS.STAFF_SUPPRESS}
          dataOptions={facetsOptions.suppressedOptions}
          selectedValues={staffSuppress}
          isPending={getIsPending(FACETS.STAFF_SUPPRESS)}
          onChange={onChange}
        />
      </Accordion>
      <Accordion
        label={<FormattedMessage id="ui-inventory.discoverySuppress" />}
        id={FACETS.INSTANCES_DISCOVERY_SUPPRESS}
        name={FACETS.INSTANCES_DISCOVERY_SUPPRESS}
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={instancesDiscoverySuppress?.length > 0}
        onClearFilter={() => onClear(FACETS.INSTANCES_DISCOVERY_SUPPRESS)}
      >
        <CheckboxFacet
          data-test-filter-instance-discovery-suppress
          name={FACETS.INSTANCES_DISCOVERY_SUPPRESS}
          dataOptions={facetsOptions.discoverySuppressOptions}
          selectedValues={instancesDiscoverySuppress}
          isPending={getIsPending(FACETS.INSTANCES_DISCOVERY_SUPPRESS)}
          onChange={onChange}
        />
      </Accordion>
      <Accordion
        label={<FormattedMessage id={`ui-inventory.${FACETS.CREATED_DATE}`} />}
        id={FACETS.CREATED_DATE}
        name={FACETS.CREATED_DATE}
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={createdDate?.length > 0}
        onClearFilter={() => onClear(FACETS.CREATED_DATE)}
      >
        <DateRangeFilter
          name={FACETS.CREATED_DATE}
          dateFormat={DATE_FORMAT}
          selectedValues={retrieveDatesFromDateRangeFilterString(createdDate?.[0])}
          onChange={onChange}
          makeFilterString={makeDateRangeFilterString}
        />
      </Accordion>
      <Accordion
        label={<FormattedMessage id={`ui-inventory.${FACETS.UPDATED_DATE}`} />}
        id={FACETS.UPDATED_DATE}
        name={FACETS.UPDATED_DATE}
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={updatedDate?.length > 0}
        onClearFilter={() => onClear(FACETS.UPDATED_DATE)}
      >
        <DateRangeFilter
          name={FACETS.UPDATED_DATE}
          dateFormat={DATE_FORMAT}
          selectedValues={retrieveDatesFromDateRangeFilterString(updatedDate?.[0])}
          onChange={onChange}
          makeFilterString={makeDateRangeFilterString}
        />
      </Accordion>
      <Accordion
        label={<FormattedMessage id={`ui-inventory.${FACETS.SOURCE}`} />}
        id={FACETS.SOURCE}
        name={FACETS.SOURCE}
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={source?.length > 0}
        onClearFilter={() => onClear(FACETS.SOURCE)}
      >
        <CheckboxFacet
          data-test-filter-instance-source
          name={FACETS.SOURCE}
          dataOptions={facetsOptions.sourceOptions}
          selectedValues={source}
          isPending={getIsPending(FACETS.SOURCE)}
          onChange={onChange}
        />
      </Accordion>
      <TagsFilter
        id={FACETS.INSTANCES_TAGS}
        onChange={onChange}
        onClear={onClear}
        selectedValues={instancesTags}
        isPending={getIsPending(FACETS.INSTANCES_TAGS)}
        tagsRecords={facetsOptions.tagsRecords}
        onFetch={handleFetchFacets}
        onSearch={handleFilterSearch}
      />
    </AccordionSet>
  );
};

export default InstanceFilters;

InstanceFilters.propTypes = {
  activeFilters: PropTypes.objectOf(PropTypes.array),
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  data: PropTypes.object,
};

InstanceFilters.defaultProps = {
  activeFilters: {},
};
