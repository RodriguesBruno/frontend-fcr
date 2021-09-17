import { useState } from 'react';
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';
import { unstable_createMuiStrictModeTheme as createTheme } from '@material-ui/core';
import Switch from '@material-ui/core/Switch';
import CssBaseline from '@material-ui/core/CssBaseline';
import DivRenders from './hoc/DivRenders'
import EnhancedTable from './components/NewEnhancedTable';
import TextField from '@material-ui/core/TextField';
// import FormControl from '@material-ui/core/FormControl'
// import InputLabel from '@material-ui/core/InputLabel'
// import FormHelperText from '@material-ui/core/FormHelperText'
// import Input from '@material-ui/core/Input'
import Card from "@material-ui/core/Card";
import Paper from '@material-ui/core/Paper'
import CustomizedSnackbars from './components/MySnackbar';
import { MyDialog, SaveRule } from './components/MyDialog';
import { v4 as uuidv4 } from 'uuid';
import { Color } from '@material-ui/lab';
import DatePicker from './components/DatePicker'
import MyTextField, {  } from './components/MyTextField';

import InputAdornment from '@material-ui/core/InputAdornment';

export interface Rule {
  id: string;
  fromZone: string;
  toZone: string;
  srcAddr: Data[];
  dstAddr: Data[];
  service: Data[];
  action: string;
  description: string;
}

export interface FCR {
  id: string;
  username: string;
  email: string;
  date: Date;
  status: string;
}


export interface Data { data: string }

const useStyles = makeStyles((theme) => ({
  card: {
    marginLeft: theme.spacing(5),
    marginRight: theme.spacing(5),
  },
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      // margin: theme.spacing(2),
      // width: '50ch',
    },
  },
  paper: {
    width: '32ch',
    marginLeft: theme.spacing(5),
    marginBottom: theme.spacing(1)
  },
  paperLong: {
    // width: '62ch',
    // maxWidth: '32ch',
    marginLeft: theme.spacing(5),
    marginBottom: theme.spacing(1),
    // marginRight: theme.spacing(5),
  },
  flex: {
    display: 'flex'
  }
  
}));

const snackObj: { severity: Color; message: string }[] = [
  {
    severity: 'error',
    message: 'Error: Rule Already exists'
  },
  {
    severity: 'success',
    message: 'Success: Rule Added'
  },
  {
    severity: 'info',
    message: 'Success: Rule Updated'
  },
  {
    severity: 'error',
    message: 'Success: Rule/s Deleted'
  },
];

const App = () => {
  const classes = useStyles();
  const showRenders = true;
  const myuuid = uuidv4();
  const [srcAddr, setSrcAddr] = useState<Data[]>([]);
  const [dstAddr, setDstAddr] = useState<Data[]>([]);
  const [rules, setRules] = useState<Rule[]>([]);
  const [dark, setDark] = useState(true);
  const [tabGroupName, setTabGroupName] = useState('1');
  const [services, setServices] = useState<Data[]>([]);
  const [id, setId] = useState('')
  const [fromZone, setFromZone] = useState('');
  const [fcrStatus, setFcrStatus] = useState('DRAFT');
  const [toZone, setToZone] = useState('');
  const [action, setAction] = useState('Permit');
  const [description, setDescription] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [searched, setSearched] = useState('');
  const [edit, setEdit] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  
  const [reqUsername, setReqUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [business, setBusiness] = useState<string>('');

  // const [text, setText] = useState('');

  const [handleSnack, setHandleSnack] = useState(false)
  const [snackContent, SetSnackContent] = useState<typeof snackObj[0]>()

  const [open, setOpen] = useState(false);

  const [objectItems] = useState([
    { id: 1, data: "10.0.0.0/8" },
    { id: 2, data: "172.16.0.0/12" },
    { id: 3, data: "192.168.0.0/16" },
    { id: 4, data: "GroupJane" },
    { id: 5, data: "GroupJohn" },
    { id: 6, data: "GroupA" },
    { id: 7, data: "GroupB" },
    { id: 8, data: "GroupC" },
    { id: 9, data: "Group_very_very_big" },
    { id: 10, data: "GroupE" },
    { id: 11, data: "GroupF" },
    { id: 12, data: "GroupG" },
    { id: 13, data: "GroupH" },
    { id: 14, data: "GroupI" },
    { id: 15, data: "GroupJ" },

  ]);

  const [serviceItems] = useState([
    { id: 1, data: "TCP_179" },
    { id: 2, data: "TCP_49" },
    { id: 3, data: "TCP_22" },
    { id: 4, data: "TCP_3389" },
    { id: 5, data: "TCP_HTTPS" },
    { id: 6, data: "TCP_HTTP" },
    { id: 7, data: "UDP_53" },

  ]);

  const [tabItems, setTabItems] = useState<Data[]>(objectItems);

  const theme = createTheme({
    palette: {
      type: dark ? 'dark' : 'light',
    },
  })


  const zones = [
    {
      value: 'CORPORATE_VRF',
      label: 'CORPORATE_VRF',
    },
    {
      value: 'DTE',
      label: 'DTE',
    },
    {
      value: 'DMZ',
      label: 'DMZ',
    },
    {
      value: 'OTHER',
      label: 'OTHER',
    },
  ];

  const FCRState = [
    {
      value: 'DRAFT',
      label: 'DRAFT'
    },
    {
      value: 'SUBMIT',
      label: 'SUBMIT'
    },
    {
      value: 'ASSIGNED',
      label: 'ASSIGNED'
    },
    {
      value: 'CLOSED',
      label: 'CLOSED'
    },
    {
      value: 'CANCELLED',
      label: 'CANCELLED'
    }

  ];

  const handleTabChange = (_: unknown, newValue: number) => {
    if (newValue === 0) {
      setTabItems(objectItems)
      setTabGroupName('1')
    } else {
      setTabItems(serviceItems)
      setTabGroupName('2')
    }
    setTabValue(newValue)
    setSearched('');
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };



  const saveRule: SaveRule = ({ copy, edit, close }) => {
    const myId = edit ? id : myuuid;

    const rule: Rule = {
      id: myId,
      fromZone,
      toZone,
      action,
      description,
      srcAddr,
      dstAddr,
      service: services,
    };

    if (edit) {
      setRules(rules.map(x => x.id === id ? rule : x));
      setEdit(false);
      setSelected([])
      SetSnackContent(snackObj[2])
      setHandleSnack(true)
      if (close) {
        handleClose();
        return
      }
      if (copy) copyRule()
      else newRule()
    } else {
      const isDup = isDuplicate(rules, rule)
      if (isDup) {
        SetSnackContent(snackObj[0])
        setHandleSnack(true)
      } else {
        setRules([...rules, rule])
        SetSnackContent(snackObj[1])
        setHandleSnack(true)
        if (close) {
          setSelected([])
          handleClose()
          return
        }

        if (copy) copyRule()
        else newRule()
      }
    }
  }

  const searchObject = (value: string) => {
    console.log(tabValue)
    setTabItems((tabValue === 0 ? objectItems : serviceItems).filter(entry => entry.data.includes(value)))
    setSearched(value)
  }

  const handleClickOpen = () => {
    setTabGroupName('1')
    setTabItems(objectItems)
    setOpen(true);
  };

  const handleClose = () => {
    clearRule();
    setOpen(false);
  };

  const copyRule = () => {
    setDescription('');
    setSearched('');
  }

  const newRule = () => {
    setSrcAddr([]);
    setDstAddr([]);
    setAction('Permit');
    setServices([]);
    setDescription('');
    setTabValue(0);
    setSearched('');
    setSelected([])
  }

  const clearRule = () => {
    setFromZone('');
    setSrcAddr([]);
    setToZone('');
    setDstAddr([]);
    setAction('Permit');
    setServices([]);
    setDescription('');
    setTabValue(0);
    setSearched('');

  }

  const genString = () => {
    const result = Math.random().toString(36).substring(7);
    return result
  }

  const generateRule = () =>
    setRules([
      ...rules,
      {
        id: myuuid,
        fromZone: genString(),
        srcAddr: [{ data: genString() }],
        toZone: genString(),
        dstAddr: [{ data: genString() }],
        service: [{ data: genString() }],
        action: Math.random() < 0.5 ? 'Permit' : 'Deny',
        description: genString(),
      }
    ]);

  const clickEdit = (_: unknown, [id]: string[]) => {
    const rule = rules.find(rule => rule.id === id);

    if (!rule || !id) return;

    setId(id)
    setFromZone(rule.fromZone)
    setSrcAddr(rule.srcAddr)
    setToZone(rule.toZone)
    setDstAddr(rule.dstAddr)
    setServices(rule.service)
    setAction(rule.action)
    setDescription(rule.description)

    setEdit(true)
    setOpen(true)
  };

  const clickCopy = (_: unknown, [id]: string[]) => {
    const rule = rules.find(rule => rule.id === id);

    if (!rule || !id) return;

    setId(id)
    setFromZone(rule.fromZone)
    setSrcAddr(rule.srcAddr)
    setToZone(rule.toZone)
    setDstAddr(rule.dstAddr)
    setServices(rule.service)
    setAction(rule.action)
    setDescription(rule.description)
    setTabGroupName('1')
    setTabItems(objectItems)

    setOpen(true)
  }

  const clickDelete = (_: unknown, ids: string[]) => {
    SetSnackContent(snackObj[3])
    setHandleSnack(true)
    setRules(rules.filter(({ id }) => !ids.includes(id)))
    setSelected([])
  }

  const equalsIgnoreOrder = (a: Data[], b: Data[]) => {
    if (a.length !== b.length) return false;

    return [...new Set([...a.map(({ data }) => data), ...b.map(({ data }) => data)])]
      .every(v => a.filter(({ data }) => data === v).length === b.filter(({ data }) => data === v).length);
  }

  const isDuplicate = (a: Rule[], b: Rule) =>
    a.some(entry =>
      entry.fromZone === b.fromZone &&
      equalsIgnoreOrder(entry.srcAddr, b.srcAddr) &&
      entry.toZone === b.toZone &&
      equalsIgnoreOrder(entry.dstAddr, b.dstAddr) &&
      equalsIgnoreOrder(entry.service, b.service) &&
      entry.action === b.action
    );

  
  // console.log(rules)

  return (
    <div>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {snackContent && <CustomizedSnackbars
          open={handleSnack}
          onClose={() => setHandleSnack(false)}
          severity={snackContent.severity}
          message={snackContent.message}
        />}
        <DivRenders showRenders={showRenders} title='Hello world!' />
        <div className={classes.card}>
          Theme
          <Switch checked={dark} onChange={() => setDark(!dark)} />
        </div>
        <div className={classes.root}>
            
          
            <div className={classes.flex}>
              <Paper className={classes.paper}>
                <TextField
                  id="filled-read-only-input"
                  label="Firewall Change Request"
                  defaultValue="FCR00000123"
                  InputProps={{
                    readOnly: true,
                    startAdornment: <InputAdornment position="start">#</InputAdornment>,
                    
                  }}
                  // variant="filled"
                />
              </Paper>

              <Paper className={classes.paper}>
                <MyTextField
                  id={fromZone}
                  label={'FCR Status'}
                  value={fcrStatus}
                  onChange={setFcrStatus}
                  helperText={'Select FCR Status'}
                  items={FCRState}
                />
              </Paper>

            </div>
            
            <div className={classes.flex}>
              <Paper className={classes.paper}>
                <TextField
                  required
                  id="filled-required"
                  label="Requestor"
                  value={reqUsername}
                  onChange={(e) => setReqUsername(e.target.value)}
                  // defaultValue=""
                  helperText="Requestor Username"
                  // InputProps={{
                  //   readOnly: true,
                  // }}
                  // variant="filled"
                />
              
              </Paper>

              <Paper className={classes.paper}>
                <TextField
                    required
                    id="email-required"
                    label="Requestor Email"
                    // defaultValue=""
                    helperText="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    // InputProps={{
                    //   readOnly: true,
                    // }}
                    // variant="filled"
                  />
              </Paper>

              <Paper className={classes.paper}>
                <DatePicker
                  selectedDate={selectedDate}
                  handleDateChange={handleDateChange}
                />
              </Paper>
            </div>
            
            <div className={classes.flex}>
              <Paper className={classes.paper}>
                <TextField
                  required
                  id="standard-full-width"
                  label="Business Justification"
                  multiline
                  minRows={4}
                  value={business}
                  onChange={(e) => setBusiness(e.target.value)}
                  // value=''
                  helperText="Please enter description for this request"
                  // fullWidth
                  className={classes.card}
                  // onChange={handleChange}
                  />
              </Paper>

              

              
            </div>
          
            

          
        </div>

        <div className={classes.card}>
          <Card >
            <EnhancedTable
              rows={rules}
              clickAddNewRule={handleClickOpen}
              clickEdit={clickEdit}
              clickCopy={clickCopy}
              clickDelete={clickDelete}
              selected={selected}
              setSelected={setSelected}
              showRenders={showRenders}
            />
          </Card>
        </div>

        {/* <Button variant="outlined" color="primary" onClick={handleClickOpen}>
          Open max-width dialog
        </Button>

        <Button variant="outlined" color="primary" onClick={() => console.log(rules)}>
          CheckRules
        </Button>

        <Button variant="outlined" color="primary" onClick={() => setNumber(Math.floor(Math.random() * 10))}>
          CreateRandomRule
        </Button> */}

        <MyDialog
          showRenders={showRenders}
          open={open}
          tabValue={tabValue}
          handleClose={handleClose}
          handleTabChange={handleTabChange}
          searched={searched}
          searchObject={searchObject}
          fromZone={fromZone}
          srcAddr={srcAddr}
          dstAddr={dstAddr}
          toZone={toZone}
          action={action}
          setAction={setAction}
          setDstAddr={setDstAddr}
          setToZone={setToZone}
          zones={zones}
          description={description}
          setDescription={setDescription}
          services={services}
          setServices={setServices}
          setFromZone={setFromZone}
          setSrcAddr={setSrcAddr}
          saveRule={saveRule}
          edit={edit}
          clearRule={clearRule}
          generateRule={generateRule}
          tabItems={tabItems}
          setTabItems={setTabItems}
          tabGroupName={tabGroupName}
        />

        {/* <MyList getItems={getItems} />

        <MyOtherList description={description} showRenders={showRenders} /> */}


        {/* <div>
          <TextField
            id="outlined-basic"
            label="Description"
            // className={classes.button}
            size={"medium"}
            value={text}
            onChange={(e) => setText(e.target.value)}
            // inputProps={{ maxLength: 30 }}
          />
        </div> */}

        {/* <div>
          <div >
              <SearchIcon />
          </div>
          <InputBase
              placeholder="Filter"
              
              inputProps={{ 'aria-label': 'Search' }}
              value={text}
              onChange={(e) => setText(e.target.value)}
              />
            
        </div>

        <MyTest showRenders={showRenders} /> */}


      </ThemeProvider>
    </div>
  )
}

export default App;


