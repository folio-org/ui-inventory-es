import React, { useState, useRef, useEffect } from 'react';
import { noop } from 'lodash';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import TextArea from '@folio/stripes-components/lib/TextArea';
import { Highlighter } from '@folio/stripes-components';
import css from './ElasticQueryField.css';

const operators = ['='];
const booleanOperators = ['AND', 'OR'];
const UNSELECTED_OPTION_INDEX = -1;

const propTypes = {
  onChange: PropTypes.func,
  onSetIsSearchByKeyword: PropTypes.func,
  searchButtonRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  searchOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })),
  terms: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })),
  value: PropTypes.string,
};

const ElasticQueryField = props => {
  const {
    value,
    onChange,
    onSetIsSearchByKeyword,
    searchButtonRef = {},
    searchOptions,
    terms = [],
  } = props;

  const [searchOption, setSearchOption] = useState('');
  const [operator, setOperator] = useState('');
  const [term, setTerm] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const [options, setOptions] = useState([]);
  const [focusedOptionIndex, setFocusedOptionIndex] = useState(UNSELECTED_OPTION_INDEX);
  const [typedValue, setTypedValue] = useState('');
  const [prevValue, setPrevValue] = useState('');
  const [isOpenBracketAfterEquality, setIsOpenBracketAfterEquality] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState('');

  const textareaRef = useRef();
  const optionsContainerRef = useRef();
  const optionRef = useRef();

  const isTypedValueNotBracket = typedValue !== '(' && typedValue !== ')';
  const typedValueWithoutOpenBracket = typedValue[0] === '(' ? typedValue.slice(1) : typedValue;

  const resetFocusedOptionIndex = () => {
    setFocusedOptionIndex(UNSELECTED_OPTION_INDEX);
  };

  const resetStructure = () => {
    setSearchOption('');
    setOperator('');
    setTerm('');
  };

  const addQuotes = valueToInsert => {
    if (valueToInsert.includes(' ')) {
      if (valueToInsert.startsWith('(')) {
        return `("${valueToInsert.slice(1)}"`;
      }
      if (valueToInsert.endsWith(')') && !valueToInsert.includes('(')) {
        return `"${valueToInsert.slice(0, -1)}")`;
      }
      return `"${valueToInsert}"`;
    }

    if (valueToInsert.startsWith('(')) {
      return `(${valueToInsert.slice(1)}`;
    }
    if (valueToInsert.endsWith(')')) {
      return `${valueToInsert.slice(0, -1)})`;
    }
    return `${valueToInsert}`;
  };

  const isValueFromOptions = (val) => {
    return options.some(option => {
      const offer = option.label || option;
      return offer.toLowerCase() === val.toLowerCase();
    });
  };

  const setEnteredSearchOption = (valueToInsert) => {
    const desiredValueView = addQuotes(valueToInsert);
    onChange(`${prevValue}${desiredValueView} `);
    setSearchOption(valueToInsert);
    setPrevValue(prevVal => `${prevVal}${desiredValueView} `);
  };

  const processEnteredSearchOption = (valueToInsert, isOptionSelected) => {
    if (isOptionSelected) {
      setEnteredSearchOption(typedValue[0] === '(' ? `(${valueToInsert}` : valueToInsert);
      resetFocusedOptionIndex();
    } else {
      const valueWithoutOpenBracket = valueToInsert.startsWith('(') ? valueToInsert.slice(1) : valueToInsert;
      if (isValueFromOptions(valueWithoutOpenBracket)) {
        setEnteredSearchOption(valueToInsert);
      } else {
        onChange(prevValue);
      }
    }
  };

  const setEnteredOperator = (valueToInsert) => {
    onChange(`${prevValue}${valueToInsert} `);
    setOperator(valueToInsert);
    setPrevValue(prevVal => `${prevVal}${valueToInsert} `);
  };

  const processEnteredOperator = (valueToInsert, isOptionSelected) => {
    if (isOptionSelected) {
      setEnteredOperator(valueToInsert);
      resetFocusedOptionIndex();
    } else if (isValueFromOptions(valueToInsert)) {
      setEnteredOperator(valueToInsert);
    } else {
      onChange(prevValue);
    }
  };

  const setEnteredTerm = (valueToInsert) => {
    const desiredValueView = addQuotes(valueToInsert);
    onChange(`${prevValue}${desiredValueView} `);
    setTerm(valueToInsert);
    setPrevValue(prevVal => `${prevVal}${desiredValueView} `);
  };

  const processEnteredTerm = (valueToInsert, isOptionSelected) => {
    if (isOptionSelected) {
      setEnteredTerm(valueToInsert);
      resetFocusedOptionIndex();
    } else if (options.length) {
      const valueWithoutClosedBracket = valueToInsert.endsWith(')') ? valueToInsert.slice(0, -1) : valueToInsert;
      if (isValueFromOptions(valueWithoutClosedBracket)) {
        setEnteredTerm(valueToInsert);
      } else {
        onChange(prevValue);
      }
    } else {
      if (valueToInsert.startsWith('(')) {
        setIsOpenBracketAfterEquality(true);
      } else if (valueToInsert.endsWith(')')) {
        setIsOpenBracketAfterEquality(false);
      }
      setEnteredTerm(valueToInsert);
    }
  };

  const setEnteredBooleanOperator = (valueToInsert) => {
    onChange(`${prevValue}${valueToInsert} `);
    setPrevValue(prevVal => `${prevVal}${valueToInsert} `);
  };

  const processEnteredBooleanOperator = (valueToInsert, isOptionSelected) => {
    if (isOptionSelected) {
      setEnteredBooleanOperator(valueToInsert);
      resetFocusedOptionIndex();
      resetStructure();
    } else if (isValueFromOptions(valueToInsert)) {
      setEnteredBooleanOperator(valueToInsert);
      if (isOpenBracketAfterEquality) {
        setTerm('');
      } else {
        resetStructure();
      }
    } else {
      onChange(prevValue);
    }
  };

  const handleValueToInsert = (valueToInsert, isOptionSelected) => {
    const properties = [valueToInsert, isOptionSelected];

    if (!searchOption) {
      const isValueForKeywordSearch = !prevValue && !isValueFromOptions(valueToInsert);
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
    const typedVal = val.slice(prevValue.length);
    setTypedValue(typedVal);
    resetFocusedOptionIndex();
    onChange(val);

    if (!searchOption) {
      onSetIsSearchByKeyword(true);
    } else {
      onSetIsSearchByKeyword(false);
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
        const selectedValue = selectedOption?.label || selectedOption;
        const valueToInsert = isOptionSelected ? selectedValue : typedValue;

        handleValueToInsert(valueToInsert, isOptionSelected);

        if (!valueToInsert && searchButtonRef.current) {
          searchButtonRef.current.click();
          closeOptions();
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

  const processOptions = () => {
    let suggestions;

    if (!searchOption) {
      suggestions = searchOptions;
    } else if (!operator) {
      suggestions = operators;
    } else if (!term) {
      suggestions = terms;
    } else {
      suggestions = booleanOperators;
    }

    if (typedValue && isTypedValueNotBracket) {
      const filteredOptions = suggestions.filter(suggestion => {
        const valueToOpt = suggestion.label || suggestion;
        return valueToOpt.toLowerCase().includes(typedValueWithoutOpenBracket.toLowerCase());
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
              onMouseDown={event => { event.preventDefault(); }}
            >
              {options.map((option, index) => {
                const valueToOpt = option.label || option;
                const searchWords = isTypedValueNotBracket && typedValueWithoutOpenBracket
                  ? [typedValueWithoutOpenBracket]
                  : [];
                const isFocused = focusedOptionIndex === index;

                return (
                  <li
                    role="option"
                    id={`list-item-${index}`}
                    aria-selected={isFocused}
                    key={valueToOpt}
                    ref={(element) => handleOptionRef(element, isFocused)}
                    className={classNames(css.option, isFocused && css.optionCursor)}
                    onClick={() => handleValueToInsert(valueToOpt)}
                    onKeyDown={noop}
                  >
                    <Highlighter
                      searchWords={searchWords}
                      text={valueToOpt}
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
      />
      <p
        role="alert"
        id="info"
        className={css.info}
      >
        When autocomplete results are available use up and down arrows to review and enter to select.
      </p>
      {isOpen && renderOptions()}
    </div>
  );
};

ElasticQueryField.propTypes = propTypes;

export default ElasticQueryField;
