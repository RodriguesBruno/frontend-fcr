import 'date-fns';
// import React from 'react';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider, KeyboardDateTimePicker} from '@material-ui/pickers';


interface Props {
  selectedDate: Date | null,
  handleDateChange: (date: Date | null) => void
}

export default function MaterialUIPickers({ selectedDate, handleDateChange}: Props) {
  // The first commit of Material-UI
//   const [selectedDate, setSelectedDate] = React.useState<Date | null>(
//     new Date('2021-08-03T18:30:00'),
//   );
  // const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);

  // const handleDateChange = (date: Date | null) => {
  //   setSelectedDate(date);
  // };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container justifyContent="space-around">
        <KeyboardDateTimePicker
            value={selectedDate}
            onChange={handleDateChange}
            label="Implementation Date *"
            onError={console.log}
            minDate={new Date("2021-01-01T00:00")}
            format="yyyy/MM/dd hh:mm a"
            ampm={false}
            helperText="Select Date for Implementation"

        />
        
      </Grid>
    </MuiPickersUtilsProvider>
  );
}
