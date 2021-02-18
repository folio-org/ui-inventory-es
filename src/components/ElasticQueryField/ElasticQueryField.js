import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import classNames from 'classnames';
import TextArea from '@folio/stripes-components/lib/TextArea';
import { Highlighter } from '@folio/stripes-components';
import { operators, booleanOperators } from './elasticConfig';
import css from './ElasticQueryField.css';

const UNSELECTED_OPTION_INDEX = -1;
const SPACE = ' ';
const OPEN_BRACKET = '(';
const CLOSE_BRACKET = ')';

const propTypes = {
  onChange: PropTypes.func,
  searchButtonRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  searchOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })),
  setIsSearchByKeyword: PropTypes.func,
  terms: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })),
  value: PropTypes.string,
  warning: PropTypes.string,
};

const ElasticQueryField = props => {
  const {
    value,
    onChange,
    setIsSearchByKeyword,
    searchButtonRef = {},
    searchOptions,
    terms = [],
    warning,
  } = props;

  const intl = useIntl();
  const [searchOption, setSearchOption] = useState('');
  const [operator, setOperator] = useState('');
  const [term, setTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [focusedOptionIndex, setFocusedOptionIndex] = useState(UNSELECTED_OPTION_INDEX);
  const [typedValue, setTypedValue] = useState('');
  const [prevValue, setPrevValue] = useState('');
  const [isOpenBracketAfterEquality, setIsOpenBracketAfterEquality] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState('');
  const [isWarning, setIsWarning] = useState(false);

  const textareaRef = useRef();
  const optionsContainerRef = useRef();
  const optionRef = useRef();

  const isTypedValueNotBracket = typedValue !== OPEN_BRACKET && typedValue !== CLOSE_BRACKET;
  const curValueWithoutLastEnteredValue = value.slice(0, prevValue.length);
  const typedValueWithoutOpenBracket = typedValue[0] === OPEN_BRACKET
    ? typedValue.slice(1)
    : typedValue;

  const warningMessage = isWarning
    && (warning || intl.formatMessage({ id: 'ui-inventory-es.elasticWarning' }));

  const resetFocusedOptionIndex = () => {
    setFocusedOptionIndex(UNSELECTED_OPTION_INDEX);
  };

  const resetStructure = () => {
    setSearchOption('');
    setOperator('');
    setTerm('');
  };

  const addQuotes = valueToInsert => {
    if (valueToInsert.includes(SPACE)) {
      if (valueToInsert.startsWith(OPEN_BRACKET)) {
        return `${OPEN_BRACKET}"${valueToInsert.slice(1)}"`;
      }
      if (valueToInsert.endsWith(CLOSE_BRACKET) && !valueToInsert.includes(OPEN_BRACKET)) {
        return `"${valueToInsert.slice(0, -1)}"${CLOSE_BRACKET}`;
      }
      return `"${valueToInsert}"`;
    }

    if (valueToInsert.startsWith(OPEN_BRACKET)) {
      return `${OPEN_BRACKET}${valueToInsert.slice(1)}`;
    }
    if (valueToInsert.endsWith(CLOSE_BRACKET)) {
      return `${valueToInsert.slice(0, -1)}${CLOSE_BRACKET}`;
    }
    return `${valueToInsert}`;
  };

  const isValueFromOptions = (val) => {
    return options.some(option => {
      return option.label.toLowerCase() === val.toLowerCase();
    });
  };

  const setEnteredSearchOption = (valueToInsert) => {
    const desiredValueView = addQuotes(valueToInsert);
    onChange(`${curValueWithoutLastEnteredValue}${desiredValueView} `);
    setSearchOption(valueToInsert);
    setPrevValue(prevVal => `${prevVal}${desiredValueView} `);
  };

  const processEnteredSearchOption = (valueToInsert, isOptionSelected) => {
    if (isOptionSelected) {
      const searchOptionValue = typedValue[0] === OPEN_BRACKET
        ? `${OPEN_BRACKET}${valueToInsert}`
        : valueToInsert;

      setEnteredSearchOption(searchOptionValue);
      resetFocusedOptionIndex();
      setIsWarning(false);
    } else {
      const valueWithoutOpenBracket = valueToInsert.startsWith(OPEN_BRACKET)
        ? valueToInsert.slice(1)
        : valueToInsert;

      if (isValueFromOptions(valueWithoutOpenBracket)) {
        setEnteredSearchOption(valueToInsert);
        setIsWarning(false);
      } else {
        setIsWarning(true);
      }
    }
  };

  const setEnteredOperator = (valueToInsert) => {
    onChange(`${curValueWithoutLastEnteredValue}${valueToInsert} `);
    setOperator(valueToInsert);
    setPrevValue(prevVal => `${prevVal}${valueToInsert} `);
  };

  const processEnteredOperator = (valueToInsert, isOptionSelected) => {
    if (isOptionSelected) {
      setEnteredOperator(valueToInsert);
      resetFocusedOptionIndex();
      setIsWarning(false);
    } else if (isValueFromOptions(valueToInsert)) {
      setIsWarning(false);
      setEnteredOperator(valueToInsert);
    } else {
      setIsWarning(true);
    }
  };

  const setEnteredTerm = (valueToInsert) => {
    const desiredValueView = addQuotes(valueToInsert);
    onChange(`${curValueWithoutLastEnteredValue}${desiredValueView} `);
    setTerm(valueToInsert);
    setPrevValue(prevVal => `${prevVal}${desiredValueView} `);
  };

  const processEnteredTerm = (valueToInsert, isOptionSelected) => {
    if (isOptionSelected) {
      setEnteredTerm(valueToInsert);
      resetFocusedOptionIndex();
      setIsWarning(false);
    } else if (options.length) {
      const valueWithoutClosedBracket = valueToInsert.endsWith(CLOSE_BRACKET)
        ? valueToInsert.slice(0, -1)
        : valueToInsert;
      if (isValueFromOptions(valueWithoutClosedBracket)) {
        setEnteredTerm(valueToInsert);
        setIsWarning(false);
      } else {
        setIsWarning(true);
      }
    } else {
      if (valueToInsert.startsWith(OPEN_BRACKET)) {
        setIsOpenBracketAfterEquality(true);
      } else if (valueToInsert.endsWith(CLOSE_BRACKET)) {
        setIsOpenBracketAfterEquality(false);
      }
      setEnteredTerm(valueToInsert);
    }
  };

  const setEnteredBooleanOperator = (valueToInsert) => {
    onChange(`${curValueWithoutLastEnteredValue}${valueToInsert} `);
    setPrevValue(prevVal => `${prevVal}${valueToInsert} `);
  };

  const processEnteredBooleanOperator = (valueToInsert, isOptionSelected) => {
    if (isOptionSelected) {
      setEnteredBooleanOperator(valueToInsert);
      resetFocusedOptionIndex();
      resetStructure();
      setIsWarning(false);
    } else if (isValueFromOptions(valueToInsert)) {
      setEnteredBooleanOperator(valueToInsert);
      setIsWarning(false);
      if (isOpenBracketAfterEquality) {
        setTerm('');
      } else {
        resetStructure();
      }
    } else {
      setIsWarning(true);
    }
  };

  const handleValueToInsert = (valueToInsert, isOptionSelected) => {
    const properties = [valueToInsert, isOptionSelected];

    if (!searchOption) {
      const isValueForKeywordSearch = !curValueWithoutLastEnteredValue && !isValueFromOptions(valueToInsert);

      if (isValueForKeywordSearch) {
        searchButtonRef.current.click();
      } else {
        processEnteredSearchOption(...properties);
      }
    } else if (!operator) {
      processEnteredOperator(...properties);
    } else if (!term) {
      processEnteredTerm(...properties);
    } else {
      processEnteredBooleanOperator(...properties);
    }
    setTypedValue('');
  };

  const handleChange = event => {
    const val = event.target.value;
    const typedVal = val.slice(curValueWithoutLastEnteredValue.length);
    setTypedValue(typedVal);
    resetFocusedOptionIndex();
    onChange(val);

    if (!searchOption) {
      setIsSearchByKeyword(true);
    } else {
      setIsSearchByKeyword(false);
    }
  };

  const moveScrollToDown = (isLastOption) => {
    const optionsContainerElement = optionsContainerRef.current;
    const optionElement = optionRef.current;

    if (isLastOption) {
      optionsContainerElement.scrollTop = 0;
    } else if (optionElement) {
      const optionPosition = optionElement.offsetTop + optionElement.offsetHeight;
      const optionsContainerPosition =
        optionsContainerElement.clientHeight +
        optionsContainerElement.scrollTop -
        optionElement.offsetHeight;

      // Measured the option position with the option height
      // changed the scroll top if the option reached the end of the options container height
      if (optionPosition >= optionsContainerPosition) {
        optionsContainerElement.scrollTop += optionElement.offsetHeight;
      }
    }
  };

  const moveScrollToTop = (isFirstOption) => {
    const optionsContainerElement = optionsContainerRef.current;
    const optionElement = optionRef.current;

    if (isFirstOption) {
      if (optionsContainerElement) {
        optionsContainerElement.scrollTop = optionsContainerElement.scrollHeight;
      }
    } else if (optionElement && optionsContainerElement) {
      const optionPosition = optionElement.offsetTop - optionElement.offsetHeight;
      if (optionPosition <= optionsContainerElement.scrollTop) {
        optionsContainerElement.scrollTop -= optionElement.offsetHeight;
      }
    }
  };

  const openOptions = () => {
    setIsOpen(true);
  };

  const closeOptions = () => {
    setIsOpen(false);
  };

  const handleKeyDown = event => {
    const lastOptionIndex = options.length - 1;

    switch (event.keyCode) {
      case 13: { // enter
        event.preventDefault();
        const isOptionSelected = focusedOptionIndex !== UNSELECTED_OPTION_INDEX;
        const selectedOption = options[focusedOptionIndex];
        const valueToInsert = isOptionSelected
          ? selectedOption.label
          : typedValue;
        const isStructureFull = searchOption && operator && term;
        const canSend = !valueToInsert && isStructureFull && searchButtonRef.current;

        if (canSend) {
          searchButtonRef.current.click();
        } else {
          handleValueToInsert(valueToInsert, isOptionSelected);
        }
        break;
      }
      case 40: // arrowDown
        if (options.length) {
          const isLastOption = focusedOptionIndex === lastOptionIndex;
          if (isLastOption) {
            moveScrollToDown(isLastOption);
            setFocusedOptionIndex(0);
          } else {
            moveScrollToDown();
            setFocusedOptionIndex(prevOptionIndex => prevOptionIndex + 1);
          }
        }
        break;
      case 38: // arrowUp
        if (options.length) {
          const isFirstOption = !focusedOptionIndex;
          if (isFirstOption) {
            moveScrollToTop(isFirstOption);
            setFocusedOptionIndex(lastOptionIndex);
          } else {
            moveScrollToTop();
            setFocusedOptionIndex(prevOptionIndex => prevOptionIndex - 1);
          }
        }
        break;
      case 27: // escape
        textareaRef.current.blur();
        break;
      case 9: // tab
        closeOptions();
        resetFocusedOptionIndex();
        break;
      default:
    }
  };

  const handleBlur = () => {
    closeOptions();
    resetFocusedOptionIndex();
  };

  const formatOptions = (suggestions) => {
    return suggestions.map(suggestion => {
      const label = intl.formatMessage({ id: suggestion.label });
      return { ...suggestion, label };
    });
  };

  const processOptions = () => {
    let suggestions = [];

    if (!searchOption) {
      const isValueForKeywordSearch = !curValueWithoutLastEnteredValue
        && !searchOptions.some(option => {
          return option.label.toLowerCase().includes(value.toLowerCase());
        });

      if (!isValueForKeywordSearch) {
        suggestions = searchOptions;
      }
    } else if (!operator) {
      suggestions = formatOptions(operators);
    } else if (!term) {
      suggestions = terms;
    } else {
      suggestions = formatOptions(booleanOperators);
    }

    if (typedValue && isTypedValueNotBracket) {
      const filteredOptions = suggestions.filter(suggestion => {
        return suggestion.label.toLowerCase().includes(typedValueWithoutOpenBracket.toLowerCase());
      });
      setOptions(filteredOptions);
    } else {
      setOptions(suggestions);
    }
  };

  const handleOptionRef = (element, isFocused) => {
    if (isFocused) {
      setSelectedOptionId(element?.getAttribute('id'));
      optionRef.current = element;
    }
  };

  const handleMouseDown = (event) => {
    event.preventDefault();
  };

  const renderOptions = () => {
    return (
      options?.length
        ? (
          <div className={css.optionMenu}>
            <ul
              aria-labelledby="label"
              role="listbox"
              id="listboxId"
              className={css.optionList}
              ref={optionsContainerRef}
              onMouseDown={handleMouseDown}
            >
              {options.map((option, index) => {
                const searchWords = isTypedValueNotBracket && typedValueWithoutOpenBracket
                  ? [typedValueWithoutOpenBracket]
                  : [];
                const isFocused = focusedOptionIndex === index;

                return (
                  <li
                    role="option"
                    id={`list-item-${index}`}
                    aria-selected={isFocused}
                    key={option.label}
                    ref={(element) => handleOptionRef(element, isFocused)}
                    className={classNames(css.option, isFocused && css.optionCursor)}
                    onClick={() => handleValueToInsert(option.label)}
                    onKeyDown={() => null}
                  >
                    <Highlighter
                      searchWords={searchWords}
                      text={option.label}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        )
        : null
    );
  };

  useEffect(() => {
    textareaRef.current.focus();
    textareaRef.current.style.height = 0;
    const scrollHeight = textareaRef.current.scrollHeight;
    textareaRef.current.style.height = `${scrollHeight}px`;

    if (value) {
      processOptions();
      openOptions();
    } else {
      setPrevValue('');
      closeOptions();
      resetFocusedOptionIndex();
      resetStructure();
    }
  }, [value]);

  return (
    <div
      className={css.multiSelectSearchWrapper}
      onBlur={handleBlur}
    >
      <TextArea
        role="combobox"
        aria-expanded={isOpen}
        aria-owns="listboxId"
        aria-haspopup="listbox"
        id="textArea"
        aria-autocomplete="list"
        aria-controls="listboxId"
        aria-activedescendant={selectedOptionId}
        aria-describedby="info"
        inputRef={textareaRef}
        marginBottom0
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        warning={warningMessage}
      />
      <p
        role="alert"
        id="info"
        className={css.info}
      >
        <FormattedMessage id="ui-inventory-es.elasticOptionsInfo" />
      </p>
      {isOpen && renderOptions()}
    </div>
  );
};

ElasticQueryField.propTypes = propTypes;

export default ElasticQueryField;
