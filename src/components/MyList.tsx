import { useState, useEffect,  } from 'react';

interface Props {
    getItems: () => number[];
    
};

const MyList = ({ getItems }: Props) => {


    const [items, setItems] = useState<number[]>([])


    useEffect(() => {
        console.log('updating Items')
        setItems(getItems())

    }, [getItems])

    return <>{items.map(item => <div key={item}>{item}</div>)}</>
}

export default MyList;