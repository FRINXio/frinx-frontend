// @flow
import React from 'react';
import Typography from '@material-ui/core/Typography';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import makeStyles from '@material-ui/core/styles/makeStyles';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    height: '50px',
    width: '50px',
  },
}));

type Props = {
  onBackBtnClick: () => void,
};

const DeviceHeader = (props: Props) => {
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <Typography variant="h2" gutterBottom>
        <IconButton onClick={props.onBackBtnClick}>
          <NavigateBeforeIcon className={classes.icon} />
        </IconButton>
        {props.title}
      </Typography>
    </div>
  );
};

export default DeviceHeader;
