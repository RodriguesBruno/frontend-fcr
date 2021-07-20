import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { Color } from '@material-ui/lab';

interface Props {
  open: boolean;
  message: string;
  severity: Color;
  onClose: () => void;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const MySnackbar = ({ open, onClose, severity, message }: Props) =>
  <div className={useStyles().root}>
    <Snackbar open={open} autoHideDuration={6000} onClose={onClose}>
      <MuiAlert elevation={6} variant="filled" onClose={onClose} severity={severity}>
        {message}
      </MuiAlert>
    </Snackbar>
  </div>;

export default MySnackbar;
