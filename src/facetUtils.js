import React from 'react';
import { FormattedMessage } from 'react-intl';

const getFacetDataMap = (facetData) => {
  const facetDataMap = new Map();

  facetData.forEach(data => {
    const id = data.id || data.label;
    facetDataMap.set(id, data);
  });

  return facetDataMap;
};

const getSelectedFacetOptionsWithoutCount = (selectedFiltersId, entries, facetDataMap) => {
  const selectedFiltersWithoutCount = [];

  if (selectedFiltersId) {
    selectedFiltersId.forEach(selectedFilterId => {
      const selectedFilterWithCount = entries.find(filter => filter.id === selectedFilterId);

      if (!selectedFilterWithCount) {
        const {
          name = '',
          id,
          label = '',
        } = facetDataMap.get(selectedFilterId);

        const option = {
          label: name || label,
          value: id,
          count: 0,
        };
        selectedFiltersWithoutCount.push(option);
      }
    });
  }

  return selectedFiltersWithoutCount;
};

export const getFacetOptions = (selectedFiltersId, entries, facetData) => {
  const facetDataMap = getFacetDataMap(facetData);

  const restFilters = entries.reduce((accum, entry) => {
    if (!entry.totalRecords) return accum;

    const {
      name = '',
      id,
      label = '',
    } = facetDataMap.get(entry.id);

    const option = {
      label: name || label,
      value: id,
      count: entry.totalRecords,
    };
    accum.push(option);
    return accum;
  }, []);

  return [
    ...restFilters,
    ...getSelectedFacetOptionsWithoutCount(selectedFiltersId, entries, facetDataMap),
  ];
};

const getSuppressedLabel = (id) => (id === 'true' ? 'yes' : 'no');
const getSuppressedValue = (id) => (id === 'true' ? 'true' : 'false');
const getSourceValue = (id) => (id === 'FOLIO' ? 'FOLIO' : 'MARC');

const getSelectedSuppressedOptionsWithoutCount = (selectedFiltersId, suppressedOptionsRecords) => {
  const selectedFiltersWithoutCount = [];

  if (selectedFiltersId) {
    selectedFiltersId.forEach(selectedFilterId => {
      const selectedFilterWithCount = suppressedOptionsRecords.find(record => record.id === selectedFilterId);

      if (!selectedFilterWithCount) {
        const option = {
          label: <FormattedMessage id={`ui-inventory.${getSuppressedLabel(selectedFilterId)}`} />,
          value: getSuppressedValue(selectedFilterId),
          count: 0,
        };
        selectedFiltersWithoutCount.push(option);
      }
    });
  }

  return selectedFiltersWithoutCount;
};

export const getSuppressedOptions = (selectedFiltersId, suppressedOptionsRecords) => {
  const restFilter = suppressedOptionsRecords.reduce((accum, { id, totalRecords }) => {
    if (!totalRecords) return accum;

    const option = {
      label: <FormattedMessage id={`ui-inventory.${getSuppressedLabel(id)}`} />,
      value: getSuppressedValue(id),
      count: totalRecords,
    };
    accum.push(option);
    return accum;
  }, []);

  return [
    ...restFilter,
    ...getSelectedSuppressedOptionsWithoutCount(selectedFiltersId, suppressedOptionsRecords),
  ];
};

const getSelectedSourceOptionsWithoutCount = (selectedFiltersId, sourceRecords) => {
  const selectedFiltersWithoutCount = [];

  if (selectedFiltersId) {
    selectedFiltersId.forEach(selectedFilterId => {
      const selectedFilterWithCount = sourceRecords.find(record => record.id === selectedFilterId);

      if (!selectedFilterWithCount) {
        const value = getSourceValue(selectedFilterId);

        const option = {
          label: <FormattedMessage id={`ui-inventory.${value.toLowerCase()}`} />,
          value,
          count: 0,
        };
        selectedFiltersWithoutCount.push(option);
      }
    });
  }

  return selectedFiltersWithoutCount;
};

export const getSourceOptions = (selectedFiltersId, sourceRecords) => {
  const restFilter = sourceRecords.reduce((accum, { id, totalRecords }) => {
    if (!totalRecords) return accum;

    const value = getSourceValue(id);

    const option = {
      label: <FormattedMessage id={`ui-inventory.${value.toLowerCase()}`} />,
      value,
      count: totalRecords,
    };

    accum.push(option);
    return accum;
  }, []);

  return [
    ...restFilter,
    ...getSelectedSourceOptionsWithoutCount(selectedFiltersId, sourceRecords),
  ];
};

const getSelectedItemStatusOptions = (selectedFiltersId, entries, facetData, intl) => {
  const selectedFiltersWithoutCount = [];

  if (selectedFiltersId) {
    selectedFiltersId.forEach(selectedFilterId => {
      const selectedFilterWithCount = entries.find(filter => filter.id === selectedFilterId);

      if (!selectedFilterWithCount) {
        const {
          value,
          label,
        } = facetData.find(facet => facet.value === selectedFilterId);

        const option = {
          label: intl.formatMessage({ id: label }),
          value,
          count: 0,
        };
        selectedFiltersWithoutCount.push(option);
      }
    });
  }

  return selectedFiltersWithoutCount;
};

export const getItemStatusesOptions = (selectedFiltersId, entries, facetData, intl) => {
  const restFilters = entries.reduce((accum, entry) => {
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

  return [
    ...restFilters,
    ...getSelectedItemStatusOptions(selectedFiltersId, entries, facetData, intl),
  ];
};

export const processFacetOptions = (selectedFiltersId, facetData, recordValues, accum, name) => {
  if (facetData) {
    accum[name] = getFacetOptions(selectedFiltersId, recordValues, facetData);
  }
};

export const processItemsStatuses = (selectedFiltersId, itemStatuses, intl, recordValues, accum, name) => {
  if (itemStatuses) {
    accum[name] = getItemStatusesOptions(selectedFiltersId, recordValues, itemStatuses, intl);
  }
};
