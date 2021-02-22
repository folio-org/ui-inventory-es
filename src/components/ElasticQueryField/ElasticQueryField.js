import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import classNames from 'classnames';
import TextArea from '@folio/stripes-components/lib/TextArea';
import { Highlighter } from '@folio/stripes-components';
import css from './ElasticQueryField.css';

const UNSELECTED_OPTION_INDEX = -1;
const SPACE = ' ';
const OPEN_BRACKET = '(';
const CLOSE_BRACKET = ')';

const propTypes = {
  booleanOperators: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
  })).isRequired,
  onChange: PropTypes.func.isRequired,
  operators: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    queryTemplate: PropTypes.string.isRequired,
  })).isRequired,
  searchButtonRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  searchOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string,
  })).isRequired,
  setIsSearchByKeyword: PropTypes.func.isRequired,
  terms: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })),
  value: PropTypes.string.isRequired,
  warning: PropTypes.string,
};

const ElasticQueryField = props => {
  const {
    booleanOperators,
    value,
    onChange,
    operators,
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
  const typedValueWithoutOpenBracket = typedValue.startsWith(OPEN_BRACKET)
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
      return option.label.toLowerCase() === val.trim().toLowerCase();
    });
  };

  const isSomeOptionIncludesValue = (val) => {
    return options.some(option => {
      return option.label.toLowerCase()
        .includes(val.toLowerCase());
    });
  };

  const openOptions = () => {
    setIsOpen(true);
  };

  const closeOptions = () => {
    setIsOpen(false);
  };

  const processSend = () => {
    searchButtonRef.current.click();
    closeOptions();
  };

  const setEnteredSearchOption = (valueToInsert, isEnterClick) => {
    const desiredValueView = addQuotes(valueToInsert);
    const char = isEnterClick ? SPACE : '';
    onChange(`${prevValue}${desiredValueView}${char}`);
    setSearchOption(valueToInsert);
    setPrevValue(prevVal => `${prevVal}${desiredValueView}${SPACE}`);
    setTypedValue('');
    setIsWarning(false);
  };

  const processEnteredSearchOption = (valueToInsert, isOptionSelected, isEnterClick) => {
    const isValueForKeywordSearch = !prevValue && !isValueFromOptions(valueToInsert);

    if (isValueForKeywordSearch && isEnterClick) {
      processSend();
    } else if (isOptionSelected) {
      const searchOptionValue = typedValue.startsWith(OPEN_BRACKET)
        ? `${OPEN_BRACKET}${valueToInsert}`
        : valueToInsert;

      setEnteredSearchOption(searchOptionValue, isEnterClick);
      resetFocusedOptionIndex();
    } else {
      const valueWithoutOpenBracket = valueToInsert.startsWith(OPEN_BRACKET)
        ? valueToInsert.slice(1)
        : valueToInsert;

      if (isValueFromOptions(valueWithoutOpenBracket)) {
        setEnteredSearchOption(valueToInsert, isEnterClick);
      } else if (!isEnterClick && prevValue && !isSomeOptionIncludesValue(`${valueWithoutOpenBracket} `)) {
        setIsWarning(true);
      } else if (isEnterClick) {
        setIsWarning(true);
      }
    }
  };

  const setEnteredOperator = (valueToInsert, isEnterClick) => {
    const char = isEnterClick ? SPACE : '';
    onChange(`${prevValue}${valueToInsert}${char}`);
    setOperator(valueToInsert);
    setPrevValue(prevVal => `${prevVal}${valueToInsert}${SPACE}`);
    setTypedValue('');
    setIsWarning(false);
  };

  const processEnteredOperator = (valueToInsert, isOptionSelected, isEnterClick) => {
    if (isOptionSelected) {
      setEnteredOperator(valueToInsert, isEnterClick);
      resetFocusedOptionIndex();
    } else if (isValueFromOptions(valueToInsert)) {
      setEnteredOperator(valueToInsert, isEnterClick);
    } else if (!isSomeOptionIncludesValue(valueToInsert)) {
      setIsWarning(true);
    }
  };

  const setEnteredTerm = (valueToInsert) => {
    const desiredValueView = addQuotes(valueToInsert);
    onChange(`${prevValue}${desiredValueView}${SPACE}`);
    setTerm(valueToInsert);
    setPrevValue(prevVal => `${prevVal}${desiredValueView}${SPACE}`);
    setTypedValue('');
    setIsWarning(false);
  };

  const processEnteredTerm = (valueToInsert, isOptionSelected, isEnterClick) => {
    if (isOptionSelected) {
      setEnteredTerm(valueToInsert);
      resetFocusedOptionIndex();
    } else if (options.length) {
      const valueWithoutClosedBracket = valueToInsert.endsWith(CLOSE_BRACKET)
        ? valueToInsert.slice(0, -1)
        : valueToInsert;
      if (isValueFromOptions(valueWithoutClosedBracket)) {
        setEnteredTerm(valueToInsert);
      } else if (!isSomeOptionIncludesValue(valueWithoutClosedBracket)) {
        setIsWarning(true);
      }
    } else if (isEnterClick) {
      if (valueToInsert.startsWith(OPEN_BRACKET)) {
        setIsOpenBracketAfterEquality(true);
      } else if (valueToInsert.endsWith(CLOSE_BRACKET)) {
        setIsOpenBracketAfterEquality(false);
      }
      setEnteredTerm(valueToInsert);
    }
  };

  const processStructure = () => {
    if (isOpenBracketAfterEquality) {
      setTerm('');
    } else {
      resetStructure();
    }
  };

  const setEnteredBooleanOperator = (valueToInsert, isEnterClick) => {
    const char = isEnterClick ? SPACE : '';
    onChange(`${prevValue}${valueToInsert}${char}`);
    setPrevValue(prevVal => `${prevVal}${valueToInsert}${SPACE}`);
    setTypedValue('');
    setIsWarning(false);
  };

  const processEnteredBooleanOperator = (valueToInsert, isOptionSelected, isEnterClick) => {
    if (isOptionSelected) {
      setEnteredBooleanOperator(valueToInsert, isEnterClick);
      resetFocusedOptionIndex();
      processStructure();
    } else if (isValueFromOptions(valueToInsert)) {
      setEnteredBooleanOperator(valueToInsert, isEnterClick);
      processStructure();
    } else {
      setIsWarning(true);
    }
  };

  const handleValueToInsert = (valueToInsert, isOptionSelected, isEnterClick) => {
    const args = [valueToInsert, isOptionSelected, isEnterClick];

    if (!searchOption) {
      processEnteredSearchOption(...args);
    } else if (!operator) {
      processEnteredOperator(...args);
    } else if (!term) {
      processEnteredTerm(...args);
    } else {
      processEnteredBooleanOperator(...args);
    }
  };

  const handleChange = event => {
    const val = event.target.value;
    const typedVal = val.slice(prevValue.length);
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

  const handleKeyDown = (event) => {
    const lastOptionIndex = options.length - 1;

    switch (event.keyCode) {
      case 32: // space
        handleValueToInsert(typedValue);
        break;
      case 13: { // enter
        event.preventDefault();
        const isOptionSelected = focusedOptionIndex !== UNSELECTED_OPTION_INDEX;
        const selectedOption = options[focusedOptionIndex];
        const valueToInsert = isOptionSelected
          ? selectedOption.label
          : typedValue;
        const isStructureFull = searchOption && operator && term;
        const canSend = !valueToInsert && isStructureFull && searchButtonRef.current;
        const isEnterClick = true;

        if (canSend) {
          processSend();
        } else {
          handleValueToInsert(valueToInsert.trim(), isOptionSelected, isEnterClick);
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

  const getValueToHighlight = () => {
    const isOperator = operators.some(oper => oper.label === typedValueWithoutOpenBracket.trim());
    const isBoolOperator = booleanOperators.some(boolOper => boolOper.label === typedValueWithoutOpenBracket.trim());
    return isOperator || isBoolOperator
      ? typedValueWithoutOpenBracket.trim()
      : typedValueWithoutOpenBracket;
  };

  const processOptions = () => {
    let suggestions = [];

    if (!searchOption) {
      const isValueForKeywordSearch = !prevValue
        && !searchOptions.some(option => {
          return option.label.toLowerCase()
            .includes(typedValueWithoutOpenBracket.toLowerCase().trim());
        });

      if (!isValueForKeywordSearch && isTypedValueNotBracket) {
        suggestions = searchOptions;
      }
    } else if (!operator) {
      suggestions = operators;
    } else if (!term) {
      suggestions = terms;
    } else {
      suggestions = booleanOperators;
    }

    if (typedValue !== SPACE && isTypedValueNotBracket) {
      const filteredOptions = suggestions.filter(suggestion => {
        return suggestion.label.toLowerCase()
          .includes(getValueToHighlight().toLowerCase());
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

  const getSearchWords = () => {
    const isValidSearchWords =
      isTypedValueNotBracket
      && typedValue !== SPACE
      && typedValueWithoutOpenBracket;
    return isValidSearchWords
      ? [getValueToHighlight()]
      : [];
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
                      searchWords={getSearchWords()}
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
    if (
      !typedValueWithoutOpenBracket
      || (isWarning && !typedValueWithoutOpenBracket.endsWith(SPACE))
    ) {
      setIsWarning(false);
    }
  }, [typedValueWithoutOpenBracket]);

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
      setIsWarning('');
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
