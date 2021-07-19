import React, { MouseEventHandler } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Divider from '@material-ui/core/Divider';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import DivRenders from '../hoc/DivRenders'
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import Badge from '@material-ui/core/Badge';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import MyTextField, { Item } from './MyTextField';
import MyDraggableList from './MyDraggableList';
import { TabsTypeMap } from '@material-ui/core/Tabs';
import { Data, Descriptor } from '../App';

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

interface Props {
  value: number;
  showRenders: boolean;
  open: boolean;
  searched: string;
  fromZone: string;
  srcAddr: Data[];
  dstAddr: Data[];
  services: Data[];
  tabItems: Descriptor[];
  toZone: string;
  action: string;
  tabGroupName: string;
  description: string;
  edit: boolean;
  zones: Item[];
  searchObject: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, tabValue: number) => void;
  handleClose: () => void;
  generateRule: () => void;
  handleTabChange: TabsTypeMap['props']['onChange'];
  setAction: SetState<string>;
  setToZone: SetState<string>;
  setDescription: SetState<string>;
  setFromZone: SetState<string>;
  setDstAddr: SetState<Data[]>;
  setServices: SetState<Data[]>;
  setSrcAddr: SetState<Data[]>;
  setTabItems: SetState<Descriptor[]>;
  clearRule: MouseEventHandler<HTMLButtonElement>;
  saveRule: SaveRule;
}

export type SaveRule = (options: { copy: boolean; edit: boolean; close: boolean; }) => void;

type TabProps = React.PropsWithChildren<{ dir?: string }>;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
  button: {
    margin: theme.spacing(1),
  },
  divider: {
    margin: theme.spacing(2),
  },
  select: {
    padding: theme.spacing(1.5),
    backgroundColor: "darksalmon",
    borderRadius: "5px",
  },
  paperFcr: {
    minHeight: "70vh",
    maxHeight: "70vh",
    overflowY: "scroll",
  },
  delBtn: {
    marginLeft: "5px"
  },
  paperSelect: {
    marginLeft: '5px',
    marginRight: '5px',
    height: '0%',
  },
  paperDiv: {
    margin: "10px",
  },
  genDiv: {
    padding: "0.7rem 0.5rem",
  },
  wrapDiv: {
    display: "flex",
    margin: "5px"
  },
  dragDiv: {
    marginTop: "5px",
    padding: "0.7rem 0.5rem",
    backgroundColor: "darkgrey",
    borderRadius: "5px",
    textAlign: "center",
  },
  srcDiv: {
    padding: "0.7rem 0.5rem",
    backgroundColor: "green",
    borderRadius: "5px",
    textAlign: "center",
  },
  dstDiv: {
    padding: "0.7rem 0.5rem",
    backgroundColor: "darkorange",
    borderRadius: "5px",
    textAlign: "center",
  },

}));

const TabContainer = ({ children, dir }: TabProps) =>
  <Typography component="div" dir={dir} style={{ padding: 8 * 2 }}>
    {children}
  </Typography>;

const actions = [
  {
    value: 'Permit',
    label: 'PERMIT'
  },
  {
    value: 'Deny',
    label: 'DENY'
  }
]

const MyDialog = (props: Props) => {
  const classes = useStyles();
  const {
    showRenders,
    open,
    value,
    handleClose,
    handleTabChange,
    searched,
    searchObject,
    fromZone,
    srcAddr,
    dstAddr,
    toZone,
    action,
    setAction,
    setDstAddr,
    setToZone,
    zones,
    description,
    setDescription,
    services,
    setServices,
    setFromZone,
    setSrcAddr,
    saveRule,
    edit,
    clearRule,
    // generateRule,
    tabItems,
    setTabItems,
    tabGroupName,
  } = props

  const sameZones = fromZone === toZone && fromZone !== '' && toZone !== '';

  const isRuleBtn = () => {
    if (fromZone ||
      srcAddr.length ||
      toZone ||
      dstAddr.length ||
      services.length ||
      description)

      return false
    else return true

  }

  const isBtnEnabled = () => {
    if (
      fromZone &&
      srcAddr.length &&
      toZone &&
      dstAddr.length &&
      action &&
      services.length &&
      description
    )
      return false
    else return true
  }

  return (
    <div>
      <DivRenders showRenders={showRenders} />

      <Dialog
        fullWidth={true}
        maxWidth='lg'
        open={open}
        onClose={handleClose}
        aria-labelledby="max-width-dialog-title"
      >
        <DialogTitle id="max-width-dialog-title">Firewall Rule</DialogTitle>
        <DialogContent >

          {!fromZone ?
            <DialogContentText>
              Please Select Security Zone
            </DialogContentText>
            : null
          }

          <div className={classes.wrapDiv}>
            <Paper variant="outlined" elevation={5} className={classes.paperFcr}>
              <DivRenders showRenders={showRenders} />
              <div className={classes.paperDiv}>
                <div className={classes.genDiv}>
                  <Tabs value={value} onChange={handleTabChange} aria-label="simple tabs example">
                    <Tab label="Objects" />
                    <Tab label="Services" />
                  </Tabs>

                  <Paper className={classes.genDiv}>
                    <TextField id="standard-basic" label="Search" value={searched} onChange={(e) => searchObject(e, value)} />
                  </Paper>

                  <TabContainer>
                    <MyDraggableList
                      items={tabItems}
                      setItems={setTabItems}
                      groupName={tabGroupName}
                      behaviour={'copy'}
                    />

                  </TabContainer>
                </div>
              </div>
            </Paper>

            <Divider orientation="vertical" flexItem className={classes.divider} />

            <Paper className={classes.paperSelect}>
              <DivRenders showRenders={showRenders} />
              <div className={classes.paperDiv}>
                <div className={classes.srcDiv}>

                  <MyTextField
                    id={fromZone}
                    label={'From-Zone'}
                    value={fromZone}
                    onChange={setFromZone}
                    helperText={'Select Source Zone'}
                    items={zones}
                  />
                </div>
              </div>

              {fromZone ?
                <div className={classes.paperDiv}>
                  <Tooltip title={'Drag from Objects Tab'} placement="bottom">
                    <div className={classes.srcDiv}>Source Address</div>
                  </Tooltip>

                  <MyDraggableList
                    items={srcAddr}
                    setItems={setSrcAddr}
                    groupName={'1'}
                  />
                </div>
                : null}
            </Paper>

            <Paper className={classes.paperSelect}>
              <DivRenders showRenders={showRenders} />
              <div className={classes.paperDiv}>
                <div className={classes.dstDiv}>
                  <MyTextField
                    id={toZone}
                    label={'To-Zone'}
                    value={toZone}
                    onChange={setToZone}
                    helperText={'Select Destination Zone'}
                    items={zones}
                  />
                </div>
              </div>

              {toZone ?
                <div className={classes.paperDiv}>
                  <Tooltip title={'Drag from Objects Tab'} placement="bottom">
                    <div className={classes.dstDiv}>Destination Address</div>
                  </Tooltip>

                  <MyDraggableList
                    items={dstAddr}
                    setItems={setDstAddr}
                    groupName={'1'}
                  />

                </div>
                : <div />}

            </Paper>


            <Paper className={classes.paperSelect}>
              <DivRenders showRenders={showRenders} />
              <div className={classes.paperDiv}>
                <div className={classes.select}>
                  <MyTextField
                    id={action}
                    label={'Action'}
                    value={action}
                    onChange={setAction}
                    helperText={'Select Action'}
                    items={actions}
                  />
                </div>
              </div>

              {srcAddr.length > 0 && dstAddr.length > 0 ?
                <div className={classes.paperDiv}>
                  <Tooltip title={'Drag from Services Tab'} placement="bottom">
                    <div style={{
                      marginTop: "5px",
                      padding: "0.7rem 0.5rem",
                      backgroundColor: "#009999",
                      borderRadius: "5px",
                      textAlign: "center",
                    }}>Service</div>
                  </Tooltip>

                  <MyDraggableList
                    items={services}
                    setItems={setServices}
                    groupName={'2'}
                  />

                </div>
                : null}
            </Paper>

            <Paper className={classes.paperSelect}>
              <DivRenders showRenders={showRenders} />
              <TextField
                id="outlined-basic"
                label="Description"
                className={classes.button}
                size={"medium"}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                inputProps={{ maxLength: 30 }}
              />
            </Paper >
          </div>
        </DialogContent>
        <DialogActions>

          {sameZones ?
            <div className={classes.button}>
              <Tooltip title="From-Zone & To-Zone are normally different. Are You Sure?" placement={'top'}>
                <Badge badgeContent={1} color="secondary">
                  <PriorityHighIcon color="primary" />
                </Badge>
              </Tooltip>
            </div>
            :
            null}

          {/* <Tooltip title="Generates Ramdom Rule" placement={'top'}>
                    <span>
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            className={classes.button}
                            startIcon={<FileCopyIcon />}
                            onClick={() => generateRule()}
                            // disabled={addRule()}
                        >
                            Generate Random
                        </Button>
                    </span>
                </Tooltip> */}

          <Tooltip title="New Rule based on current: Copies Everything" placement={'top'}>
            <span>
              <Button
                variant="contained"
                color="primary"
                size="small"
                className={classes.button}
                startIcon={<FileCopyIcon />}
                onClick={() => saveRule({ copy: true, edit, close: false })}
                disabled={isBtnEnabled()}

              >
                Save & Copy to New Rule
              </Button>
            </span>
          </Tooltip>


          <Tooltip title="New Rule based on current: Copies both Zones and Action" placement={'top'}>
            <span>
              <Button
                variant="contained"
                color="primary"
                size="small"
                className={classes.button}
                startIcon={<SaveIcon />}
                onClick={() => saveRule({ copy: false, edit: edit, close: false })}
                disabled={isBtnEnabled()}

              >
                Save & Add New Rule
              </Button>
            </span>
          </Tooltip>

          <Tooltip title="Save Rule and Close" placement={'top'}>
            <span>
              <Button
                variant="contained"
                color="primary"
                size="small"
                className={classes.button}
                startIcon={<SaveIcon />}
                onClick={() => saveRule({ copy: false, edit: edit, close: true })}
                disabled={isBtnEnabled()}

              >
                Save & Close
              </Button>
            </span>
          </Tooltip>

          <Tooltip title="Reset's Current Rule" placement={'top'}>
            <span>
              <Button
                variant="contained"
                color="secondary"
                size="small"
                className={classes.button}
                startIcon={<DeleteIcon />}
                onClick={clearRule}
                disabled={isRuleBtn()}
              >
                Reset Rule
              </Button>
            </span>

          </Tooltip>

          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleClose}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default MyDialog;
