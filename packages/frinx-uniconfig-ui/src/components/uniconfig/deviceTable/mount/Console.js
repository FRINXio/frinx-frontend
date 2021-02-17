import React, { useEffect, useRef } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: 'black',
    width: '100%',
    height: '200px',
    maxHeight: '200px',
    overflowY: 'scroll',
    color: 'white',
    padding: '20px',
  },
}));

const Console = ({ outputConsole }) => {
  const classes = useStyles();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // scroll to bottom
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [outputConsole]);

  return (
    <div className={classes.root}>
      {outputConsole.output.map((s, i) => (
        <p key={i}>{s}</p>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default Console;
