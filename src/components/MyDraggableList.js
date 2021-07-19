import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Container, Draggable } from 'react-smooth-dnd';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper'
import ClearIcon from '@material-ui/icons/Clear';

const useStyles = makeStyles(() => ({
    button: {
        marginLeft: "5px"
    },

}));

const objectsStyle = {
    marginTop: "5px",
    padding: "0.7rem 0.5rem",
    backgroundColor: "darkgrey",
    borderRadius: "5px",
    textAlign: "center",
};

const srvStyle = {
    marginTop: "5px",
    padding: "0.7rem 0.5rem",
    backgroundColor: "#009999",
    borderRadius: "5px",
    textAlign: "center",
};

const MyDraggableList = (props) => {

    const classes = useStyles();

    const {
        items,
        setItems,
        groupName,
        behaviour
        
    } = props

    const style = () => {
        let result
        if (groupName.indexOf(1)) result = srvStyle 
        else result = objectsStyle
        
        return result
    }

    const isBehaviourMove = () => {
        return behaviour === 'move' ? true : false
    }

    const applyDrag = (arr, dragResult, removeDuplicates) => {
        const { removedIndex, addedIndex, payload } = dragResult;
        if (removedIndex === null && addedIndex === null) return arr;
    
        const result = [...arr];
        let itemToAdd = payload;
        
        if (removedIndex !== null) {
          itemToAdd = result.splice(removedIndex, 1)[0];
        }
    
        if (addedIndex !== null) {
          result.splice(addedIndex, 0, itemToAdd);
        }
        
        if(removeDuplicates) {
          const set = new Set(result.map(item => JSON.stringify(item)));
          const noDup = [...set].map(item => JSON.parse(item));
    
          return noDup
        }
        else return result;
    
      };

    return (
        <Container
            groupName={groupName}
            behaviour={behaviour}
            getChildPayload={(i) => items[i]}
            onDrop={(e) => setItems(applyDrag(items, e, true))}
            >
            {items.map((p, i) => {
                return (
                <Draggable key={i}>
                    <Paper elevation={5}>
                        <div className="draggable-item" style={style()}>
                            {p.data}
                            {isBehaviourMove() ?
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
                </Draggable>
                );
            })}
        </Container>
    )

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