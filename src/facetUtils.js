import React from 'react';
import { FormattedMessage } from 'react-intl';

export const getFacetOptions = (selectedFilters, entries, facetData) => {
  const facetDataMap = new Map();
  const selectedFiltersWithoutCount = [];

  facetData.forEach(data => {
    const id = data.id || data.label;
    facetDataMap.set(id, data);
  });

  if (selectedFilters) {
    selectedFilters.forEach(selectedFilterId => {
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

  return [...selectedFiltersWithoutCount, ...restFilters];
};

export const getSuppressedOptions = (selectedFilters, suppressedOptionsRecords) => {
  const selectedFiltersWithoutCount = [];

  if (selectedFilters) {
    selectedFilters.forEach(selectedFilter => {
      const selectedFilterWithCount = suppressedOptionsRecords.find(record => record.id === selectedFilter);

      if (!selectedFilterWithCount) {
        const idPart = selectedFilter === 'true' ? 'yes' : 'no';
        const value = selectedFilter === 'true' ? 'true' : 'false';

        const option = {
          label: <FormattedMessage id={`ui-inventory.${idPart}`} />,
          value,
          count: 0,
        };
        selectedFiltersWithoutCount.push(option);
      }
    });
  }

  const restFilter = suppressedOptionsRecords.reduce((accum, { id, totalRecords }) => {
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

  return [...selectedFiltersWithoutCount, ...restFilter];
};

export const getSourceOptions = (selectedFilters, sourceRecords) => {
  const selectedFiltersWithoutCount = [];

  if (selectedFilters) {
    selectedFilters.forEach(selectedFilter => {
      const selectedFilterWithCount = sourceRecords.find(record => record.id === selectedFilter);

      if (!selectedFilterWithCount) {
        const value = selectedFilter === 'FOLIO' ? 'FOLIO' : 'MARC';

        const option = {
          label: <FormattedMessage id={`ui-inventory.${value.toLowerCase()}`} />,
          value,
          count: 0,
        };
        selectedFiltersWithoutCount.push(option);
      }
    });
  }

  const restFilter = sourceRecords.reduce((accum, { id, totalRecords }) => {
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

  return [...selectedFiltersWithoutCount, ...restFilter];
};

export const getItemStatusesOptions = (selectedFilters, entries, facetData, intl) => {
  const selectedFiltersWithoutCount = [];

  if (selectedFilters) {
    selectedFilters.forEach(selectedFilter => {
      const selectedFilterWithCount = entries.find(filter => filter.id === selectedFilter);

      if (!selectedFilterWithCount) {
        const {
          value,
          label,
        } = facetData.find(facet => facet.value === selectedFilter);

        const option = {
          label: intl.formatMessage({ id: label }),
          value,
          count: 0,
        };
        selectedFiltersWithoutCount.push(option);
      }
    });
  }

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

  return [...selectedFiltersWithoutCount, ...restFilters];
};

export const processFacetOptions = (selectedFilters, facetData, recordValues, accum, name) => {
  if (facetData) {
    accum[name] = getFacetOptions(selectedFilters, recordValues, facetData);
  }
};

export const processItemsStatuses = (selectedFilters, itemStatuses, intl, recordValues, accum, name) => {
  if (itemStatuses) {
    accum[name] = getItemStatusesOptions(selectedFilters, recordValues, itemStatuses, intl);
  }
};
