import React, { useRef } from 'react';

interface Props {
  showRenders: boolean;
  title?: string;
}

const DivRenders = ({ showRenders, title }: Props) => {
  const renders = useRef(0)

  return showRenders ? <div>{title} Renders: {renders.current++}</div> : <></>;
};

export default DivRenders
