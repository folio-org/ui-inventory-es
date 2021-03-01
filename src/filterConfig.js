import {
  instanceFilterRenderer,
  holdingsRecordFilterRenderer,
  itemFilterRenderer,
} from './components';

import {
  buildDateRangeQuery,
  buildOptionalBooleanQuery,
} from './utils';

export const instanceFilterConfig = [
  {
    name: 'effectiveLocation',
    cql: 'item.effectiveLocationId',
    values: [],
  },
  {
    name: 'language',
    cql: 'languages',
    values: [],
    operator: '=',
  },
  {
    name: 'format',
    cql: 'instanceFormatIds',
    values: [],
  },
  {
    name: 'resource',
    cql: 'instanceTypeId',
    values: [],
  },
  {
    name: 'mode',
    cql: 'modeOfIssuanceId',
    values: [],
  },
  {
    name: 'natureOfContent',
    cql: 'natureOfContentTermIds',
    values: [],
  },
  {
    name: 'location',
    cql: 'holdingsRecords.permanentLocationId',
    values: [],
  },
  {
    name: 'staffSuppress',
    cql: 'staffSuppress',
    values: [],
    parse: buildOptionalBooleanQuery('staffSuppress'),
  },
  {
    name: 'discoverySuppress',
    cql: 'discoverySuppress',
    values: [],
    parse: buildOptionalBooleanQuery('discoverySuppress'),
  },
  {
    name: 'createdDate',
    cql: 'metadata.createdDate',
    values: [],
    parse: buildDateRangeQuery('createdDate'),
  },
  {
    name: 'updatedDate',
    cql: 'metadata.updatedDate',
    values: [],
    parse: buildDateRangeQuery('updatedDate'),
  },
  {
    name: 'source',
    cql: 'source',
    operator: '==',
    values: [],
  },
  {
    name: 'tags',
    cql: 'tags.tagList',
    values: [],
    operator: '=',
  },
];

export const instanceIndexes = [
  { label: 'ui-inventory.search.all', value: 'all', queryTemplate: 'keyword all "%{query.query}"' },
  { label: 'ui-inventory.contributor', value: 'contributor', queryTemplate: 'contributors =/@name "%{query.query}"' },
  { label: 'ui-inventory.title', value: 'title', queryTemplate: 'title all "%{query.query}"' },
  { label: 'ui-inventory.identifierAll', value: 'identifier', queryTemplate: 'identifiers =/@value "%{query.query}"' },
  { label: 'ui-inventory.isbn', prefix: '- ', value: 'isbn', queryTemplate: 'identifiers =/@value/@identifierTypeId="<%= identifierTypeId %>" "%{query.query}"' },
  { label: 'ui-inventory.isbnNormalized', prefix: '- ', value: 'isbnNormalized', queryTemplate: 'isbn="%{query.query}" OR invalidIsbn="%{query.query}"' },
  { label: 'ui-inventory.issn', prefix: '- ', value: 'issn', queryTemplate: 'identifiers =/@value/@identifierTypeId="<%= identifierTypeId %>" "%{query.query}"' },
  { label: 'ui-inventory.subject', value: 'subject', queryTemplate: 'subjects="%{query.query}"' },
  // { label: 'ui-inventory.barcode', value: 'item.barcode', queryTemplate: 'item.barcode=="%{query.query}"' },
  { label: 'ui-inventory.instanceHrid', value: 'hrid', queryTemplate: 'hrid=="%{query.query}"' },
  { label: 'ui-inventory.instanceId', value: 'id', queryTemplate: 'id="%{query.query}"' },
  { label: 'ui-inventory-es.advancedSearch', value: 'advancedSearch', queryTemplate: '%{query.query}' },
];

export const instanceIndexesES = [
  { label: 'ui-inventory-es.search.all', value: 'all', queryTemplate: 'keyword all' },
  { label: 'ui-inventory-es.title', value: 'Title', queryTemplate: 'title all' },
  { label: 'ui-inventory-es.contributor', value: 'Contributor', queryTemplate: 'contributors=' },
  { label: 'ui-inventory-es.identifierAll', value: 'Identifier', queryTemplate: 'identifiers.value==' },
  { label: 'ui-inventory-es.issn', value: 'ISSN', queryTemplate: 'issn==' },
  { label: 'ui-inventory-es.isbn', value: 'ISBN', queryTemplate: 'isbn==' },
  { label: 'ui-inventory-es.subject', value: 'Subject', queryTemplate: 'subjects all' },
  { label: 'ui-inventory-es.instanceId', value: 'UUID', queryTemplate: 'id==' },
  { label: 'ui-inventory-es.instanceHrid', value: 'HRID', queryTemplate: 'hrid==' },
];

export const instanceSortMap = {
  Title: 'title',
  publishers: 'publication',
  Contributors: 'contributors',
};

export const holdingIndexes = [
  { label: 'ui-inventory.search.all', value: 'all', queryTemplate: 'keyword all "%{query.query}"' },
  { label: 'ui-inventory.isbn', value: 'isbn', queryTemplate: 'identifiers =/@value/@identifierTypeId="<%= identifierTypeId %>" "%{query.query}"' },
  { label: 'ui-inventory.isbnNormalized', value: 'isbnNormalized', queryTemplate: 'isbn="%{query.query}" OR invalidIsbn="%{query.query}"' },
  { label: 'ui-inventory.issn', value: 'issn', queryTemplate: 'identifiers =/@value/@identifierTypeId="<%= identifierTypeId %>" "%{query.query}"' },
  { label: 'ui-inventory.callNumberEyeReadable',
    value: 'callNumberER',
    queryTemplate: `
      holdingsRecords.fullCallNumber=="%{query.query}"
      OR holdingsRecords.callNumberAndSuffix=="%{query.query}"
      OR holdingsRecords.callNumber=="%{query.query}"
    ` },
  { label: 'ui-inventory.callNumberNormalized',
    value: 'callNumberNormalized',
    queryTemplate: 'holdingsRecords.fullCallNumberNormalized="%{query.query}" OR holdingsRecords.callNumberAndSuffixNormalized="%{query.query}"' },
  { label: 'ui-inventory.holdingsHrid', value: 'hrid', queryTemplate: 'holdingsRecords.hrid=="%{query.query}"' },
  { label: 'ui-inventory-es.advancedSearch', value: 'advancedSearch', queryTemplate: '%{query.query}' },
];

export const holdingIndexesES = [
  { label: 'ui-inventory-es.search.all', value: 'all', queryTemplate: 'keyword all' },
  { label: 'ui-inventory-es.issn', value: 'ISSN', queryTemplate: 'issn==' },
  { label: 'ui-inventory-es.isbn', value: 'ISBN', queryTemplate: 'isbn==' },
  { label: 'ui-inventory-es.callNumber', value: 'Call Number', queryTemplate: 'holdingsCallNumber=' },
  { label: 'ui-inventory-es.holdingsHrid', value: 'HRID', queryTemplate: 'holdingsRecords.hrid==' },
];

export const holdingSortMap = {};

export const holdingFilterConfig = [
  {
    name: 'effectiveLocation',
    cql: 'item.effectiveLocationId',
    values: [],
  },
  {
    name: 'holdingsPermanentLocation',
    cql: 'holdingsRecords.permanentLocationId',
    values: [],
  },
  {
    name: 'discoverySuppress',
    cql: 'holdingsRecords.discoverySuppress',
    values: [],
    parse: buildOptionalBooleanQuery('holdingsRecords.discoverySuppress'),
  },
  {
    name: 'tags',
    cql: 'holdingsRecords.tags.tagList',
    values: [],
    operator: '=',
  },
];

export const itemIndexes = [
  { label: 'ui-inventory.search.all', value: 'all', queryTemplate: 'keyword all "%{query.query}"' },
  { label: 'ui-inventory.barcode', value: 'item.barcode', queryTemplate: 'item.barcode=="%{query.query}"' },
  { label: 'ui-inventory.isbn', value: 'isbn', queryTemplate: 'identifiers =/@value/@identifierTypeId="<%= identifierTypeId %>" "%{query.query}"' },
  { label: 'ui-inventory.isbnNormalized', value: 'isbnNormalized', queryTemplate: 'isbn="%{query.query}" OR invalidIsbn="%{query.query}"' },
  { label: 'ui-inventory.issn', value: 'issn', queryTemplate: 'identifiers =/@value/@identifierTypeId="<%= identifierTypeId %>" "%{query.query}"' },
  { label: 'ui-inventory.itemEffectiveCallNumberEyeReadable',
    value: 'itemCallNumberER',
    queryTemplate: `
      item.fullCallNumber=="%{query.query}"
      OR item.callNumberAndSuffix=="%{query.query}"
      OR item.effectiveCallNumberComponents.callNumber=="%{query.query}"
    ` },
  { label: 'ui-inventory.itemEffectiveCallNumberNormalized',
    value: 'itemCallNumberNorm',
    queryTemplate: 'item.fullCallNumberNormalized="%{query.query}" OR item.callNumberAndSuffixNormalized="%{query.query}"' },
  { label: 'ui-inventory.itemHrid', value: 'hrid', queryTemplate: 'item.hrid=="%{query.query}"' },
  { label: 'ui-inventory-es.advancedSearch', value: 'advancedSearch', queryTemplate: '%{query.query}' },
];

export const itemIndexesES = [
  { label: 'ui-inventory-es.search.all', value: 'all', queryTemplate: 'keyword all' },
  { label: 'ui-inventory-es.barcode', value: 'Barcode', queryTemplate: 'item.barcode==' },
  { label: 'ui-inventory-es.issn', value: 'ISSN', queryTemplate: 'issn==' },
  { label: 'ui-inventory-es.isbn', value: 'ISBN', queryTemplate: 'isbn==' },
  { label: 'ui-inventory-es.callNumber', value: 'Call Number', queryTemplate: 'itemsCallNumber=' },
  { label: 'ui-inventory-es.itemHrid', value: 'Item HRID', queryTemplate: 'item.hrid==' },
];

export const itemFilterConfig = [
  {
    name: 'materialType',
    cql: 'item.materialTypeId',
    values: [],
  },
  {
    name: 'itemStatus',
    cql: 'item.status.name',
    operator: '==',
    values: [],
  },
  {
    name: 'effectiveLocation',
    cql: 'item.effectiveLocationId',
    values: [],
  },
  {
    name: 'holdingsPermanentLocation',
    cql: 'holdingsRecords.permanentLocationId',
    values: [],
  },
  {
    name: 'discoverySuppress',
    cql: 'item.discoverySuppress',
    values: [],
    parse: buildOptionalBooleanQuery('item.discoverySuppress'),
  },
  {
    name: 'tags',
    cql: 'item.tags.tagList',
    values: [],
    operator: '=',
  },
];

const operators = [
  { label: 'ui-inventory-es.equality', queryTemplate: '' },
];

const booleanOperators = [
  { label: 'ui-inventory-es.and' },
  { label: 'ui-inventory-es.or' },
];

export const itemSortMap = {
  Title: 'title',
  publishers: 'publication',
  Contributors: 'contributors',
};

const config = {
  instances: {
    filters: instanceFilterConfig,
    indexes: instanceIndexes,
    sortMap: instanceSortMap,
    renderer: instanceFilterRenderer,
    indexesES: instanceIndexesES,
    operators,
    booleanOperators,
  },
  holdings: {
    filters: holdingFilterConfig,
    indexes: holdingIndexes,
    sortMap: holdingSortMap,
    renderer: holdingsRecordFilterRenderer,
    indexesES: holdingIndexesES,
    operators,
    booleanOperators,
  },
  items: {
    filters: itemFilterConfig,
    indexes: itemIndexes,
    sortMap: itemSortMap,
    renderer: itemFilterRenderer,
    indexesES: itemIndexesES,
    operators,
    booleanOperators,
  }
};

export const getFilterConfig = (segment = 'instances') => config[segment];
