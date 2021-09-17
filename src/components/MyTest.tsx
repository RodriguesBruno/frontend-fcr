import { useState } from 'react';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import DivRenders from '../hoc/DivRenders'

interface Props {
    showRenders: boolean;
    
    
};

const MyTest = ({ showRenders }: Props) => {

    const [text, setText] = useState('');

    const changeSearch = (value: string) => {
        setText(value)
        // searchObject(value)
    }
    // console.log(description)
    
    return (
        <div>
            <DivRenders showRenders={showRenders} title='MyTest '/>
            <div >
                <SearchIcon />
            </div>
            <InputBase
                placeholder="Filter"
                
                inputProps={{ 'aria-label': 'Search' }}
                value={text}
                onChange={(e) => changeSearch(e.target.value)}
                />
          
      </div>
      
      )

}
export default MyTest;