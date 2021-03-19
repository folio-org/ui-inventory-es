export const FACETS = {
  EFFECTIVE_LOCATION: 'effectiveLocation',
  LANGUAGE: 'language',
  RESOURCE: 'resource',
  FORMAT: 'format',
  MODE: 'mode',
  NATURE_OF_CONTENT: 'natureOfContent',
  STAFF_SUPPRESS: 'staffSuppress',
  DISCOVERY_SUPPRESS: 'discoverySuppress',
  CREATED_DATE: 'createdDate',
  UPDATED_DATE: 'updatedDate',
  SOURCE: 'source',
  TAGS: 'tags',
};

export const IDs = {
  EFFECTIVE_LOCATION_ID: 'items.effectiveLocationId',
  LANGUAGES: 'languages',
  INSTANCE_TYPE_ID: 'instanceTypeId',
  INSTANCE_FORMAT_ID: 'instanceFormatId',
  MODE_OF_ISSUANCE_ID: 'modeOfIssuanceId',
  NATURE_OF_CONTENT_TERM_IDS: 'natureOfContentTermIds',
  STAFF_SUPPRESS: 'staffSuppress',
  DISCOVERY_SUPPRESS: 'discoverySuppress',
  CREATED_DATE_ID: 'createDateId',
  UPDATED_DATE_ID: 'updatedDateId',
  SOURCE: 'source',
  INSTANCE_TAGS: 'instanceTags',
};

export const FACETS_TO_REQUEST = {
  [FACETS.EFFECTIVE_LOCATION]: IDs.EFFECTIVE_LOCATION_ID,
  [FACETS.LANGUAGE]: IDs.LANGUAGES,
  [FACETS.RESOURCE]: IDs.INSTANCE_TYPE_ID,
  [FACETS.FORMAT]: IDs.INSTANCE_FORMAT_ID,
  [FACETS.MODE]: IDs.MODE_OF_ISSUANCE_ID,
  [FACETS.NATURE_OF_CONTENT]: IDs.NATURE_OF_CONTENT_TERM_IDS,
  [FACETS.STAFF_SUPPRESS]: IDs.STAFF_SUPPRESS,
  [FACETS.DISCOVERY_SUPPRESS]: IDs.DISCOVERY_SUPPRESS,
  [FACETS.SOURCE]: IDs.SOURCE,
  [FACETS.TAGS]: IDs.INSTANCE_TAGS,
};
