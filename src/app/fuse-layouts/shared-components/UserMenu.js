import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logoutUser } from 'app/auth/store/userSlice';
import { Select, Grid } from "@material-ui/core";
import { makeStyles } from '@material-ui/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import JwtService from 'app/services/jwtService';
import UserService from 'app/services/UserService';

const useStyles = makeStyles(theme => ({
  dialogPaper: {
    width: '400px'
  }
}));

function UserMenu(props) {
  const dispatch = useDispatch();
  const user = useSelector(({ auth }) => auth.user);
  let userEmail = user.data.email;
  let userProfile = user.role[0];

  const classes = useStyles();
  const [userMenu, setUserMenu] = useState(null);
  const [Open, setOpen] = useState(false);
  const [perfiles, handlePerfiles] = useState([]);
  const [perfil, handlePerfil] = useState(userProfile);

  async function fetchPerfiles() {
    var data = {
      email: userEmail,
    }
    await UserService.getListPerfiles(data)
      .then(response => {
        if (response.data.status == "success") {
          handlePerfiles(response.data.data)
        } else {
          message("error", JSON.stringify(response.data.message));
        }
      }).catch(error => {
        console.log(error)
        message("error", error);
      });
  }

  useEffect(() => {
    fetchPerfiles()
  }, []);

  async function handleChange() {
    JwtService.signInWithEmail(userEmail, perfil)
      .then((response) => {
        window.location.reload(true);
      }).catch(error => {
        console.log(error)
      });
  }

  function handleShow() {
    setOpen(true)
  }

  const userMenuClick = (event) => {
    setUserMenu(event.currentTarget);
  };

  const userMenuClose = () => {
    setUserMenu(null);
  };

  async function handleCancelClose() {
    setOpen(false);
  }

  return (
    <>
      <Dialog open={Open} onClose={handleCancelClose} classes={{ paper: classes.dialogPaper }} aria-labelledby="form-dialog-title">
        <div align='right'><Button onClick={handleCancelClose} color="inherit">
          X
        </Button></div>
        <DialogTitle id="form-deactivate-dialog-title">Seleccione el perfil</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={6} md={12}>
              <Select
                value={perfil}
                fullWidth
                onChange={e => handlePerfil(e.target.value)}
                required
              >
                {perfiles.map(perfil =>
                  <MenuItem key={perfil.id} value={perfil.perfil}>{perfil.desc_perfil}</MenuItem>
                )}
              </Select>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelClose} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleChange} color="inherit">
            Continuar
          </Button>
        </DialogActions>
      </Dialog>
      <Button className="min-h-40 min-w-40 px-0 md:px-16 py-0 md:py-6" onClick={userMenuClick}>
        <div className="hidden md:flex flex-col mx-4 items-end">
          <Typography component="span" className="font-semibold flex">
            {user.data.username}
          </Typography>
          <Typography className="text-11 font-medium capitalize" color="textSecondary">
            {user.role.toString()}
            {(!user.role || (Array.isArray(user.role) && user.role.length === 0)) && 'Guest'}
          </Typography>
        </div>

        {user.data.photoURL ? (
          <Avatar className="md:mx-4" alt="user photo" src={user.data.photoURL} />
        ) : (
          <Avatar className="md:mx-4">{user.role[0][0]}</Avatar>
        )}
      </Button>

      <Popover
        open={Boolean(userMenu)}
        anchorEl={userMenu}
        onClose={userMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        classes={{
          paper: 'py-8',
        }}
      >
        {!user.role || user.role.length === 0 ? (
          <>
            <MenuItem component={Link} to="/login" role="button">
              <ListItemIcon className="min-w-40">
                <Icon>lock</Icon>
              </ListItemIcon>
              <ListItemText primary="Login" />
            </MenuItem>
            <MenuItem component={Link} to="/register" role="button">
              <ListItemIcon className="min-w-40">
                <Icon>person_add</Icon>
              </ListItemIcon>
              <ListItemText primary="Register" />
            </MenuItem>
          </>
        ) : (
          <>
            {/*<MenuItem component={Link} to="/pages/profile" onClick={userMenuClose} role="button">
              <ListItemIcon className="min-w-40">
                <Icon>account_circle</Icon>
              </ListItemIcon>
              <ListItemText primary="My Profile" />
            </MenuItem>*/}
            <MenuItem component={Link} onClick={userMenuClose} role="button">
              <ListItemIcon className="min-w-40">
                <Icon>account_circle</Icon>
              </ListItemIcon>
              <ListItemText primary="Elegir perfil" onClick={handleShow} />
            </MenuItem>
            <MenuItem
              onClick={() => {
                dispatch(logoutUser());
                userMenuClose();
              }}
            >
              <ListItemIcon className="min-w-40">
                <Icon>exit_to_app</Icon>
              </ListItemIcon>
              <ListItemText primary="Cerrar Sesión" />
            </MenuItem>
          </>
        )}
      </Popover>
    </>
  );
}

export default UserMenu;
