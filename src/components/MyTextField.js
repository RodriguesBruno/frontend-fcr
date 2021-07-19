import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';


const MyTextField = (props) => {

    const {
        id,
        label,
        value,
        onChange,
        helperText,
        items
    } = props

    return (
        <TextField
            id={id}
            select
            label={label}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            helperText={helperText}
            required={true}
        >
            
            {items.map((option) => (
            <MenuItem key={option.value} value={option.value}>
                {option.label}
            </MenuItem>
            ))}
        </TextField>
    )
}

export default MyTextField;

MyTextField.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    helperText: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
};