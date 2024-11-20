import { amber } from '@material-ui/core/colors';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import { selectFlatNavigation } from 'app/store/fuse/navigationSlice';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const useStyles = makeStyles({
  root: {
    '&.horizontal': {},
    '&.vertical': {
      flexDirection: 'column',
    },
  },
  item: {
    textDecoration: 'none!important',
    color: 'inherit',
  },
  addIcon: {
    color: amber[600],
  },
});

function FuseShortcuts(props) {
  const dispatch = useDispatch();
  const shortcuts = useSelector(({ auth }) => auth.user.data.shortcuts);
  const navigation = useSelector(selectFlatNavigation);

  const classes = useStyles(props);
  const shortcutItems = shortcuts
    ? shortcuts.map((id) => navigation.find((item) => item.id === id))
    : [];

  const container = {
    show: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, scale: 0.6 },
    show: { opacity: 1, scale: 1 },
  };

  return (
    <div
      className={clsx(
        classes.root,
        props.variant,
        'flex flex-1',
        props.variant === 'vertical' && 'flex-grow-0 flex-shrink',
        props.className
      )}
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className={clsx('flex flex-1', props.variant === 'vertical' && 'flex-col')}
      >
        {shortcutItems.map(
          (_item) =>
            _item && (
              <Link to={_item.url} key={_item.id} className={classes.item} role="button">
                <Tooltip
                  title={_item.title}
                  placement={props.variant === 'horizontal' ? 'bottom' : 'left'}
                >
                  <IconButton className="w-40 h-40 p-0" component={motion.div} variants={item}>
                    {_item.icon ? (
                      <Icon>{_item.icon}</Icon>
                    ) : (
                      <span className="text-20 font-semibold uppercase">{_item.title[0]}</span>
                    )}
                  </IconButton>
                </Tooltip>
              </Link>
            )
        )}

      </motion.div>
    </div>
  );
}

FuseShortcuts.propTypes = {};
FuseShortcuts.defaultProps = {
  variant: 'horizontal',
};

export default memo(FuseShortcuts);
