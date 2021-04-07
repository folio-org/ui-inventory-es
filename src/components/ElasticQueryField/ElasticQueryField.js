import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import classNames from 'classnames';

import TextArea from '@folio/stripes-components/lib/TextArea';
import { Highlighter } from '@folio/stripes-components';

import getElasticQuery from './getElasticQuery';
import {
  addQuotes, changeTextAreaHeight,
  getNotEditableSearchOptionLeftSide,
  getNotEditableSearchOptionRightSide,
  getNotEditableValueAfter,
  getNotEditableValueBefore,
  getSearchOption, getSearchWords,
  getValueToHighlight,
  isSomeOptionIncludesValue,
  isValueFromOptions,
  moveScrollToDown,
  moveScrollToTop,
  setCaretPosition,
} from './utils';
import {
  ANY_VALUE,
  CHARS,
  CLOSE_BRACKET,
  CONTROL,
  EMPTY_TERM,
  OPEN_BRACKET,
  SPACE,
  UNSELECTED_OPTION_INDEX,
} from './constants';
import css from './ElasticQueryField.css';

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
};

const ElasticQueryField = props => {
  const {
    booleanOperators,
    value,
    onChange,
    operators,
    setIsSearchByKeyword,
    searchButtonRef,
    searchOptions,
    terms,
  } = props;

  const intl = useIntl();
  const [searchOption, setSearchOption] = useState('');
  const [operator, setOperator] = useState('');
  const [term, setTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [focusedOptionIndex, setFocusedOptionIndex] = useState(UNSELECTED_OPTION_INDEX);
  const [typedValue, setTypedValue] = useState('');
  const [typedValueForEditMode, setTypedValue2] = useState('');
  const [prevTypedValue, setPrevTypedValue] = useState('');
  const [prevValue, setPrevValue] = useState('');
  const [isOpenBracketAfterEquality, setIsOpenBracketAfterEquality] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState('');
  const [isWarning, setIsWarning] = useState(false);
  const [warning, setWarning] = useState('');
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [isEditingModeBefore, setIsEditingModeBefore] = useState(false);
  const [isSearchOptionToEdit, setIsSearchOptionToEdit] = useState(false);
  const [notEditableValueBefore, setNotEditableValueBefore] = useState('');
  const [notEditableValueAfter, setNotEditableValueAfter] = useState('');
  const [selectionStart, setSelectionStart] = useState();
  const [selectionEnd, setSelectionEnd] = useState();
  const [isEditedValueConfirmed, setIsEditedValueConfirmed] = useState(false);

  const textareaRef = useRef();
  const optionsContainerRef = useRef();
  const optionRef = useRef();
  const valueBeforeEditing = useRef('');
  const actualValue = useRef('');

  const isTypedValueNotBracket = typedValue !== OPEN_BRACKET && typedValue !== CLOSE_BRACKET;

  const typedValueWithoutOpenBracket = isEditingMode && isSearchOptionToEdit
    ? getSearchOption(value, notEditableValueBefore, notEditableValueAfter)
    : typedValue.startsWith(OPEN_BRACKET)
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

  const openOptions = () => {
    setIsOpen(true);
  };

  const closeOptions = () => {
    setIsOpen(false);
  };

  const processSend = () => {
    try {
      getElasticQuery(value, false, searchOptions, operators, intl);
      setWarning('');
      searchButtonRef.current.click();
      closeOptions();
    } catch (event) {
      setIsWarning(true);
      setWarning(event.message);
    }
  };

  const processSendForEditingMode = () => {
    processSend();
    valueBeforeEditing.current = value;
    setIsEditedValueConfirmed(false);
    setIsEditingMode(false);
    setIsEditingModeBefore(true);
    setNotEditableValueBefore('');
    setNotEditableValueAfter('');
  };

  const setEnteredSearchOption = (valueToInsert, isEnterClick) => {
    const desiredValueView = addQuotes(valueToInsert, booleanOperators);
    const char = isEnterClick ? SPACE : '';
    let inputValue;

    if (isEditingMode && isSearchOptionToEdit) {
      inputValue = `${notEditableValueBefore}${desiredValueView}${notEditableValueAfter}`;
      setPrevValue(inputValue);
      setIsSearchOptionToEdit(false);
      setIsEditingMode(false);
      setIsOpen(false);
      setCaretPosition(textareaRef, value.length);
    } else {
      inputValue = `${prevValue}${desiredValueView}${char}`;
      // prevValue - previously confirmed value
      setPrevValue(prevVal => `${prevVal}${desiredValueView}${SPACE}`);
    }

    onChange(inputValue);
    actualValue.current = inputValue;
    setSearchOption(valueToInsert);
    setTypedValue('');
    setTypedValue2(prevTypValue => {
      setPrevTypedValue(prevTypValue);
      return '';
    });
    setIsWarning(false);
  };

  const processEnteredSearchOption = (valueToInsert, isOptionSelected, isEnterClick) => {
    const isValueForKeywordSearch = !prevValue && !isValueFromOptions(valueToInsert, options);

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

      if (isValueFromOptions(valueWithoutOpenBracket, options)) {
        setEnteredSearchOption(valueToInsert, isEnterClick);
      } else if (
        !isEnterClick &&
        prevValue &&
        !isSomeOptionIncludesValue(`${valueWithoutOpenBracket} `, options)
      ) {
        setIsWarning(true);
      } else if (isEnterClick) {
        setIsWarning(true);
      }
    }
  };

  const setEnteredOperator = (valueToInsert, isEnterClick) => {
    const char = isEnterClick ? SPACE : '';
    const inputValue = `${prevValue}${valueToInsert}${char}`;
    onChange(inputValue);
    actualValue.current = inputValue;
    setOperator(valueToInsert);
    setPrevValue(prevVal => `${prevVal}${valueToInsert}${SPACE}`);
    setTypedValue('');
    setTypedValue2(prevTypValue => {
      setPrevTypedValue(prevTypValue);
      return '';
    });
    setIsWarning(false);
  };

  const processEnteredOperator = (valueToInsert, isOptionSelected, isEnterClick) => {
    if (isOptionSelected) {
      setEnteredOperator(valueToInsert, isEnterClick);
      resetFocusedOptionIndex();
    } else if (isValueFromOptions(valueToInsert, options)) {
      setEnteredOperator(valueToInsert, isEnterClick);
    } else if (!isSomeOptionIncludesValue(valueToInsert, options)) {
      setIsWarning(true);
    }
  };

  const setEnteredTerm = (valueToInsert) => {
    const desiredValueView = addQuotes(valueToInsert, booleanOperators);
    setTerm(valueToInsert || EMPTY_TERM);

    if (isEditingMode) {
      const char = notEditableValueAfter.startsWith(SPACE) || !desiredValueView ? '' : SPACE;
      const editableValue = `${notEditableValueBefore}${desiredValueView}${char}${notEditableValueAfter}`;
      const isQuotesNotAddedToValue = value === editableValue;
      onChange(editableValue);
      actualValue.current = editableValue;
      setPrevValue(editableValue);
      setCaretPosition(textareaRef, value.length);

      if (isQuotesNotAddedToValue) {
        processSendForEditingMode();
      } // otherwise we process it in the useEffect with a value dependency
    } else {
      const inputValue = `${prevValue}${desiredValueView}${SPACE}`;
      onChange(inputValue);
      actualValue.current = inputValue;
      setPrevValue(prevVal => `${prevVal}${desiredValueView}${SPACE}`);
      setIsEditingModeBefore(false);
    }
    setTypedValue('');
    setTypedValue2(prevTypValue => {
      setPrevTypedValue(prevTypValue);
      return '';
    });
  };

  const processEnteredTerm = (valueToInsert, isOptionSelected, isEnterClick) => {
    if (isOptionSelected) {
      setEnteredTerm(valueToInsert);
      resetFocusedOptionIndex();
    } else if (options.length && !isEditingMode) {
      const valueWithoutClosedBracket = valueToInsert.endsWith(CLOSE_BRACKET)
        ? valueToInsert.slice(0, -1)
        : valueToInsert;
      if (isValueFromOptions(valueWithoutClosedBracket, options)) {
        setEnteredTerm(valueToInsert);
      } else if (!isSomeOptionIncludesValue(valueWithoutClosedBracket, options)) {
        setIsWarning(true);
      }
    } else if (isEnterClick) {
      if (
        (valueToInsert.startsWith(OPEN_BRACKET) && valueToInsert.endsWith(CLOSE_BRACKET)) ||
        valueToInsert.endsWith(CLOSE_BRACKET)
      ) {
        setIsOpenBracketAfterEquality(false);
      } else if (valueToInsert.startsWith(OPEN_BRACKET) && !isEditingMode) {
        setIsOpenBracketAfterEquality(true);
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
    if (!valueToInsert) return;
    const char = isEnterClick ? SPACE : '';
    const inputValue = `${prevValue}${valueToInsert}${char}`;
    onChange(inputValue);
    actualValue.current = inputValue;
    setPrevValue(prevVal => `${prevVal}${valueToInsert}${SPACE}`);
    setTypedValue('');
    setTypedValue2(prevTypValue => {
      setPrevTypedValue(prevTypValue);
      return '';
    });
    setIsWarning(false);
  };

  const processEnteredBooleanOperator = (valueToInsert, isOptionSelected, isEnterClick) => {
    if (isOptionSelected) {
      setEnteredBooleanOperator(valueToInsert, isEnterClick);
      resetFocusedOptionIndex();
      processStructure();
    } else if (isValueFromOptions(valueToInsert, options)) {
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
    if (!isEditingMode) {
      const typedVal = val.slice(prevValue.length);
      setTypedValue(typedVal);
    }
    resetFocusedOptionIndex();
    onChange(val);
    actualValue.current = val;
    setIsEditingModeBefore(false);

    if (!searchOption && !operator && !term) {
      setIsSearchByKeyword(true);
    } else {
      setIsSearchByKeyword(false);
    }
  };

  const processTypedValueForEditingMode = (event) => {
    const keyCode = event.keyCode;
    let typedChar = '';

    if (keyCode === 90 && typedValueForEditMode.slice(0, 7) === CONTROL) { // Control + z
      setTypedValue2('');
      return;
    }

    if (
      (keyCode >= 48 && keyCode <= 57) || // 0-9
      (keyCode >= 65 && keyCode <= 90) || // a-z
      keyCode === 32 || // space
      CHARS.has(keyCode) // `-=\[];',.//*-+Control
    ) {
      if (CHARS.has(keyCode)) {
        typedChar = event.key;
      } else {
        typedChar = String.fromCharCode(keyCode);
      }
      setTypedValue2(prevTypValue => {
        setPrevTypedValue(prevTypValue);
        return `${prevTypValue}${typedChar}`;
      });
    } else if (keyCode === 8 || keyCode === 46) { // backSpace/delete
      const amountSelectedChars = selectionEnd - selectionStart;
      if (amountSelectedChars > 1) {
        setTypedValue2(prevTypValue => {
          setPrevTypedValue(prevTypValue);
          return prevTypValue.slice(0, -amountSelectedChars);
        });
      } else {
        setTypedValue2(prevTypValue => {
          setPrevTypedValue(prevTypValue);
          return prevTypValue.slice(0, -1);
        });
      }
    }
  };

  const handleKeyDown = (event) => {
    const lastOptionIndex = options.length - 1;
    processTypedValueForEditingMode(event);
    if (!isEditingMode) {
      valueBeforeEditing.current = value;
    }

    switch (event.keyCode) {
      case 32: // space
        if (isEditingMode) return;
        handleValueToInsert(typedValue);
        break;
      case 13: { // enter
        event.preventDefault();

        if (isEditingMode && !isSearchOptionToEdit) {
          setIsEditedValueConfirmed(true);
          const valueToInsert = value.replace(notEditableValueBefore, '').replace(notEditableValueAfter, '').trim();
          processEnteredTerm(valueToInsert, false, true);
          setTypedValue('');
          return;
        }
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
          const searchOptionToPaste = value.replace(notEditableValueBefore, '').replace(notEditableValueAfter, '');
          const val = isSearchOptionToEdit && !isOptionSelected ? searchOptionToPaste : valueToInsert.trim();
          handleValueToInsert(val, isOptionSelected, isEnterClick);
        }
        break;
      }
      case 40: // arrowDown
        if (options.length) {
          const isLastOption = focusedOptionIndex === lastOptionIndex;
          if (isLastOption) {
            moveScrollToDown(optionsContainerRef, optionRef, isLastOption);
            setFocusedOptionIndex(0);
          } else {
            moveScrollToDown(optionsContainerRef, optionRef);
            setFocusedOptionIndex(prevOptionIndex => prevOptionIndex + 1);
          }
        }
        break;
      case 38: // arrowUp
        if (options.length) {
          const isFirstOption = !focusedOptionIndex;
          if (isFirstOption) {
            moveScrollToTop(optionsContainerRef, optionRef, isFirstOption);
            setFocusedOptionIndex(lastOptionIndex);
          } else {
            moveScrollToTop(optionsContainerRef, optionRef);
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
          .includes(getValueToHighlight(operators, booleanOperators, typedValueWithoutOpenBracket).toLowerCase());
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

  const handleOptionMouseDown = (event) => {
    event.preventDefault();
  };

  const setNotEditableParts = (selectionStartNumber, curValue) => {
    const notEditableSearchOptionLeftSide = getNotEditableSearchOptionLeftSide(selectionStartNumber, curValue, booleanOperators);
    const notEditableSearchOptionRightSide = getNotEditableSearchOptionRightSide(selectionStartNumber, curValue, operators);
    const inferredSearchOption = getSearchOption(prevValue, notEditableSearchOptionLeftSide, notEditableSearchOptionRightSide);
    const isSearchOption = searchOptions.some(option => option.label.toLowerCase() === inferredSearchOption.toLowerCase());

    if (isSearchOption) {
      setSearchOption('');
      setIsOpen(true);
      setIsSearchOptionToEdit(true);
      setNotEditableValueBefore(notEditableSearchOptionLeftSide);
      setNotEditableValueAfter(notEditableSearchOptionRightSide);
      return;
    }

    const notEditableValBefore = getNotEditableValueBefore(selectionStartNumber, curValue, operators, booleanOperators, typedValueForEditMode);
    const notEditableValAfter = getNotEditableValueAfter(selectionStartNumber, curValue, booleanOperators);
    setNotEditableValueBefore(notEditableValBefore);
    setNotEditableValueAfter(notEditableValAfter);
  };

  const handleEditingMode = (event) => {
    if (event.keyCode === 13) return;
    const selectionStartNumber = event.target.selectionStart;
    const selectionEndNumber = event.target.selectionEnd;
    const curValue = actualValue.current;
    const isValueBeforeEditingNotEqualCurrent = valueBeforeEditing.current.toLowerCase() !== curValue.toLowerCase();

    setSelectionStart(selectionStartNumber);
    setSelectionEnd(selectionEndNumber);

    if (isEditingMode && isValueBeforeEditingNotEqualCurrent) {
      if (!isSearchOptionToEdit) {
        setNotEditableParts(selectionStartNumber, curValue);
      }
      return;
    }

    if (
      warning ||
      (isValueBeforeEditingNotEqualCurrent && (event.keyCode === 8 || event.keyCode === 46) && !prevTypedValue) ||
      (selectionStartNumber !== curValue.length && isValueBeforeEditingNotEqualCurrent && selectionStartNumber < prevValue.length)
    ) {
      setIsEditingMode(true);
      setNotEditableParts(selectionStartNumber, curValue);
    } else {
      setIsEditingMode(false);
    }
  };

  const handleMouseUp = (event) => {
    handleEditingMode(event);
  };

  const handleKeyUp = (event) => {
    handleEditingMode(event);
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
              onMouseDown={handleOptionMouseDown}
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
                      searchWords={getSearchWords(
                        isTypedValueNotBracket,
                        typedValue,
                        typedValueWithoutOpenBracket,
                        operators,
                        booleanOperators,
                      )}
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
    if (searchOption === ANY_VALUE) {
      processOptions();
    }
    // eslint-disable-next-line
  }, [searchOption]);

  useEffect(() => {
    if (
      (!typedValueWithoutOpenBracket && !warning)
      || (isWarning && !warning && !typedValueWithoutOpenBracket.endsWith(SPACE))
    ) {
      setIsWarning(false);
    }
    // eslint-disable-next-line
  }, [typedValueWithoutOpenBracket]);

  useEffect(() => {
    changeTextAreaHeight(textareaRef);

    if (value) {
      if (isEditingMode) {
        if (isSearchOptionToEdit) {
          processOptions();
        } else {
          closeOptions();
        }
        setIsWarning(false);
        if (isEditedValueConfirmed) {
          processSendForEditingMode();
        }
      } else {
        const isCtrlZClickedOnSearchOption = !isEditingMode && !searchOption && operator;
        if (isCtrlZClickedOnSearchOption) {
          setSearchOption(ANY_VALUE);
          setCaretPosition(textareaRef, value.length);
        }
        setIsSearchOptionToEdit(false);
        processOptions();
        if (!isEditingModeBefore) {
          openOptions();
        }
      }
    } else {
      setPrevValue('');
      closeOptions();
      resetFocusedOptionIndex();
      resetStructure();
      setIsWarning(false);
      setWarning('');
      setIsEditingMode(false);
      setNotEditableValueBefore('');
      setNotEditableValueAfter('');
      setIsSearchOptionToEdit(false);
      valueBeforeEditing.current = '';
    }
    // eslint-disable-next-line
  }, [value, isEditingMode]);

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
        inputRef={ref => { textareaRef.current = ref; }}
        marginBottom0
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onMouseUp={handleMouseUp}
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
ElasticQueryField.defaultProps = {
  searchButtonRef: {},
  terms: [],
};

export default ElasticQueryField;
