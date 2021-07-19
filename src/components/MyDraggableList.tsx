import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Container, Draggable, DropResult } from 'react-smooth-dnd';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper'
import ClearIcon from '@material-ui/icons/Clear';
import { SetState } from './MyDialog';
import { Data } from '../App';

interface Props<T> {
  items: T[];
  setItems: SetState<T[]>;
  groupName: string;
  behaviour: 'move' | 'copy' | 'drop-zone' | 'contain';
}

const useStyles = makeStyles(() => ({
  button: {
    marginLeft: "5px"
  },

}));

const objectsStyle: React.CSSProperties = {
  marginTop: "5px",
  padding: "0.7rem 0.5rem",
  backgroundColor: "darkgrey",
  borderRadius: "5px",
  textAlign: "center",
};

const srvStyle: React.CSSProperties = {
  marginTop: "5px",
  padding: "0.7rem 0.5rem",
  backgroundColor: "#009999",
  borderRadius: "5px",
  textAlign: "center",
};

const MyDraggableList = <T extends Data>({ items, setItems, groupName, behaviour }: Props<T>) => {
  const classes = useStyles();

  const isBehaviourMove = behaviour === 'move';

  const applyDrag = (arr: T[], { removedIndex, addedIndex, payload }: DropResult) => {
    if (removedIndex === null && addedIndex === null) return arr;

    const result = [...arr];
    let itemToAdd: T | undefined = payload;

    if (removedIndex !== null) {
      [itemToAdd] = result.splice(removedIndex, 1);
    }

    if (addedIndex !== null && itemToAdd) {
      result.splice(addedIndex, 0, itemToAdd);
    }

    return result;
  };

  return <Container
    groupName={groupName}
    behaviour={behaviour}
    getChildPayload={(i) => items[i]}
    onDrop={(e) => setItems(applyDrag(items, e))}
  >
    {items.map((p, i) => {
      return <Draggable key={i}>
        <Paper elevation={5}>
          <div className="draggable-item" style={groupName.startsWith('1') ? srvStyle : objectsStyle}>
            {p.data}
            {isBehaviourMove ?
              <Tooltip title={'Remove'} placement="right">
                <IconButton
                  aria-label="delete"
                  className={classes.button}
                  size="small"
                  onClick={() => {
                    const newState = [...items];
                    newState.splice(i, 1);
                    setItems(newState);
                  }}
                >
                  <ClearIcon fontSize="inherit" />
                </IconButton>

              </Tooltip>
              : null}
          </div>
        </Paper>
      </Draggable>;
    })}
  </Container>
}

export default MyDraggableList;

MyDraggableList.propTypes = {
  items: PropTypes.array.isRequired,
  setItems: PropTypes.func.isRequired,
  groupName: PropTypes.string.isRequired,
  behaviour: PropTypes.string

};

MyDraggableList.defaultProps = {
  behaviour: 'move'
}
