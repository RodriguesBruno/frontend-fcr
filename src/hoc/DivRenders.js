import React from 'react';

const DivRenders = props => {
    const renders = React.useRef(0)
    const {
        showRenders,
        title, 
    } = props

    return showRenders ? <div>{title} Renders: {renders.current++}</div> : null
}

export default DivRenders