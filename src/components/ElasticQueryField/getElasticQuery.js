import cp from './cqlParser';

const createRegexpToElasticSearch = (templates) => {
  let string = '';

  for (const searchOption in templates) {
    if (Object.prototype.hasOwnProperty.call(templates, searchOption)) {
      string += `${searchOption}|`.replace(/[()]/g, m => `\\${m}`);
    }
  }

  return new RegExp(`${string}`.replace(/\|$/, ''), 'gi');
};

const getElasticTemplates = (searchOptions, operators) => {
  const indexTemplates = searchOptions.reduce((accum, { label, queryTemplate }) => {
    accum[label.toLowerCase()] = queryTemplate;
    return accum;
  }, {});

  const operatorTemplates = operators.reduce((accum, { label, queryTemplate }) => {
    accum[label.toLowerCase()] = queryTemplate;
    return accum;
  }, {});

  return { ...indexTemplates, ...operatorTemplates };
};

const replaceLabelsWithTemplates = (searchOptions, operators) => {
  const templates = getElasticTemplates(searchOptions, operators);
  const regExp = createRegexpToElasticSearch(templates);

  return cp.toString()
    .replace(regExp, m => templates[m.toLowerCase()])
    .replace(/ {2}/g, ' ');
};

const getElasticQuery = (value, isSearchByKeyword, searchOptions, operators) => {
  if (isSearchByKeyword) {
    const keywordAll = searchOptions.find(option => option.value === 'all')?.queryTemplate;
    return `${keywordAll} "${value}"`;
  }
  cp.parse(value);
  return replaceLabelsWithTemplates(searchOptions, operators);
};

export default getElasticQuery;
