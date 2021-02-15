import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import css from './ListItem.css';

const propTypes = {
  isArrowUp: PropTypes.bool,
  isSelected: PropTypes.bool,
  value: PropTypes.string,
};

const ListItem = ({ value, isSelected, isArrowUp }) => {
  const optionRef = useRef(null);

  if (isSelected && optionRef.current) {
    optionRef.current.scrollIntoView(isArrowUp);
    optionRef.current.focus();
  }

  return (
    <li
      ref={optionRef}
      className={classNames(css.option, isSelected && css.optionCursor)}
    >
      {value}
    </li>
  );
};

ListItem.propTypes = propTypes;

export default ListItem;
