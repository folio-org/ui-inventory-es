import React from 'react';

const AWAITING_DELIVERY = 'Awaiting delivery';
const AWAITING_PICKUP = 'Awaiting pickup';
const IN_TRANSIT = 'In transit';

export const itemStatusesMap = {
  CHECKED_OUT: 'Checked out',
  ON_ORDER: 'On order',
  AVAILABLE: 'Available',
  IN_TRANSIT,
  IN_PROCESS: 'In process',
  AWAITING_PICKUP,
  PAGED: 'Paged',
  AWAITING_DELIVERY,
  MISSING: 'Missing',
  WITHDRAWN: 'Withdrawn',
  CLAIMED_RETURNED: 'Claimed returned',
  LOST_AND_PAID: 'Lost and paid',
  AGED_TO_LOST: 'Aged to lost',
};

export const requestStatuses = {
  OPEN_AWAITING_PICKUP: `Open - ${AWAITING_PICKUP}`,
  OPEN_NOT_YET_FILLED: 'Open - Not yet filled',
  OPEN_IN_TRANSIT: `Open - ${IN_TRANSIT}`,
  OPEN_AWAITING_DELIVERY: `Open - ${AWAITING_DELIVERY}`,
};

export const itemStatuses = [
  { label: 'ui-inventory.item.status.agedToLost', value: 'Aged to lost' },
  { label: 'ui-inventory.item.status.available', value: 'Available' },
  { label: 'ui-inventory.item.status.awaitingPickup', value: 'Awaiting pickup' },
  { label: 'ui-inventory.item.status.awaitingDelivery', value: 'Awaiting delivery' },
  { label: 'ui-inventory.item.status.checkedOut', value: 'Checked out' },
  { label: 'ui-inventory.item.status.claimedReturned', value: 'Claimed returned' },
  { label: 'ui-inventory.item.status.declaredLost', value: 'Declared lost' },
  { label: 'ui-inventory.item.status.inProcess', value: 'In process' },
  { label: 'ui-inventory.item.status.inProcessNonRequestable', value: 'In process (non-requestable)' },
  { label: 'ui-inventory.item.status.inTransit', value: 'In transit' },
  { label: 'ui-inventory.item.status.intellectualItem', value: 'Intellectual item' },
  { label: 'ui-inventory.item.status.longMissing', value: 'Long missing' },
  { label: 'ui-inventory.item.status.lostAndPaid', value: 'Lost and paid' },
  { label: 'ui-inventory.item.status.missing', value: 'Missing' },
  { label: 'ui-inventory.item.status.onOrder', value: 'On order' },
  { label: 'ui-inventory.item.status.paged', value: 'Paged' },
  { label: 'ui-inventory.item.status.restricted', value: 'Restricted' },
  { label: 'ui-inventory.item.status.orderClosed', value: 'Order closed' },
  { label: 'ui-inventory.item.status.unavailable', value: 'Unavailable' },
  { label: 'ui-inventory.item.status.unknown', value: 'Unknown' },
  { label: 'ui-inventory.item.status.withdrawn', value: 'Withdrawn' },
];

export const segments = {
  instances: 'instances',
  holdings: 'holdings',
  items: 'items',
};

export const CQL_FIND_ALL = 'cql.allRecords=1';

// this constant is used for reading the given dash character as "no value set" by a screenreader
export const noValue = (
  <span
    /* eslint-disable-next-line jsx-a11y/aria-role */
    role="text"
    aria-label="no value set"
  >
    -
  </span>
);

export const emptyList = [{}];

export const wrappingCell = { wordBreak: 'break-word' };

export const hridSettingsSections = [
  {
    type: 'instances',
    title: 'ui-inventory.hridHandling.sectionHeader1',
  },
  {
    type: 'holdings',
    title: 'ui-inventory.hridHandling.sectionHeader2',
  },
  {
    type: 'items',
    title: 'ui-inventory.hridHandling.sectionHeader3',
  },
];

export const holdingsStatementTypes = [
  {
    type: 'holdingsStatement',
    title: 'Holdings statement',
  },
  {
    type: 'holdingsStatementForSupplements',
    title: 'Holdings statement for supplements',
  },
  {
    type: 'holdingsStatementForIndexes',
    title: 'Holdings statement for indexes',
  },
];

export const indentifierTypeNames = {
  ISBN: 'ISBN',
  ISSN: 'ISSN',
};

export const DATE_FORMAT = 'YYYY-MM-DD';

export const INSTANCES_ID_REPORT_TIMEOUT = 2000;

export const QUICK_EXPORT_LIMIT = process.env.NODE_ENV !== 'test' ? 100 : 2;

export const DEFAULT_FILTERS_NUMBER = 6;

export const FACETS = {
  EFFECTIVE_LOCATION: 'effectiveLocation',
  LANGUAGE: 'language',
  RESOURCE: 'resource',
  FORMAT: 'format',
  MODE: 'mode',
  NATURE_OF_CONTENT: 'natureOfContent',
  STAFF_SUPPRESS: 'staffSuppress',
  INSTANCES_DISCOVERY_SUPPRESS: 'instancesDiscoverySuppress',
  ITEMS_DISCOVERY_SUPPRESS: 'itemsDiscoverySuppress',
  HOLDINGS_DISCOVERY_SUPPRESS: 'holdingsDiscoverySuppress',
  CREATED_DATE: 'createdDate',
  UPDATED_DATE: 'updatedDate',
  SOURCE: 'source',
  INSTANCES_TAGS: 'instancesTags',
  HOLDINGS_TAGS: 'holdingsTags',
  ITEMS_TAGS: 'itemsTags',
  MATERIAL_TYPE: 'materialType',
  ITEM_STATUS: 'itemStatus',
  HOLDINGS_PERMANENT_LOCATION: 'holdingsPermanentLocation',
};

export const IDs = {
  EFFECTIVE_LOCATION_ID: 'items.effectiveLocationId',
  LANGUAGES: 'languages',
  INSTANCE_TYPE_ID: 'instanceTypeId',
  INSTANCE_FORMAT_ID: 'instanceFormatId',
  MODE_OF_ISSUANCE_ID: 'modeOfIssuanceId',
  NATURE_OF_CONTENT_TERM_IDS: 'natureOfContentTermIds',
  STAFF_SUPPRESS: 'staffSuppress',
  INSTANCES_DISCOVERY_SUPPRESS: 'discoverySuppress',
  HOLDINGS_DISCOVERY_SUPPRESS_ID: 'holdings.discoverySuppress',
  ITEMS_DISCOVERY_SUPPRESS_ID: 'items.discoverySuppress',
  CREATED_DATE_ID: 'createDateId',
  UPDATED_DATE_ID: 'updatedDateId',
  SOURCE: 'source',
  INSTANCES_TAGS_ID: 'instanceTags',
  HOLDINGS_TAGS_ID: 'holdings.tags.tagList',
  ITEMS_TAGS_ID: 'items.tags.tagList',
  MATERIAL_TYPES_ID: 'items.materialTypeId',
  ITEMS_STATUSES_ID: 'items.status.name',
  HOLDINGS_PERMANENT_LOCATION_ID: 'holdings.permanentLocationId'
};

export const FACETS_TO_REQUEST = {
  [FACETS.EFFECTIVE_LOCATION]: IDs.EFFECTIVE_LOCATION_ID,
  [FACETS.LANGUAGE]: IDs.LANGUAGES,
  [FACETS.RESOURCE]: IDs.INSTANCE_TYPE_ID,
  [FACETS.FORMAT]: IDs.INSTANCE_FORMAT_ID,
  [FACETS.MODE]: IDs.MODE_OF_ISSUANCE_ID,
  [FACETS.NATURE_OF_CONTENT]: IDs.NATURE_OF_CONTENT_TERM_IDS,
  [FACETS.STAFF_SUPPRESS]: IDs.STAFF_SUPPRESS,
  [FACETS.INSTANCES_DISCOVERY_SUPPRESS]: IDs.INSTANCES_DISCOVERY_SUPPRESS,
  [FACETS.HOLDINGS_DISCOVERY_SUPPRESS]: IDs.HOLDINGS_DISCOVERY_SUPPRESS_ID,
  [FACETS.ITEMS_DISCOVERY_SUPPRESS]: IDs.ITEMS_DISCOVERY_SUPPRESS_ID,
  [FACETS.SOURCE]: IDs.SOURCE,
  [FACETS.INSTANCES_TAGS]: IDs.INSTANCES_TAGS_ID,
  [FACETS.ITEMS_TAGS]: IDs.ITEMS_TAGS_ID,
  [FACETS.HOLDINGS_TAGS]: IDs.HOLDINGS_TAGS_ID,
  [FACETS.MATERIAL_TYPE]: IDs.MATERIAL_TYPES_ID,
  [FACETS.ITEM_STATUS]: IDs.ITEMS_STATUSES_ID,
  [FACETS.HOLDINGS_PERMANENT_LOCATION]: IDs.HOLDINGS_PERMANENT_LOCATION_ID,
};

export const FACETS_OPTIONS = {
  [IDs.EFFECTIVE_LOCATION_ID]: 'effectiveLocationOptions',
  [IDs.LANGUAGES]: 'langOptions',
  [IDs.INSTANCE_TYPE_ID]: 'resourceTypeOptions',
  [IDs.INSTANCE_FORMAT_ID]: 'instanceFormatOptions',
  [IDs.MODE_OF_ISSUANCE_ID]: 'modeOfIssuanceOptions',
  [IDs.NATURE_OF_CONTENT_TERM_IDS]: 'natureOfContentOptions',
  [IDs.STAFF_SUPPRESS]: 'suppressedOptions',
  [IDs.INSTANCES_DISCOVERY_SUPPRESS]: 'discoverySuppressOptions',
  [IDs.HOLDINGS_DISCOVERY_SUPPRESS_ID]: 'discoverySuppressOptions',
  [IDs.ITEMS_DISCOVERY_SUPPRESS_ID]: 'discoverySuppressOptions',
  [IDs.SOURCE]: 'sourceOptions',
  [IDs.INSTANCES_TAGS_ID]: 'tagsRecords',
  [IDs.HOLDINGS_TAGS_ID]: 'tagsRecords',
  [IDs.ITEMS_TAGS_ID]: 'tagsRecords',
  [IDs.MATERIAL_TYPES_ID]: 'materialTypesOptions',
  [IDs.ITEMS_STATUSES_ID]: 'itemStatusesOptions',
  [IDs.HOLDINGS_PERMANENT_LOCATION_ID]: 'holdingsPermanentLocationOptions',
};
