// @flow
import type {WithStyles} from '@material-ui/core';

import * as React from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SettingsIcon from '@material-ui/icons/Settings';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import {useEffect, useState} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';

import {motion} from 'framer-motion';

const iconWidth = 25;
const iconHeight = 25;

const styles = theme => ({
  root: {
    color: theme.palette.grey[900],
    fontWeight: 500,
    fontSize: '20px',
    lineHeight: '24px',
  },
  mainDiv: {
    padding: '24px',
  },
  cardContainerCollapsed: {
    display: 'flex',
    transition: 'all 0.935s ease-in-out',
  },
  cardContainerNotCollapsed: {
    display: 'block',
    transition: 'all 0.935s ease-in-out',
  },
  iconButton: {
    marginLeft: '10px',
    padding: '5px',
    width: iconWidth + 'px',
    height: iconHeight + 'px',
    color: theme.palette.grey[900],
    border: '2px solid black',
    borderRadius: '5px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingIconContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsIcon: {
    fontSize: '16px',
  },
  expandedResourceContainer: {
    position: 'relative',
    right: '-50px',
    top: '-21px',
    height: (iconHeight + 10) + 'px',
  },
  nameTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  poolTypeTitle: {
    fontSize: '16px',
  },
  chipContainer: {
    display: 'grid',
    gridTemplateColumns: 'minmax(15px, 60px) minmax(15px, 60px)',
  },
  chip: {
    margin: theme.spacing(0.5),
  },
});

type poolItemProps = {
  id: Number,
  PoolType: string,
  Name: string,
};

type Props = {
  poolItem: poolItemProps,
  i: Number,
  children: React.ChildrenArray<null | React.Element<*>>,
  className?: string,
} & WithStyles<typeof styles>;

const PoolItem = (props: Props) => {
  const {className, classes, children, poolItem, i} = props;
  const {id, PoolType, Name} = poolItem;
  const [isExpanded, setIsExpanded] = useState(false);

  const variants = {
    collapsed: count => ({
      transform: `translate(0px, 0px)`,
    }),
    notCollapsed: count => ({
      transform: `translate(${count * -35}px, ${count * (iconHeight + 10)}px)`,
    }),
  };

  const variantsDiv = {
    collapsed: {
      width: '100%',
    },
    notCollapsed: {
      width: '0%',
    },
  };

  return (
    <div className={classes.mainDiv}>
      <Accordion
        onChange={(event, expanded) => {
          setIsExpanded(expanded);
        }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header">
          <div>
            <div className={classes.nameTitle}>{Name}</div>
            <div className={classes.poolTypeTitle}>{PoolType}</div>
            <div className={classes.chipContainer}>
              {[1, 2, 3, 4].map((i) => {
                return <Chip key={i}  label={'Tag'} variant="outlined" size="small" className={classes.chip} />
              })}
            </div>
          </div>

          <div>
            <div style={{display: 'flex', top: '15px'}}>
              {[1, 2, 3, 4].map((e, i) => {
                return (
                  <motion.div
                    key={i}
                    animate={isExpanded ? 'notCollapsed' : 'collapsed'}
                    transition={{duration: 0.1 + i * 0.02}}
                    variants={variants}
                    custom={i}
                    className={classes.iconButton}>
                    <Tooltip title={e} placement="top" arrow>
                      <div className={classes.settingIconContainer}>
                        <SettingsIcon className={classes.settingsIcon} />
                      </div>
                    </Tooltip>
                  </motion.div>
                );
              })}
            </div>
            {isExpanded
              ? [1, 2, 3, 4].map((e, i) => {
                  return (
                    <motion.div
                        key={i}
                        animate={{ width: '100%' }}
                        transition={{ duration: 0.5 }}
                        className={classes.expandedResourceContainer}>
                      sfghjmnbvcvbnbvcvbn
                    </motion.div>
                  );
                })
              : null}
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <div className={classes.notCollapsedMainDiv} />
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default withStyles(styles)(PoolItem);
