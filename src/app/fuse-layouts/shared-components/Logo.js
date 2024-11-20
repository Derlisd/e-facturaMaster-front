import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .logo-icon': {
      transition: theme.transitions.create(['width', 'height'], {
        duration: theme.transitions.duration.shortest,
        easing: theme.transitions.easing.easeInOut,
      }),
    },
    '& .react-badge, & .logo-text': {
      transition: theme.transitions.create('opacity', {
        duration: theme.transitions.duration.shortest,
        easing: theme.transitions.easing.easeInOut,
      }),
    },
    logoContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    reactBadge: {
      backgroundColor: '#121212',
      color: '#61DAFB',
    },
  },
  textBelow: {
    color: 'white',
    fontSize: '20px',
    marginTop: theme.spacing(1), // Espaciado entre la imagen y el texto
  },
}));

function Logo() {
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, classes.logoContainer)}>
      <img
        style={{ width: '200px', height: '30px' }}
        className="logo-icon w-24 h-24"
        src="assets/images/logos/dashboard.png"
        alt="logo"
      />
      <Typography className={clsx(classes.textBelow)} variant="caption" color="textSecondary">
        Expertise E.A.S
      </Typography>
    </div>
  );
}

export default Logo;
