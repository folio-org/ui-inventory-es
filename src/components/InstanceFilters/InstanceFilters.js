import React, { useEffect, useState, useRef } from 'react';
import { defer } from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import { useStripes } from '@folio/stripes/core';
import {
  Accordion,
  AccordionSet,
  FilterAccordionHeader,
  languageOptions,
} from '@folio/stripes/components';
import {
  DateRangeFilter,
} from '@folio/stripes/smart-components';

import {
  retrieveDatesFromDateRangeFilterString,
  makeDateRangeFilterString,
} from '../../utils';
import { DATE_FORMAT } from '../../constants';
import TagsFilter from '../TagsFilter';
import CheckboxFacet from '../CheckboxFacet';

const InstanceFilters = props => {
  const {
    activeFilters: {
      effectiveLocation,
      resource,
      language,
      format,
      mode,
      natureOfContent,
      discoverySuppress,
      staffSuppress,
      createdDate = [],
      updatedDate = [],
      source,
      tags,
    },
    data: {
      locations,
      resourceTypes,
      instanceFormats,
      modesOfIssuance,
      natureOfContentTerms,
      tagsRecords,
      query: { query = '', filters = '' },
      onFetchFacets,
      parentResources,
    },
    onChange,
    onClear,
  } = props;

  const {
    facets: { records = {} },
  } = parentResources;

  const [accordions, setAccordions] = useState({
    effectiveLocation: true,
    language: true,
    resource: false,
    format: false,
    mode: false,
    natureOfContent: false,
    staffSuppress: false,
    discoverySuppress: false,
    createdDate: false,
    updatedDate: false,
    source: false,
    tags: false,
  });

  const [isLocationSelected, setIsLocationSelected] = useState(false);
  const [locationInputValue, setLocationInputValue] = useState('');

  const [isLanguageSelected, setIsLanguageSelected] = useState(false);
  const [languageInputValue, setLanguageInputValue] = useState('');

  const [isResourceSelected, setIsResourceSelected] = useState(false);
  const [resourceInputValue, setResourceInputValue] = useState('');

  const [isFormatSelected, setIsFormatSelected] = useState(false);
  const [formatInputValue, setFormatInputValue] = useState('');

  const [isModeSelected, setIsModeSelected] = useState(false);
  const [modeInputValue, setModeInputValue] = useState('');

  const [isNatureOfContentSelected, setIsNatureOfContentSelected] = useState(false);
  const [natureOfContentInputValue, setNatureOfContentInputValue] = useState('');

  const [isStaffSuppressSelected, setIsStaffSuppressSelected] = useState(false);
  const [staffSuppressInputValue, setStaffSuppressInputValue] = useState('');

  const [isDiscoverySuppressSelected, setIsDiscoverySuppressSelected] = useState(false);
  const [discoverySuppressInputValue, setDiscoverySuppressInputValue] = useState('');

  const [isSourceSelected, setIsSourceSelected] = useState(false);
  const [sourceInputValue, setSourceInputValue] = useState('');

  const [isTagsSelected, setIsTagsSelected] = useState(false);
  const [tagsInputValue, setTagsInputValue] = useState('');

  // const [isAlreadyFetched, setIsAlreadyFetched] = useState(false);
  const isAlreadyFetched = useRef(false);

  const prevAccordionsState = useRef(accordions);

  const prevLocations = useRef(new Set());
  const prevLanguages = useRef(new Set());
  const prevResource = useRef(new Set());
  const prevFormat = useRef(new Set());
  const prevMode = useRef(new Set());
  const prevNatureOfContent = useRef(new Set());
  const prevStaffSuppress = useRef(new Set());
  const prevDiscoverySuppress = useRef(new Set());
  const prevSource = useRef(new Set());
  const prevTags = useRef(new Set());

  const onToggleSection = ({ id }) => {
    setAccordions(curState => {
      const newState = _.cloneDeep(curState);
      newState[id] = !curState[id];
      return newState;
    });
  };

  const handleFilterSearch = (filter) => {
    const { name, value } = filter;

    switch (name) {
      case 'effectiveLocation':
        if (!locationInputValue) setLocationInputValue(value);
        break;
      case 'language':
        if (!languageInputValue) setLanguageInputValue(value);
        break;
      case 'resource':
        if (!resourceInputValue) setResourceInputValue(value);
        break;
      case 'format':
        if (!formatInputValue) setFormatInputValue(value);
        break;
      case 'mode':
        if (!modeInputValue) setModeInputValue(value);
        break;
      case 'natureOfContent':
        if (!natureOfContentInputValue) setNatureOfContentInputValue(value);
        break;
      case 'staffSuppress':
        if (!staffSuppressInputValue) setStaffSuppressInputValue(value);
        break;
      case 'discoverySuppress':
        if (!discoverySuppressInputValue) setDiscoverySuppressInputValue(value);
        break;
      case 'source':
        if (!sourceInputValue) setSourceInputValue(value);
        break;
      case 'tags':
        if (!tagsInputValue) setTagsInputValue(value);
        break;
      default:
    }

    onChange(filter);
  };

  const effectiveLocationOptions = locations.map(({ name, id }) => ({
    label: name,
    value: id,
  }));

  const resourceTypeOptions = resourceTypes.map(({ name, id }) => ({
    label: name,
    value: id,
  }));

  const instanceFormatOptions = instanceFormats.map(({ name, id }) => ({
    label: name,
    value: id,
  }));

  const modeOfIssuanceOptions = modesOfIssuance.map(({ name, id }) => ({
    label: name,
    value: id,
  }));

  const natureOfContentOptions = natureOfContentTerms.map(({ name, id }) => ({
    label: name,
    value: id,
  }));

  const suppressedOptions = [
    {
      label: <FormattedMessage id="ui-inventory.yes" />,
      value: 'true',
    },
    {
      label: <FormattedMessage id="ui-inventory.no" />,
      value: 'false',
    },
  ];

  const sourceOptions = [
    {
      label: <FormattedMessage id="ui-inventory.folio" />,
      value: 'FOLIO',
    },
    {
      label: <FormattedMessage id="ui-inventory.marc" />,
      value: 'MARC',
    },
  ];

  const intl = useIntl();
  const stripes = useStripes();
  const langOptions = languageOptions(intl, stripes.locale);

  const [facetsOptions, setFacetsOptions] = useState({
    effectiveLocationOptions,
    langOptions,
    resourceTypeOptions,
    instanceFormatOptions,
    modeOfIssuanceOptions,
    natureOfContentOptions,
    suppressedOptions,
    sourceOptions,
    tagsRecords,
  });

  const accordionsData = {
    effectiveLocation: { value: locationInputValue, isSelected: isLocationSelected },
    language: { value: languageInputValue, isSelected: isLanguageSelected },
    resource: { value: resourceInputValue, isSelected: isResourceSelected },
    format: { value: formatInputValue, isSelected: isFormatSelected },
    mode: { value: modeInputValue, isSelected: isModeSelected },
    natureOfContent: { value: natureOfContentInputValue, isSelected: isNatureOfContentSelected },
    staffSuppress: { value: staffSuppressInputValue, isSelected: isStaffSuppressSelected },
    discoverySuppress: { value: discoverySuppressInputValue, isSelected: isDiscoverySuppressSelected },
    source: { value: sourceInputValue, isSelected: isSourceSelected },
    tags: { value: tagsInputValue, isSelected: isTagsSelected },
  };

  const handleFetchFacets = ({ onMoreClickedFacet, focusedFacet } = {}) => {
    setTimeout(() => {
      if (isAlreadyFetched.current) {
        isAlreadyFetched.current = false;
        return;
      }

      onFetchFacets({ onMoreClickedFacet, focusedFacet, accordions, accordionsData });
    }, 300);
  };

  useEffect(() => {
    const recordsNumber = Object.keys(records);
    const facetsNumber = facetsOptions.length;

    if (recordsNumber >= facetsNumber) {
      setFacetsOptions(records);
    } else {
      setFacetsOptions(curFacetOptions => ({ ...curFacetOptions, ...records }));
    }
  }, [records])

  useEffect(() => {
    let facetOpenedFirstTime = '';

    const isFacetOpenedFirstTime = _.some(prevAccordionsState.current, (prevFacetValue, facetName) => {
      const curFacetValue = accordions[facetName];

      if (curFacetValue !== prevFacetValue) {
        if (curFacetValue) {
          facetOpenedFirstTime = facetName;
        }
        return curFacetValue;
      }
      return false;
    });

    if (isFacetOpenedFirstTime) {
      prevAccordionsState.current = accordions;
      onFetchFacets({ facetOpenedFirstTime });
      isAlreadyFetched.current = true;
    }
  }, [
    accordions.effectiveLocation,
    accordions.language,
    accordions.resource,
    accordions.format,
    accordions.mode,
    accordions.natureOfContent,
    accordions.staffSuppress,
    accordions.discoverySuppress,
    accordions.createdDate,
    accordions.updatedDate,
    accordions.source,
    accordions.tags,
  ]);

  useEffect(() => {
    let isSomeFilterChanged = false;

    if (effectiveLocation) {
      const isLocationChanged = prevLocations.current.size !== effectiveLocation.length;
      if (isLocationChanged) {
        setIsLocationSelected(true);
        accordionsData.effectiveLocation.isSelected = true;
        handleFetchFacets();
        prevLocations.current = new Set(effectiveLocation);
        isSomeFilterChanged = true;
      }
    } else {
      const isLastLocationRemoved = prevLocations.current.size === 1 && effectiveLocation === undefined;
      if (isLastLocationRemoved) {
        setIsLocationSelected(false);
        accordionsData.effectiveLocation.isSelected = false;
        handleFetchFacets();
        prevLocations.current = new Set();
        isSomeFilterChanged = true;
      }
    }

    if (language) {
      const isLanguageChanged = prevLanguages.current.size !== language.length;
      if (isLanguageChanged) {
        setIsLanguageSelected(true);
        accordionsData.language.isSelected = true;
        handleFetchFacets();
        prevLanguages.current = new Set(language);
        isSomeFilterChanged = true;
      }
    } else {
      const isLastLanguageRemoved = prevLanguages.current.size === 1 && language === undefined;
      if (isLastLanguageRemoved) {
        setIsLanguageSelected(false);
        accordionsData.language.isSelected = false;
        handleFetchFacets();
        prevLanguages.current = new Set();
        isSomeFilterChanged = true;
      }
    }

    if (resource) {
      const isResourceChanged = prevResource.current.size !== resource.length;
      if (isResourceChanged) {
        setIsResourceSelected(true);
        accordionsData.resource.isSelected = true;
        handleFetchFacets();
        prevResource.current = new Set(resource);
        isSomeFilterChanged = true;
      }
    } else {
      const isLastResourceRemoved = prevResource.current.size === 1 && resource === undefined;
      if (isLastResourceRemoved) {
        setIsResourceSelected(false);
        accordionsData.resource.isSelected = false;
        handleFetchFacets();
        prevResource.current = new Set();
        isSomeFilterChanged = true;
      }
    }

    if (format) {
      const isFormatChanged = prevFormat.current.size !== format.length;
      if (isFormatChanged) {
        setIsFormatSelected(true);
        accordionsData.format.isSelected = true;
        handleFetchFacets();
        prevFormat.current = new Set(format);
        isSomeFilterChanged = true;
      }
    } else {
      const isLastFormatRemoved = prevFormat.current.size === 1 && format === undefined;
      if (isLastFormatRemoved) {
        setIsFormatSelected(false);
        accordionsData.format.isSelected = false;
        handleFetchFacets();
        prevFormat.current = new Set();
        isSomeFilterChanged = true;
      }
    }

    if (mode) {
      const isModeChanged = prevMode.current.size !== mode.length;
      if (isModeChanged) {
        setIsModeSelected(true);
        accordionsData.mode.isSelected = true;
        handleFetchFacets();
        prevMode.current = new Set(mode);
        isSomeFilterChanged = true;
      }
    } else {
      const isLastModeRemoved = prevMode.current.size === 1 && mode === undefined;
      if (isLastModeRemoved) {
        setIsModeSelected(false);
        accordionsData.mode.isSelected = false;
        handleFetchFacets();
        prevMode.current = new Set();
        isSomeFilterChanged = true;
      }
    }

    if (natureOfContent) {
      const isNatureOfContentChanged = prevNatureOfContent.current.size !== natureOfContent.length;
      if (isNatureOfContentChanged) {
        setIsNatureOfContentSelected(true);
        accordionsData.natureOfContent.isSelected = true;
        handleFetchFacets();
        prevNatureOfContent.current = new Set(natureOfContent);
        isSomeFilterChanged = true;
      }
    } else {
      const isLastNatureOfContentRemoved = prevNatureOfContent.current.size === 1 && natureOfContent === undefined;
      if (isLastNatureOfContentRemoved) {
        setIsNatureOfContentSelected(false);
        accordionsData.natureOfContent.isSelected = false;
        handleFetchFacets();
        prevNatureOfContent.current = new Set();
        isSomeFilterChanged = true;
      }
    }

    if (staffSuppress) {
      const isStaffSuppressChanged = prevStaffSuppress.current.size !== staffSuppress.length;
      if (isStaffSuppressChanged) {
        setIsStaffSuppressSelected(true);
        accordionsData.staffSuppress.isSelected = true;
        handleFetchFacets();
        prevStaffSuppress.current = new Set(staffSuppress);
        isSomeFilterChanged = true;
      }
    } else {
      const isLastStaffSuppressRemoved = prevStaffSuppress.current.size === 1 && staffSuppress === undefined;
      if (isLastStaffSuppressRemoved) {
        setIsStaffSuppressSelected(false);
        accordionsData.staffSuppress.isSelected = false;
        handleFetchFacets();
        prevStaffSuppress.current = new Set();
        isSomeFilterChanged = true;
      }
    }

    if (discoverySuppress) {
      const isDiscoverySuppressChanged = prevDiscoverySuppress.current.size !== discoverySuppress.length;
      if (isDiscoverySuppressChanged) {
        setIsDiscoverySuppressSelected(true);
        accordionsData.discoverySuppress.isSelected = true;
        handleFetchFacets();
        prevDiscoverySuppress.current = new Set(discoverySuppress);
        isSomeFilterChanged = true;
      }
    } else {
      const isLastDiscoverySuppressRemoved = prevDiscoverySuppress.current.size === 1 && discoverySuppress === undefined;
      if (isLastDiscoverySuppressRemoved) {
        setIsDiscoverySuppressSelected(false);
        accordionsData.discoverySuppress.isSelected = false;
        handleFetchFacets();
        prevDiscoverySuppress.current = new Set();
        isSomeFilterChanged = true;
      }
    }

    if (source) {
      const isSourceChanged = prevSource.current.size !== source.length;
      if (isSourceChanged) {
        setIsSourceSelected(true);
        accordionsData.source.isSelected = true;
        handleFetchFacets();
        prevSource.current = new Set(source);
        isSomeFilterChanged = true;
      }
    } else {
      const isLastSourceRemoved = prevSource.current.size === 1 && source === undefined;
      if (isLastSourceRemoved) {
        setIsSourceSelected(false);
        accordionsData.source.isSelected = false;
        handleFetchFacets();
        prevSource.current = new Set();
        isSomeFilterChanged = true;
      }
    }

    if (tags) {
      const isTagsChanged = prevTags.current.size !== tags.length;
      if (isTagsChanged) {
        setIsTagsSelected(true);
        accordionsData.tags.isSelected = true;
        handleFetchFacets();
        prevTags.current = new Set(tags);
        isSomeFilterChanged = true;
      }
    } else {
      const isLastTagRemoved = prevTags.current.size === 1 && tags === undefined;
      if (isLastTagRemoved) {
        setIsTagsSelected(false);
        accordionsData.tags.isSelected = false;
        handleFetchFacets();
        prevTags.current = new Set();
        isSomeFilterChanged = true;
      }
    }

    if (!isSomeFilterChanged) {
      handleFetchFacets();
    }
  }, [query, filters]);

  return (
    <AccordionSet accordionStatus={accordions} onToggle={onToggleSection}>
      <Accordion
        label={<FormattedMessage id="ui-inventory.filters.effectiveLocation" />}
        id="effectiveLocation"
        name="effectiveLocation"
        separator={false}
        header={FilterAccordionHeader}
        displayClearButton={effectiveLocation?.length > 0}
        onClearFilter={() => onClear('effectiveLocation')}
      >
        <CheckboxFacet
          name="effectiveLocation"
          dataOptions={facetsOptions.effectiveLocationOptions}
          selectedValues={effectiveLocation}
          onChange={onChange}
          onSearch={handleFilterSearch}
          isFilterable
          onFetch={handleFetchFacets}
        />
      </Accordion>
      <Accordion
        label={<FormattedMessage id="ui-inventory.instances.language" />}
        id="language"
        name="language"
        separator={false}
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={language?.length > 0}
        onClearFilter={() => onClear('language')}
      >
        <CheckboxFacet
          name="language"
          dataOptions={facetsOptions.langOptions}
          selectedValues={language}
          onChange={onChange}
          onSearch={handleFilterSearch}
          isFilterable
          onFetch={handleFetchFacets}
        />
      </Accordion>
      <Accordion
        label={<FormattedMessage id="ui-inventory.instances.resourceType" />}
        id="resource"
        name="resource"
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={resource?.length > 0}
        onClearFilter={() => onClear('resource')}
      >
        <CheckboxFacet
          name="resource"
          dataOptions={facetsOptions.resourceTypeOptions}
          selectedValues={resource}
          onChange={onChange}
          onSearch={handleFilterSearch}
          isFilterable
          onFetch={handleFetchFacets}
        />
      </Accordion>
      <Accordion
        label={<FormattedMessage id="ui-inventory.instanceFormat" />}
        id="format"
        name="format"
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={format?.length > 0}
        onClearFilter={() => onClear('format')}
      >
        <CheckboxFacet
          name="format"
          dataOptions={facetsOptions.instanceFormatOptions}
          selectedValues={format}
          onChange={onChange}
          onSearch={handleFilterSearch}
          isFilterable
          onFetch={handleFetchFacets}
        />
      </Accordion>
      <Accordion
        label={<FormattedMessage id="ui-inventory.modeOfIssuance" />}
        id="mode"
        name="mode"
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={mode?.length > 0}
        onClearFilter={() => onClear('mode')}
      >
        <CheckboxFacet
          name="mode"
          dataOptions={facetsOptions.modeOfIssuanceOptions}
          selectedValues={mode}
          onChange={onChange}
          onSearch={handleFilterSearch}
          isFilterable
          onFetch={handleFetchFacets}
        />
      </Accordion>
      <Accordion
        label={<FormattedMessage id="ui-inventory.natureOfContentTerms" />}
        id="natureOfContent"
        name="natureOfContent"
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={mode?.length > 0}
        onClearFilter={() => onClear('natureOfContent')}
      >
        <CheckboxFacet
          name="natureOfContent"
          dataOptions={facetsOptions.natureOfContentOptions}
          selectedValues={natureOfContent}
          onChange={onChange}
          onSearch={handleFilterSearch}
          isFilterable
          onFetch={handleFetchFacets}
        />
      </Accordion>
      <Accordion
        label={<FormattedMessage id="ui-inventory.staffSuppress" />}
        id="staffSuppress"
        name="staffSuppress"
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={staffSuppress?.length > 0}
        onClearFilter={() => onClear('staffSuppress')}
      >
        <CheckboxFacet
          name="staffSuppress"
          dataOptions={facetsOptions.suppressedOptions}
          selectedValues={staffSuppress}
          onChange={onChange}
          onSearch={handleFilterSearch}
          onFetch={handleFetchFacets}
        />
      </Accordion>
      <Accordion
        label={<FormattedMessage id="ui-inventory.discoverySuppress" />}
        id="discoverySuppress"
        name="discoverySuppress"
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={discoverySuppress?.length > 0}
        onClearFilter={() => onClear('discoverySuppress')}
      >
        <CheckboxFacet
          data-test-filter-instance-discovery-suppress
          name="discoverySuppress"
          dataOptions={facetsOptions.suppressedOptions}
          selectedValues={discoverySuppress}
          onChange={onChange}
          onSearch={handleFilterSearch}
          onFetch={handleFetchFacets}
        />
      </Accordion>
      <Accordion
        label={<FormattedMessage id="ui-inventory.createdDate" />}
        id="createdDate"
        name="createdDate"
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={createdDate?.length > 0}
        onClearFilter={() => onClear('createdDate')}
      >
        <DateRangeFilter
          name="createdDate"
          dateFormat={DATE_FORMAT}
          selectedValues={retrieveDatesFromDateRangeFilterString(createdDate[0])}
          onChange={onChange}
          makeFilterString={makeDateRangeFilterString}
        />
      </Accordion>
      <Accordion
        label={<FormattedMessage id="ui-inventory.updatedDate" />}
        id="updatedDate"
        name="updatedDate"
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={updatedDate?.length > 0}
        onClearFilter={() => onClear('updatedDate')}
      >
        <DateRangeFilter
          name="updatedDate"
          dateFormat={DATE_FORMAT}
          selectedValues={retrieveDatesFromDateRangeFilterString(updatedDate[0])}
          onChange={onChange}
          makeFilterString={makeDateRangeFilterString}
        />
      </Accordion>
      <Accordion
        label={<FormattedMessage id="ui-inventory.source" />}
        id="source"
        name="source"
        closedByDefault
        header={FilterAccordionHeader}
        displayClearButton={source?.length > 0}
        onClearFilter={() => onClear('source')}
      >
        <CheckboxFacet
          data-test-filter-instance-source
          name="source"
          dataOptions={facetsOptions.sourceOptions}
          selectedValues={source}
          onChange={onChange}
          onSearch={handleFilterSearch}
          onFetch={handleFetchFacets}
        />
      </Accordion>
      <TagsFilter
        onChange={onChange}
        onClear={onClear}
        selectedValues={tags}
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
  data: {
    resourceTypes: [],
    locations: [],
  },
};
