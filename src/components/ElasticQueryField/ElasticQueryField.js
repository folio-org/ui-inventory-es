import React, { useState } from 'react';
import PropTypes from 'prop-types';
import TextArea from '@folio/stripes-components/lib/TextArea';
import ListItem from './ListItem';
import css from './ElasticQueryField.css';

const UNSELECTED_SUGGESTION_INDEX = -1;

const propTypes = {
  onChange: PropTypes.func,
  searchButtonRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  searchOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })),
  value: PropTypes.string,
};

const ElasticQueryField = props => {
  const {
    onChange,
    searchButtonRef = {},
    searchOptions,
    value = '',
  } = props;

  const [searchOption, setSearchOption] = useState('');
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(UNSELECTED_SUGGESTION_INDEX);
  const [isArrowUp, setIsArrowUp] = useState(false);

  const handleSearchTermsChange = event => {
    onChange(event);
  };

  const getSuggestions = () => {
    if (!searchOption) return searchOptions;
    return [];
  };

  const handleKeyDown = event => {
    const suggestions = getSuggestions();
    const lastSuggestionIndex = suggestions.length - 1;

    switch (event.keyCode) {
      case 13: // enter
        event.preventDefault();
        if (searchButtonRef.current) {
          searchButtonRef.current.click();
        }
        break;
      case 40: // arrowDown
        if (suggestions.length) {
          const isLastSuggestion = selectedSuggestionIndex === lastSuggestionIndex;
          setIsArrowUp(false);
          if (isLastSuggestion) {
            setSelectedSuggestionIndex(0);
          } else {
            setSelectedSuggestionIndex(prevState => prevState + 1);
          }
        }
        break;
      case 38: // arrowUp
        if (suggestions.length) {
          const isFirstSuggestion = !selectedSuggestionIndex;
          setIsArrowUp(true);
          if (isFirstSuggestion) {
            setSelectedSuggestionIndex(lastSuggestionIndex);
          } else {
            setSelectedSuggestionIndex(prevState => prevState - 1);
          }
        }
        break;
      default:
    }
  };

  const renderDropDown = () => {
    const suggestions = getSuggestions();

    return (
      suggestions?.length
        ? (
            <div className={css.optionMenu}>
              <ul className={css.optionList}>
                {suggestions.map(({ label }, index) => (
                  <ListItem
                    key={label}
                    value={label}
                    isSelected={selectedSuggestionIndex === index}
                    isArrowUp={isArrowUp}
                  />
                ))}
              </ul>
            </div>
          )
        : null
    );
  };

  return (
    <div className={css.multiSelectSearchWrapper}>
      <TextArea
        marginBottom0
        value={value}
        onChange={handleSearchTermsChange}
        onKeyDown={handleKeyDown}
      />
      {value && renderDropDown()}
    </div>
  );
};

ElasticQueryField.propTypes = propTypes;

export default ElasticQueryField;
