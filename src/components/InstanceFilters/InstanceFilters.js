import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import _ from 'lodash';

import {
  Accordion,
  AccordionSet,
  FilterAccordionHeader,
  languageOptions,
} from '@folio/stripes/components';
import {
  DateRangeFilter,
} from '@folio/stripes/smart-components';
import { languageOptionsES } from '@folio/stripes-components/util/languages';

import {
  retrieveDatesFromDateRangeFilterString,
  makeDateRangeFilterString,
} from '../../utils';
import { DATE_FORMAT } from '../../constants';
import {
  FACETS,
  IDs,
} from './constants';
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
      query: { query, filters = '' },
      onFetchFacets,
      parentResources,
    },
    onChange,
    onClear,
  } = props;

  const {
    facets: { records = {} },
  } = parentResources;

  const intl = useIntl();
  const location = useLocation();
  const [accordions, setAccordions] = useState({
    [FACETS.EFFECTIVE_LOCATION]: false,
    [FACETS.LANGUAGE]: false,
    [FACETS.RESOURCE]: false,
    [FACETS.FORMAT]: false,
    [FACETS.MODE]: false,
    [FACETS.NATURE_OF_CONTENT]: false,
    [FACETS.STAFF_SUPPRESS]: false,
    [FACETS.DISCOVERY_SUPPRESS]: false,
    [FACETS.CREATED_DATE]: false,
    [FACETS.UPDATED_DATE]: false,
    [FACETS.SOURCE]: false,
    [FACETS.TAGS]: false,
  });

  const [accordionsData, setAccordionsData] = useState({});
  const [facetSettings, setFacetSettings] = useState({});
  const [more, setMore] = useState({});
  const [focusedFacets, setFocusedFacets] = useState({});

  const prevAccordionsState = useRef(accordions);
  const prevFilters = useRef({});
  const prevUrl = useRef(location.search);
  const prevQuery = useRef('');

  const onToggleSection = ({ id }) => {
    setAccordions(curState => {
      const newState = _.cloneDeep(curState);
      newState[id] = !curState[id];
      return newState;
    });
  };

  const handleFilterSearch = (filter) => {
    const {
      name,
      value,
    } = filter;

    setFacetSettings(prevFacetSettings => ({
      ...prevFacetSettings,
      [name]: {
        ...prevFacetSettings[name],
        value,
      },
    }));

    onChange(filter);
  };

  const processFilterChange = (selectedFilters, facetName) => {
    if (selectedFilters) {
      const isFilterChanged = prevFilters.current[facetName]?.length !== selectedFilters.length;
      if (isFilterChanged) {
        prevFilters.current[facetName] = selectedFilters;

        setAccordionsData(prevAccordionsData => ({
          ...prevAccordionsData,
          [facetName]: {
            ...prevAccordionsData[facetName],
            isSelected: true,
          },
        }));
      }
    } else {
      const isLastFilterRemoved = prevFilters.current[facetName]?.length === 1 && selectedFilters === undefined;
      if (isLastFilterRemoved) {
        prevFilters.current[facetName] = [];

        setAccordionsData(prevAccordionsData => ({
          ...prevAccordionsData,
          [facetName]: {
            ...prevAccordionsData[facetName],
            isSelected: false,
          },
        }));
      }
    }
  };

  const getFacetOptions = (entries, facetData) => {
    const options = entries.reduce((accum, entry) => {
      if (!entry.totalRecords) return accum;

      const {
        name = '',
        id,
        label = '',
      } = facetData.find(facet => facet.id === entry.id);

      const option = {
        label: name || label,
        value: id,
        count: entry.totalRecords,
      };
      accum.push(option);
      return accum;
    }, []);

    return _.orderBy(options, ['count'], ['desc']);
  };

  const getSuppressedOptions = (suppressedOptionsRecords) => {
    const options = suppressedOptionsRecords.reduce((accum, { id, totalRecords }) => {
      if (!totalRecords) return accum;

      const idPart = id === 'true' ? 'yes' : 'no';
      const value = id === 'true' ? 'true' : 'false';

      const option = {
        label: <FormattedMessage id={`ui-inventory.${idPart}`} />,
        value,
        count: totalRecords,
      };
      accum.push(option);
      return accum;
    }, []);

    return _.orderBy(options, ['count'], ['desc']);
  };

  const getSourceOptions = (sourceRecords) => {
    const options = sourceRecords.reduce((accum, { id, totalRecords }) => {
      if (!totalRecords) return accum;

      const value = id === 'folio' ? 'FOLIO' : 'MARC';
      const option = {
        label: <FormattedMessage id={`ui-inventory.${value.toLowerCase()}`} />,
        value,
        count: totalRecords,
      };
      accum.push(option);
      return accum;
    }, []);

    return _.orderBy(options, ['count'], ['desc']);
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

  const langOptions = languageOptions(intl);

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

  const processFacetOpening = (facetToOpen, isSelected, isAllFiltersLoadedBefore) => {
    const isUrlChanged = prevUrl.current !== location.search;
    const isFacetOpenedBefore = prevAccordionsState.current[facetToOpen];

    if (
      (isSelected && !isUrlChanged) ||
      (!isSelected && isAllFiltersLoadedBefore && !isUrlChanged) ||
      (!isSelected && !isUrlChanged && isFacetOpenedBefore)
    ) {
      return;
    }

    onFetchFacets({
      facetToOpen,
      isSelected,
      isAllFiltersLoadedBefore,
    });
  };

  const processOmMoreClicking = (isSelected, isAllFiltersLoadedBefore, onMoreClickedFacet) => {
    if (isSelected || isAllFiltersLoadedBefore) return;

    onFetchFacets({ onMoreClickedFacet });

    setMore(prevMore => ({
      ...prevMore,
      [onMoreClickedFacet]: true,
    }));

    setFacetSettings(prevFacetSettings => ({
      ...prevFacetSettings,
      [onMoreClickedFacet]: {
        ...prevFacetSettings[onMoreClickedFacet],
        isOnMoreClicked: true,
      },
    }));
  };

  const processFacetFocusing = (isSelected, isAllFiltersLoadedBefore, focusedFacet) => {
    if (isSelected || isAllFiltersLoadedBefore) return;

    onFetchFacets({ focusedFacet });

    setFocusedFacets(prevFocusedFacets => ({
      ...prevFocusedFacets,
      [focusedFacet]: true,
    }));
  };

  const handleFetchFacets = (property = {}) => {
    const {
      onMoreClickedFacet,
      focusedFacet,
      facetToOpen,
    } = property;

    const facetName = facetToOpen || onMoreClickedFacet || focusedFacet;
    const isSelected = accordionsData[facetName]?.isSelected;
    const isAllFiltersLoadedBefore = focusedFacets[facetName] || more[facetName];

    if (facetToOpen) {
      processFacetOpening(facetToOpen, isSelected, isAllFiltersLoadedBefore);
    } else if (onMoreClickedFacet) {
      processOmMoreClicking(isSelected, isAllFiltersLoadedBefore, onMoreClickedFacet);
    } else if (focusedFacet) {
      processFacetFocusing(isSelected, isAllFiltersLoadedBefore, focusedFacet);
    } else {
      const data = { ...accordionsData };

      _.forEach(facetSettings, (settings, facet) => {
        data[facet] = {
          ...data[facet],
          ...settings,
        };
      });

      onFetchFacets({
        accordions,
        accordionsData: data,
      });
    }
  };

  useEffect(() => {
    if (!_.isEmpty(records)) {
      const recordsSettings = {
        [IDs.EFFECTIVE_LOCATION_ID]: 'effectiveLocationOptions',
        [IDs.LANGUAGES]: 'langOptions',
        [IDs.INSTANCE_TYPE_ID]: 'resourceTypeOptions',
        [IDs.INSTANCE_FORMAT_ID]: 'instanceFormatOptions',
        [IDs.MODE_OF_ISSUANCE_ID]: 'modeOfIssuanceOptions',
        [IDs.NATURE_OF_CONTENT_TERM_IDS]: 'natureOfContentOptions',
        [IDs.STAFF_SUPPRESS]: 'suppressedOptions',
        [IDs.DISCOVERY_SUPPRESS]: 'suppressedOptions',
        [IDs.SOURCE]: 'sourceOptions',
        [IDs.INSTANCE_TAGS]: 'tagsRecords',
      };

      const newRecords = _.reduce(recordsSettings, (accum, name, recordName) => {
        if (records[recordName]) {
          switch (recordName) {
            case IDs.EFFECTIVE_LOCATION_ID:
              accum[name] = getFacetOptions(records[recordName].values, locations);
              break;
            case IDs.LANGUAGES:
              accum[name] = languageOptionsES(intl, records[recordName].values);
              break;
            case IDs.INSTANCE_TYPE_ID:
              accum[name] = getFacetOptions(records[recordName].values, resourceTypes);
              break;
            case IDs.INSTANCE_FORMAT_ID:
              accum[name] = getFacetOptions(records[recordName].values, instanceFormats);
              break;
            case IDs.MODE_OF_ISSUANCE_ID:
              accum[name] = getFacetOptions(records[recordName].values, modesOfIssuance);
              break;
            case IDs.NATURE_OF_CONTENT_TERM_IDS:
              accum[name] = getFacetOptions(records[recordName].values, natureOfContentTerms);
              break;
            case IDs.STAFF_SUPPRESS:
            case IDs.DISCOVERY_SUPPRESS:
              accum[name] = getSuppressedOptions(records[recordName].values);
              break;
            case IDs.SOURCE:
              accum[name] = getSourceOptions(records[recordName].values);
              break;
            case IDs.INSTANCE_TAGS:
              accum[name] = getFacetOptions(records[recordName].values, tagsRecords);
              break;
            default:
          }
        }
        return accum;
      }, {});

      setFacetsOptions(prevFacetOptions => ({ ...prevFacetOptions, ...newRecords }));
    }
  }, [records]);

  useEffect(() => {
    let facetToOpen = '';

    const isFacetOpened = _.some(prevAccordionsState.current, (prevFacetValue, facetName) => {
      const curFacetValue = accordions[facetName];

      if (curFacetValue !== prevFacetValue) {
        if (curFacetValue) {
          facetToOpen = facetName;
        }
        return curFacetValue;
      }
      return false;
    });

    if (isFacetOpened) {
      handleFetchFacets({ facetToOpen });
    } else {
      prevUrl.current = location.search;
    }

    prevAccordionsState.current = {
      ...prevAccordionsState.current,
      [facetToOpen]: isFacetOpened,
    };
  }, [accordions]);

  useEffect(() => {
    if (!_.isEmpty(accordionsData)) {
      const isNoFilterSelected = _.every(accordionsData, value => !value?.isSelected);
      if (!query && prevQuery.current && isNoFilterSelected) return;

      handleFetchFacets();
    }
  }, [accordionsData]);

  useEffect(() => {
    const selectedFacetFilters = {
      [FACETS.EFFECTIVE_LOCATION]: effectiveLocation,
      [FACETS.LANGUAGE]: language,
      [FACETS.RESOURCE]: resource,
      [FACETS.FORMAT]: format,
      [FACETS.MODE]: mode,
      [FACETS.NATURE_OF_CONTENT]: natureOfContent,
      [FACETS.STAFF_SUPPRESS]: staffSuppress,
      [FACETS.DISCOVERY_SUPPRESS]: discoverySuppress,
      [FACETS.SOURCE]: source,
      [FACETS.TAGS]: tags,
    };

    _.forEach(selectedFacetFilters, (selectedFilters, facetName) => {
      processFilterChange(selectedFilters, facetName);
    });
  }, [filters]);

  useEffect(() => {
    const isSomeFacetOpened = _.some(accordions, isFacetOpened => isFacetOpened);
    const isValidQuery = (query && query !== prevQuery.current) || (query !== undefined && prevQuery.current);

    if (isSomeFacetOpened) {
      if (isValidQuery) {
        prevQuery.current = query;
        handleFetchFacets();
      }
    } else if (isValidQuery) {
      prevQuery.current = query;
    }
  }, [query]);

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
