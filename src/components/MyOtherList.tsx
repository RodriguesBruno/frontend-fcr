import { useMemo } from 'react';

import DivRenders from '../hoc/DivRenders'

interface Props {
    description: string;
    showRenders: boolean;
};

const MyOtherList = ({ description, showRenders }: Props) => {
    
    const ExpensiveStuff = () => {
        console.log(description)
        return <div><DivRenders showRenders={showRenders} title='Description' /><div>{description}</div></div>
        
    }

    return useMemo(ExpensiveStuff,[description, showRenders])

}
export default MyOtherList;