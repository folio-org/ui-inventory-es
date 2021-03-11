import React, { useEffect, useState, useRef } from 'react';
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
  DISCOVERY_SUPPRESS,
  EFFECTIVE_LOCATION,
  INSTANCE_FORMAT_ID,
  INSTANCE_TAGS,
  INSTANCE_TYPE_ID,
  LANGUAGES,
  MODE_OF_ISSUANCE_ID,
  NATURE_OF_CONTENT_TERM_IDS,
  SOURCE,
  STAFF_SUPPRESS,
  LANGUAGE,
  RESOURCE,
  FORMAT,
  MODE,
  NATURE_OF_CONTENT,
  TAGS,
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

  const intl = useIntl();
  const [accordions, setAccordions] = useState({
    effectiveLocation: true,
    language: false,
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

  const [accordionsData, setAccordionsData] = useState({});
  const [facetSettings, setFacetSettings] = useState({});

  const prevAccordionsState = useRef(accordions);
  const prevFilters = useRef({});

  const selectedFacetFilters = {
    [EFFECTIVE_LOCATION]: effectiveLocation,
    [LANGUAGE]: language,
    [RESOURCE]: resource,
    [FORMAT]: format,
    [MODE]: mode,
    [NATURE_OF_CONTENT]: natureOfContent,
    [STAFF_SUPPRESS]: staffSuppress,
    [DISCOVERY_SUPPRESS]: discoverySuppress,
    [SOURCE]: source,
    [TAGS]: tags,
  };

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

  const processFilterChanges = (selectedFilters, facetName) => {
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
    return entries.reduce((accum, entry) => {
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
  };

  const getSuppressedOptions = (suppressedOptionsRecords) => {
    return suppressedOptionsRecords.reduce((accum, { id, totalRecords }) => {
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
  };

  const getSourceOptions = (sourceRecords) => {
    return sourceRecords.reduce((accum, { id, totalRecords }) => {
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

  const handleFetchFacets = (property = {}) => {
    const {
      onMoreClickedFacet,
      focusedFacet,
      facetToOpen,
    } = property;

    if (facetToOpen) {
      onFetchFacets({ facetToOpen });
    } else if (onMoreClickedFacet) {
      onFetchFacets({ onMoreClickedFacet });

      setFacetSettings(prevFacetSettings => ({
        ...prevFacetSettings,
        [onMoreClickedFacet]: {
          ...prevFacetSettings[onMoreClickedFacet],
          isOnMoreClicked: true,
        },
      }));
    } else if (focusedFacet) {
      onFetchFacets({ focusedFacet });
    } else {
      const data = { ...accordionsData };

      _.forEach(facetSettings, (settings, facetName) => {
        data[facetName] = {
          ...data[facetName],
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
        [EFFECTIVE_LOCATION]: 'effectiveLocationOptions',
        [LANGUAGES]: 'langOptions',
        [INSTANCE_TYPE_ID]: 'resourceTypeOptions',
        [INSTANCE_FORMAT_ID]: 'instanceFormatOptions',
        [MODE_OF_ISSUANCE_ID]: 'modeOfIssuanceOptions',
        [NATURE_OF_CONTENT_TERM_IDS]: 'natureOfContentOptions',
        [STAFF_SUPPRESS]: 'suppressedOptions',
        [DISCOVERY_SUPPRESS]: 'suppressedOptions',
        [SOURCE]: 'sourceOptions',
        [INSTANCE_TAGS]: 'tagsRecords',
      };

      const newRecords = _.reduce(recordsSettings, (accum, name, recordName) => {
        if (records[recordName]) {
          switch (recordName) {
            case EFFECTIVE_LOCATION:
              accum[name] = getFacetOptions(records[recordName].values, locations);
              break;
            case LANGUAGES:
              accum[name] = languageOptionsES(intl, records[recordName].values);
              break;
            case INSTANCE_TYPE_ID:
              accum[name] = getFacetOptions(records[recordName].values, resourceTypes);
              break;
            case INSTANCE_FORMAT_ID:
              accum[name] = getFacetOptions(records[recordName].values, instanceFormats);
              break;
            case MODE_OF_ISSUANCE_ID:
              accum[name] = getFacetOptions(records[recordName].values, modesOfIssuance);
              break;
            case NATURE_OF_CONTENT_TERM_IDS:
              accum[name] = getFacetOptions(records[recordName].values, natureOfContentTerms);
              break;
            case STAFF_SUPPRESS:
            case DISCOVERY_SUPPRESS:
              accum[name] = getSuppressedOptions(records[recordName].values);
              break;
            case SOURCE:
              accum[name] = getSourceOptions(records[recordName].values);
              break;
            case INSTANCE_TAGS:
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
      const isFilterSelected = !!selectedFacetFilters[facetToOpen]?.length;
      if (isFilterSelected) {
        handleFetchFacets();
      } else {
        handleFetchFacets({ facetToOpen });
      }
      prevAccordionsState.current = accordions;
    }
  }, [accordions]);

  useEffect(() => {
    handleFetchFacets();
  }, [accordionsData]);

  useEffect(() => {
    _.forEach(selectedFacetFilters, (selectedFilters, facetName) => {
      processFilterChanges(selectedFilters, facetName);
    });
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
