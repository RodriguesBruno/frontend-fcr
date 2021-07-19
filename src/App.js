import React, { useState } from 'react';
import { createTheme, ThemeProvider, makeStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
// import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import DivRenders from './hoc/DivRenders'
import EnhancedTable from './EnhancedTable';
import Card from "@material-ui/core/Card";
import CustomizedSnackbars from './components/MySnackbar';
import MyDialog from './components/MyDialog';

import {v4 as uuidv4} from 'uuid';

const useStyles = makeStyles((theme) => ({
  card:{
    marginLeft: theme.spacing(5),
    marginRight: theme.spacing(5),
  
  }
  
}));


const App = () => {

  const classes = useStyles();

  const snackObj = [
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
  ]

  const showRenders= true;
  const myuuid = uuidv4();
  const [srcAddr, setSrcAddr] = useState([]);
  const [dstAddr, setDstAddr] = useState([]);
  const [rules, setRules] = useState([]);
  const [dark, setDark] = useState(true);
  const [tabGroupName, setTabGroupName] = useState('1');
  const [services, setServices] = useState([]);
  const [id, setId] = useState('')
  const [fromZone, setFromZone] = useState('');
  const [toZone, setToZone] = useState('');
  const [action, setAction] = useState('Permit');
  const [description, setDescription] = useState('');
  const [value, setTabValue] = useState(0);
  const [searched, setSearched] = useState('');
  const [edit, setEdit] = useState(false);
  const [selected, setSelected] = useState([]);

  const [handleSnack, setHandleSnack] = useState(false)
  const [snackContent, SetSnackContent] = useState({})
  
  const [open, setOpen] = useState(false);

  const [objectItems, setObjectItems] = useState([
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

  const [serviceItems, setServiceItems] = useState([
    { id: 1, data: "TCP_179" },
    { id: 2, data: "TCP_49" },
    { id: 3, data: "TCP_22" },
    { id: 4, data: "TCP_3389" },
    { id: 5, data: "TCP_HTTPS" },
    { id: 6, data: "TCP_HTTP" },
    { id: 7, data: "UDP_53" },       

  ]);

  const [tabItems, setTabItems] = useState(objectItems);
  
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
  
  const handleTabChange = (e, newValue) => {
    if (newValue === 0) { 
      setTabItems(objectItems)
      setTabGroupName ('1') 
    }
    else  {
      setTabItems(serviceItems)
      setTabGroupName('2')
    }
    setTabValue(newValue)
    setSearched(''); 
  };
  
  const saveRule = (props) => {
    const { copy, edit, close } = props

    let myId
    if (edit) myId = id 

    else myId = myuuid 

    let rule = {
      id: myId,
      fromZone: fromZone,
      srcAddrOriginal: srcAddr,
      srcAddr: srcAddr.map(e => e.data).join(', '),
      srcAddrArray: srcAddr.map(e => e.data),
      toZone: toZone,
      dstAddrOriginal: dstAddr,
      dstAddr: dstAddr.map(e => e.data).join(', '),
      dstAddrArray: dstAddr.map(e => e.data),
      srv: services.map(e => e.data).join(', '),
      srvArray: services.map(e => e.data),
      srvOriginal: services,
      action: action,
      description: description,
    }

    const tempRule = [];
    tempRule.push(rule);

    const newRules = [...rules];

    if (edit) {
      const index = newRules.findIndex(entry => entry.id === id)
      newRules[index] = rule;
      setRules(newRules);
      setEdit(false);
      setSelected([])
      SetSnackContent(snackObj[2])  
      setHandleSnack(true)
      if (close) { handleClose(); return }
      if (copy) copyRule()
      else newRule()
    }
    else {
      const isDup = isDuplicate(rules, tempRule)
      if (isDup) {
        SetSnackContent(snackObj[0])  
        setHandleSnack(true)
      }
      else {
        newRules.push(rule)
        setRules(newRules)
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

  const searchObject = (e, tabValue) => {
    let items
    if (tabValue === 0) items = [...objectItems]
    else items = [...serviceItems];
    
    const filtered = items.filter(entry => entry.data.includes(e.target.value))
    setTabItems(filtered)
    setSearched(e.target.value)

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

  const generateRule = () => {
    const rule = {
    id: myuuid,
    fromZone: genString(),
    srcAddr: [genString()],
    toZone: genString(),
    dstAddr: [genString()],
    srv: [genString()],
    action: Math.random() < 0.5 ? 'Permit': 'Deny',
    description: genString(),
    }
    const newRules = [...rules];
    newRules.push(rule)
    setRules(newRules)

  }

  const clickEdit = (e, id) => {
    const rule = rules.find(rule => rule.id === id[0])
    setId(id[0])
    setFromZone(rule.fromZone)
    setSrcAddr(rule.srcAddrOriginal)
    setToZone(rule.toZone)
    setDstAddr(rule.dstAddrOriginal)
    setServices(rule.srvOriginal)
    setAction(rule.action)
    setDescription(rule.description)
    
    setEdit(true)
    setOpen(true)
  }
  
  const clickCopy = (e, id) => {
    const rule = rules.find(rule => rule.id === id[0])
    setId(id[0])
    setFromZone(rule.fromZone)
    setSrcAddr(rule.srcAddrOriginal)
    setToZone(rule.toZone)
    setDstAddr(rule.dstAddrOriginal)
    setServices(rule.srvOriginal)
    setAction(rule.action)
    setDescription(rule.description)
    setTabGroupName('1')
    setTabItems(objectItems)
    
    setOpen(true)
  }

  const clickDelete = (e, ids) => {
    const newRules = [...rules];
    ids.forEach(id => {
      const index = newRules.findIndex(entry => entry.id === id)
      newRules.splice(index, 1)
    })
    SetSnackContent(snackObj[3])  
    setHandleSnack(true)
    setRules(newRules)
    setSelected([])
  }

  const equalsIgnoreOrder = (a, b) => {
    if (a.length !== b.length) return false;
    const uniqueValues = new Set([...a, ...b]);
    for (const v of uniqueValues) {
      
      const aCount = a.filter(e => e === v).length;
      const bCount = b.filter(e => e === v).length;
      if (aCount !== bCount) return false;
    }
    return true;
  }

  const isDuplicate = (a, b) => {
    let result = ''
    for (var entry of a) {
      
      result =	entry.fromZone === b[0].fromZone &&
      equalsIgnoreOrder(entry.srcAddrArray, b[0].srcAddrArray) && 
      entry.toZone ===b[0].toZone &&
      equalsIgnoreOrder(entry.dstAddrArray, b[0].dstAddrArray) &&
      equalsIgnoreOrder(entry.srvArray, b[0].srvArray) &&
      entry.action === b[0].action 
      
      //If true inside Loop returns immediately
      if (result) return result
    }
    
    return result
    }
  
  return (
    <div>
      
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <CustomizedSnackbars 
          open={handleSnack} 
          onClose={() => setHandleSnack(false)}
          severity={snackContent.severity}
          message={snackContent.message}
        />

        <DivRenders showRenders={showRenders}/>
            <div className={classes.card}>
              Theme
              <Switch checked={dark} onChange={() => setDark(!dark)}/>  
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

        <Button variant="outlined" color="primary" onClick={() => generateRule()}>
          CreateRandomRule
        </Button> */}

        <MyDialog 
          showRenders={showRenders} 
          open={open}
          value={value}
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
      
      </ThemeProvider>
    </div>
  );
}

export default App;


