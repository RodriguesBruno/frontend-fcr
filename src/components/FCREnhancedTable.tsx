import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
// import DoneIcon from '@material-ui/icons/Done';
// import ClearIcon from '@material-ui/icons/Clear';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import EditIcon from '@material-ui/icons/Edit';
import DivRenders from '../hoc/DivRenders'
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { FCR } from '../App';
import { SetState } from './MyDialog';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';

interface HeadProps {
  classes: ClassNameMap<'visuallyHidden'>
  order: 'asc' | 'desc';
  orderBy: keyof FCR;
  numSelected: number;
  rowCount: number;
  onRequestSort: (_: unknown, propName: keyof FCR) => void;
  onSelectAllClick: (evt: React.ChangeEvent<HTMLInputElement>) => void;
}

interface ToolbarProps {
  numSelected: number;
  clickAddNewRule: () => void;
  clickEdit: (e: React.MouseEvent, ids: string[]) => void;
  clickCopy: (e: React.MouseEvent, ids: string[]) => void;
  clickDelete: (e: React.MouseEvent, ids: string[]) => void;
  selected: string[];
}

interface Props {
  rows: FCR[];
  clickAddNewRule: () => void;
  clickEdit: (e: React.MouseEvent, ids: string[]) => void;
  clickCopy: (e: React.MouseEvent, ids: string[]) => void;
  clickDelete: (e: React.MouseEvent, ids: string[]) => void;
  selected: string[];
  setSelected: SetState<string[]>;
  showRenders: boolean;
}

// const customColumnStyle = { maxWidth: "100px" }
// const customPermitStyle = { marginLeft: '5px', backgroundColor: "green" }
// const customDenyStyle = { marginLeft: '5px', backgroundColor: "darkred" }

const descendingComparator = (a: FCR, b: FCR, orderBy: keyof FCR) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order: 'asc' | 'desc', orderBy: keyof FCR) {
  return order === 'desc'
    ? (a: FCR, b: FCR) => descendingComparator(a, b, orderBy)
    : (a: FCR, b: FCR) => -descendingComparator(a, b, orderBy);
}

function stableSort(array: FCR[], comparator: (a: FCR, b: FCR) => number) {
  const stabilizedThis = array.map<[FCR, number]>((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  return stabilizedThis.map(([el]) => el);
}

const headCells: { id: keyof FCR; numeric: false; disablePadding: boolean; label: string }[] = [
  { id: 'id', numeric: false, disablePadding: true, label: 'FCR#' },
  { id: 'username', numeric: false, disablePadding: false, label: 'Requestor Name' },
  { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
  { id: 'date', numeric: false, disablePadding: false, label: 'Implementation Date' },
  { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
];

const EnhancedTableHead = ({ classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort }: HeadProps) => {
  const createSortHandler = (property: keyof FCR) => (event: unknown) =>
    onRequestSort(event, property);

  return <TableHead>
    <TableRow>
      <TableCell padding="checkbox">
        <Checkbox
          indeterminate={numSelected > 0 && numSelected < rowCount}
          checked={rowCount > 0 && numSelected === rowCount}
          onChange={onSelectAllClick}
          inputProps={{ 'aria-label': 'select all desserts' }}
        />
      </TableCell>
      {headCells.map((headCell) => (
        <TableCell
          key={headCell.id}
          align={headCell.numeric ? 'right' : 'left'}
          padding={headCell.disablePadding ? 'none' : 'normal'}
          sortDirection={orderBy === headCell.id ? order : false}
        >
          <TableSortLabel
            active={orderBy === headCell.id}
            direction={orderBy === headCell.id ? order : 'asc'}
            onClick={createSortHandler(headCell.id)}
          >
            {headCell.label}
            {orderBy === headCell.id ? (
              <span className={classes.visuallyHidden}>
                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
              </span>
            ) : null}
          </TableSortLabel>
        </TableCell>
      ))}
    </TableRow>
  </TableHead>;
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85),
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark,
      },
  title: {
    flex: '1 1 100%',
  },
  toolbar: {
    display: 'flex'
  }
}));

const EnhancedTableToolbar = ({ numSelected, clickAddNewRule, clickEdit, clickCopy, clickDelete, selected }: ToolbarProps) => {
  const classes = useToolbarStyles();

  return <Toolbar
    className={clsx(classes.root, {
      [classes.highlight]: numSelected > 0,
    })}
  >
    {numSelected > 0 ? (
      <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
        {numSelected} selected
      </Typography>
    ) : (
      <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
        Requested Firewall Rules
      </Typography>
    )}

    {numSelected > 0 && numSelected === 1 ? (
      <div className={classes.toolbar}>
        <Tooltip title="Edit">
          <IconButton aria-label="edit" onClick={(e) => clickEdit(e, selected)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Copy">
          <IconButton aria-label="copy" onClick={(e) => clickCopy(e, selected)}>
            <FileCopyIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton aria-label="delete" onClick={(e) => clickDelete(e, selected)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </div>
    ) :
      numSelected > 0 && numSelected > 1 ? (
        <Tooltip title="Delete">
          <IconButton aria-label="delete" onClick={(e) => clickDelete(e, selected)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Add New Rule">
          <IconButton aria-label="filter list" onClick={clickAddNewRule}>
            <AddCircleIcon />
          </IconButton>
        </Tooltip>
      )}
  </Toolbar>;
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  clickAddNewRule: PropTypes.func.isRequired
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

const FCREnhancedTable = ({ rows, clickAddNewRule, clickEdit, clickCopy, clickDelete, selected, setSelected, showRenders }: Props) => {
  const classes = useStyles();
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof FCR>('id');
  // const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (_: unknown, property: keyof FCR) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const selection = rows.map((n) => n.id);
      setSelected(selection);
      return;
    }
    setSelected([]);
  };

  const handleClick = (_: unknown, id: string) =>
    setSelected(selected.includes(id)
      ? selected.filter(x => x !== id)
      : [...selected, id]);

  const handleChangePage = (_: unknown, newPage: number) =>
    setPage(newPage);

  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const isSelected = (name: string) => selected.includes(name);

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const ExpensiveComp = () => {

    return (
        <div className={classes.root}>
        <DivRenders showRenders={showRenders} />
        <Paper className={classes.paper}>
            <EnhancedTableToolbar
            numSelected={selected.length}
            clickAddNewRule={clickAddNewRule}
            clickEdit={clickEdit}
            clickCopy={clickCopy}
            clickDelete={clickDelete}
            selected={selected}
            />
            <TableContainer>
            <Table
                className={classes.table}
                aria-labelledby="tableTitle"
                size={'medium'}
                aria-label="enhanced table"
            >
                <EnhancedTableHead
                classes={classes}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
                />
                <TableBody>
                {stableSort(rows, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                    const isItemSelected = isSelected(row.id);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                        <TableRow
                        hover
                        onClick={(e) => handleClick(e, row.id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        selected={isItemSelected}
                        >
                        <TableCell padding="checkbox">
                            <Checkbox
                            checked={isItemSelected}
                            inputProps={{ 'aria-labelledby': labelId }}
                            />
                        </TableCell>
                        <TableCell component="th" id={labelId} scope="row" padding="none">{row.id}</TableCell>
                        <TableCell align="left">{row.username}</TableCell>
                        <TableCell align="left">{row.email}</TableCell>
                        <TableCell align="left">{row.date}</TableCell>
                        <TableCell align="left">{row.status}</TableCell>
                        </TableRow>
                    );
                    })}
                {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                    </TableRow>
                )}
                </TableBody>
            </Table>
            </TableContainer>
            <TablePagination
            rowsPerPageOptions={[5, 10]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
        {/* <FormControlLabel
                control={<Switch checked={dense} onChange={handleChangeDense} />}
                label="Dense padding"
            /> */}
        </div>
    );
    }

    return useMemo(ExpensiveComp, [rows, rowsPerPage, page, selected, order, orderBy])

  

}

export default FCREnhancedTable;
