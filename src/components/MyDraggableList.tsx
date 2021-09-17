import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Container, Draggable, DropResult } from 'react-smooth-dnd';
// import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper'
import ClearIcon from '@material-ui/icons/Clear';
import { SetState } from './MyDialog';
import { Data } from '../App';

interface Props {
  items: Data[];
  setItems: SetState<Data[]>;
  groupName: string;
  behaviour: 'move' | 'copy' | 'drop-zone' | 'contain';
  showRenders: boolean;
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

const applyDrag = (arr: Data[], { removedIndex, addedIndex, payload }: DropResult) => {
  // const removeDuplicates = true
  if (removedIndex === null && addedIndex === null) return arr;

  const result = [...arr];
  let itemToAdd: Data | undefined = payload;

  if (removedIndex !== null) {
    [itemToAdd] = result.splice(removedIndex, 1);
  }

  if (addedIndex !== null && itemToAdd) {
    result.splice(addedIndex, 0, itemToAdd);
  }
  
  const set = new Set(result.map(item => JSON.stringify(item)));
  const noDup = [...set].map(item => JSON.parse(item));

  // console.log('NoDup:', noDup)
  return noDup
  
  
  // console.log('Result', result)
  // return result;
};

const MyDraggableList = ({ items, setItems, groupName, behaviour }: Props) => {
  const classes = useStyles();

  return <Container
    groupName={groupName}
    behaviour={behaviour}
    getChildPayload={(i) => items[i]}
    onDrop={(e) => setItems(applyDrag(items, e))}
  >
    {items.map((p, i) => {
      return <Draggable key={i}>
        <Paper elevation={5}>
          <div className="draggable-item" style={groupName.startsWith('1') ? objectsStyle : srvStyle}>
            {p.data}
            {behaviour === 'move' ?
              // <Tooltip title={'Remove'} placement="right">
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

              // </Tooltip>
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
