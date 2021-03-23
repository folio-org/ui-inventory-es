import React from 'react';
import { FormattedMessage } from 'react-intl';

export const getFacetOptions = (entries, facetData) => {
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

export const getSuppressedOptions = (suppressedOptionsRecords) => {
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

export const getSourceOptions = (sourceRecords) => {
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

export const getItemStatusesOptions = (entries, facetData, intl) => {
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

export const processFacetOptions = (facetData, recordValues, accum, name) => {
  if (facetData) {
    accum[name] = getFacetOptions(recordValues, facetData);
  }
};

export const processItemsStatuses = (itemStatuses, intl, recordValues, accum, name) => {
  if (itemStatuses) {
    accum[name] = getItemStatusesOptions(recordValues, itemStatuses, intl);
  }
};
