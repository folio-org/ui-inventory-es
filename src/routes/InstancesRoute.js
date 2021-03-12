import React from 'react';
import PropTypes from 'prop-types';
import { flowRight, reduce } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';

import withLocation from '../withLocation';
import { InstancesView } from '../views';
import {
  getFilterConfig,
} from '../filterConfig';
import {
  buildManifestObject,
  buildQuery
} from './buildManifestObject';
import { DataContext } from '../contexts';

const DEFAULT_FILTERS_NUMBER = 5;

class InstancesRoute extends React.Component {
  static propTypes = {
    resources: PropTypes.object.isRequired,
    mutator: PropTypes.object.isRequired,
    showSingleResult: PropTypes.bool,
    browseOnly: PropTypes.bool,
    disableRecordCreation: PropTypes.bool,
    onSelectRow: PropTypes.func,
    getParams: PropTypes.func,
  };

  static defaultProps = {
    showSingleResult: false,
    browseOnly: false,
    disableRecordCreation: false,
  };

  static manifest = Object.freeze(buildManifestObject());

  fetchFacets = (data) => async (properties = {}) => {
    const {
      onMoreClickedFacet,
      focusedFacet,
      accordions,
      accordionsData,
      facetToOpen,
      isSelected,
      isAllFiltersLoadedBefore,
    } = properties;
    const {
      resources,
      mutator,
    } = this.props;
    const {
      reset,
      GET,
    } = mutator.facets;
    const { query } = resources;

    const params = {};
    const cqlQuery = buildQuery(query, {}, { ...data, query }, { log: () => null }) || '';

    if (cqlQuery) params.query = cqlQuery;

    if (facetToOpen) {
      params.facet = `facet=${facetToOpen}${isSelected || isAllFiltersLoadedBefore ? '' : `:${DEFAULT_FILTERS_NUMBER}`}`;
    } else if (onMoreClickedFacet || focusedFacet) {
      params.facet = `facet=${focusedFacet || onMoreClickedFacet}`;
    } else {
      let index = 0;

      const facets = reduce(accordions, (accum, isFacetOpened, facetName) => {
        if (isFacetOpened) {
          const isFacetValue = accordionsData?.[facetName]?.value;
          const isFilterSelected = accordionsData?.[facetName]?.isSelected;
          const isOnMoreClicked = accordionsData?.[facetName]?.isOnMoreClicked;
          const isNeedAllFilters =
            isOnMoreClicked ||
            isFacetValue ||
            isFilterSelected;

          const symbol = index
            ? '&'
            : '';

          index++;
          return `${accum}${symbol}facet=${facetName}${isNeedAllFilters ? '' : `:${DEFAULT_FILTERS_NUMBER}`}`;
        }
        return accum;
      }, '');

      if (facets) params.faset = facets;
    }

    try {
      reset();
      await GET({ params });
    } catch (error) {
      throw new Error(error);
    }
  };

  render() {
    const {
      showSingleResult,
      browseOnly,
      onSelectRow,
      disableRecordCreation,
      resources,
      mutator,
      getParams,
    } = this.props;
    const { segment } = getParams(this.props);
    const { indexes, renderer, indexesES, operators, booleanOperators } = getFilterConfig(segment);
    const { query } = resources;

    return (
      <DataContext.Consumer>
        {data => (
          <InstancesView
            parentResources={resources}
            parentMutator={mutator}
            data={{ ...data, query }}
            browseOnly={browseOnly}
            showSingleResult={showSingleResult}
            onSelectRow={onSelectRow}
            disableRecordCreation={disableRecordCreation}
            renderFilters={renderer({
              ...data,
              query,
              onFetchFacets: this.fetchFacets(data),
              parentResources: resources,
            })}
            segment={segment}
            searchableIndexes={indexes}
            searchableIndexesES={indexesES}
            operators={operators}
            booleanOperators={booleanOperators}
          />
        )}
      </DataContext.Consumer>
    );
  }
}

export default flowRight(
  stripesConnect,
  withLocation,
)(InstancesRoute);
