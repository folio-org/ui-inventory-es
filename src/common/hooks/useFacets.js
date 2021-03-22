import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import _ from 'lodash';
import { languageOptionsES } from '../../components/InstanceFilters/languages';
import {
  FACETS,
  FACETS_OPTIONS,
  IDs,
} from '../../constants';

const useFacets = (activeFilters, data) => {
  const {
    effectiveLocation,
    resource,
    language,
    format,
    mode,
    natureOfContent,
    instancesDiscoverySuppress,
    holdingsDiscoverySuppress,
    itemsDiscoverySuppress,
    staffSuppress,
    createdDate,
    updatedDate,
    source,
    instancesTags,
    holdingsTags,
    itemsTags,
    holdingsPermanentLocation,
    materialType,
    itemStatus,
  } = activeFilters;

  const {
    locations,
    resourceTypes,
    instanceFormats,
    modesOfIssuance,
    natureOfContentTerms,
    tagsRecords,
    query: { query, filters = '' },
    onFetchFacets,
    parentResources: { facets },
    materialTypes,
    itemStatuses,
  } = data;

  const records = facets.records[0];

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
    [FACETS.INSTANCES_DISCOVERY_SUPPRESS]: false,
    [FACETS.ITEMS_DISCOVERY_SUPPRESS]: false,
    [FACETS.HOLDINGS_DISCOVERY_SUPPRESS]: false,
    [FACETS.CREATED_DATE]: false,
    [FACETS.UPDATED_DATE]: false,
    [FACETS.SOURCE]: false,
    [FACETS.INSTANCES_TAGS]: false,
    [FACETS.HOLDINGS_TAGS]: false,
    [FACETS.ITEMS_TAGS]: false,
    [FACETS.MATERIAL_TYPE]: false,
    [FACETS.ITEM_STATUS]: false,
    [FACETS.HOLDINGS_PERMANENT_LOCATION]: false,
  });

  const [accordionsData, setAccordionsData] = useState({});
  const [facetSettings, setFacetSettings] = useState({});
  const [facetNameToOpen, setFacetNameToOpen] = useState('');
  const [showLoadingForAllFacets, setShowLoadingForAllFacets] = useState(false);

  const prevAccordionsState = useRef(accordions);
  const prevFilters = useRef({});
  const prevUrl = useRef({});
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
    return entries.reduce((accum, entry) => {
      if (!entry.totalRecords) return accum;

      const {
        name = '',
        id,
        label = '',
      } = facetData.find(facet => facet.id === entry.id || facet.label === entry.id);

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

      const value = id === 'FOLIO' ? 'FOLIO' : 'MARC';
      const option = {
        label: <FormattedMessage id={`ui-inventory.${value.toLowerCase()}`} />,
        value,
        count: totalRecords,
      };
      accum.push(option);
      return accum;
    }, []);
  };

  const getItemStatusesOptions = (entries, facetData) => {
    return entries.reduce((accum, entry) => {
      if (!entry.totalRecords) return accum;

      const {
        value,
        label,
      } = facetData.find(facet => facet.value === entry.id);

      const option = {
        label: intl.formatMessage({ id: label }),
        value,
        count: entry.totalRecords,
      };
      accum.push(option);
      return accum;
    }, []);
  };

  const [facetsOptions, setFacetsOptions] = useState({
    effectiveLocationOptions: [],
    langOptions: [],
    resourceTypeOptions: [],
    instanceFormatOptions: [],
    modeOfIssuanceOptions: [],
    natureOfContentOptions: [],
    suppressedOptions: [],
    discoverySuppressOptions: [],
    sourceOptions: [],
    tagsRecords: [],
    materialTypesOptions: [],
    itemStatusesOptions: [],
    holdingsPermanentLocationOptions: [],
  });

  const processOnMoreClicking = (onMoreClickedFacet) => {
    onFetchFacets({ onMoreClickedFacet });

    setFacetSettings(prevFacetSettings => ({
      ...prevFacetSettings,
      [onMoreClickedFacet]: {
        ...prevFacetSettings[onMoreClickedFacet],
        isOnMoreClicked: true,
      },
    }));
  };

  const processAllFacets = () => {
    const facetsData = { ...accordionsData };

    _.forEach(facetSettings, (settings, facet) => {
      facetsData[facet] = {
        ...facetsData[facet],
        ...settings,
      };
    });

    onFetchFacets({
      accordions,
      accordionsData: facetsData,
    });
  };

  const handleFetchFacets = (property = {}) => {
    const {
      onMoreClickedFacet,
      focusedFacet,
      facetToOpen,
      dateFacet,
    } = property;

    const facetName = facetToOpen || onMoreClickedFacet || focusedFacet || dateFacet;

    if (facetName) {
      setFacetNameToOpen(facetName);
      setShowLoadingForAllFacets(false);
    } else {
      setFacetNameToOpen('');
      setShowLoadingForAllFacets(true);
    }

    if (facetToOpen) {
      onFetchFacets({ facetToOpen });
    } else if (onMoreClickedFacet) {
      processOnMoreClicking(onMoreClickedFacet);
    } else if (focusedFacet) {
      onFetchFacets({ focusedFacet });
    } else {
      processAllFacets();
    }
  };

  const processFacetOptions = (accum, name, recordName, facetData) => {
    if (facetData) {
      accum[name] = getFacetOptions(records[recordName].values, facetData);
    }
  };

  const processItemsStatuses = (accum, name, recordName) => {
    if (itemStatuses) {
      accum[name] = getItemStatusesOptions(records[recordName].values, itemStatuses);
    }
  };

  useEffect(() => {
    if (!_.isEmpty(records)) {
      const newRecords = _.reduce(FACETS_OPTIONS, (accum, name, recordName) => {
        if (records[recordName]) {
          switch (recordName) {
            case IDs.EFFECTIVE_LOCATION_ID:
            case IDs.HOLDINGS_PERMANENT_LOCATION_ID:
              processFacetOptions(accum, name, recordName, locations);
              break;
            case IDs.LANGUAGES:
              accum[name] = languageOptionsES(intl, records[recordName].values);
              break;
            case IDs.INSTANCE_TYPE_ID:
              processFacetOptions(accum, name, recordName, resourceTypes);
              break;
            case IDs.INSTANCE_FORMAT_ID:
              processFacetOptions(accum, name, recordName, instanceFormats);
              break;
            case IDs.MODE_OF_ISSUANCE_ID:
              processFacetOptions(accum, name, recordName, modesOfIssuance);
              break;
            case IDs.NATURE_OF_CONTENT_TERM_IDS:
              processFacetOptions(accum, name, recordName, natureOfContentTerms);
              break;
            case IDs.STAFF_SUPPRESS:
            case IDs.INSTANCES_DISCOVERY_SUPPRESS:
            case IDs.HOLDINGS_DISCOVERY_SUPPRESS_ID:
            case IDs.ITEMS_DISCOVERY_SUPPRESS_ID:
              accum[name] = getSuppressedOptions(records[recordName].values);
              break;
            case IDs.SOURCE:
              accum[name] = getSourceOptions(records[recordName].values);
              break;
            case IDs.INSTANCES_TAGS_ID:
            case IDs.HOLDINGS_TAGS_ID:
            case IDs.ITEMS_TAGS_ID:
              processFacetOptions(accum, name, recordName, tagsRecords);
              break;
            case IDs.MATERIAL_TYPES_ID:
              processFacetOptions(accum, name, recordName, materialTypes);
              break;
            case IDs.ITEMS_STATUSES_ID:
              processItemsStatuses(accum, name, recordName);
              break;
            default:
          }
        }
        return accum;
      }, {});

      setFacetsOptions(prevFacetOptions => ({ ...prevFacetOptions, ...newRecords }));
    }
  }, [records]);

  const getIsPending = (facetName) => {
    return facets.isPending && (showLoadingForAllFacets || facetNameToOpen === facetName);
  };

  useEffect(() => {
    let facetToOpen = '';
    let facetToClose = '';

    const isFacetOpened = _.some(prevAccordionsState.current, (prevFacetValue, facetName) => {
      const curFacetValue = accordions[facetName];

      if (curFacetValue !== prevFacetValue) {
        if (curFacetValue) {
          facetToOpen = facetName;
        } else {
          facetToClose = facetName;
        }
        return curFacetValue;
      }
      return false;
    });

    const isUrlChanged = prevUrl.current[facetToOpen] !== location.search;

    if (
      isFacetOpened &&
      isUrlChanged &&
      facetToOpen !== FACETS.CREATED_DATE &&
      facetToOpen !== FACETS.UPDATED_DATE
    ) {
      handleFetchFacets({ facetToOpen });
    } else {
      prevUrl.current[facetToClose] = location.search;
    }

    prevAccordionsState.current = { ...accordions };
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
      [FACETS.INSTANCES_DISCOVERY_SUPPRESS]: instancesDiscoverySuppress,
      [FACETS.ITEMS_DISCOVERY_SUPPRESS]: itemsDiscoverySuppress,
      [FACETS.HOLDINGS_DISCOVERY_SUPPRESS]: holdingsDiscoverySuppress,
      [FACETS.CREATED_DATE]: createdDate,
      [FACETS.UPDATED_DATE]: updatedDate,
      [FACETS.SOURCE]: source,
      [FACETS.INSTANCES_TAGS]: instancesTags,
      [FACETS.HOLDINGS_TAGS]: holdingsTags,
      [FACETS.ITEMS_TAGS]: itemsTags,
      [FACETS.MATERIAL_TYPE]: materialType,
      [FACETS.ITEM_STATUS]: itemStatus,
      [FACETS.HOLDINGS_PERMANENT_LOCATION]: holdingsPermanentLocation,
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

  return [
    accordions,
    onToggleSection,
    handleFetchFacets,
    handleFilterSearch,
    facetsOptions,
    getIsPending,
  ];
};

export default useFacets;
