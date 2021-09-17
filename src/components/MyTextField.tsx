import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

export interface Item {
  value: string;
  label: string;
}

interface Props {
  id: string;
  label: string;
  value: string;
  onChange: (val: string) => void;
  helperText: string;
  items: Item[];
}

const MyTextField = ({ id, label, value, onChange, helperText, items }: Props) => {

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
