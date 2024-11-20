import React, { useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { useSelector, useDispatch } from 'react-redux';
import { setEmpresaId } from '../../store/fuse/empresaSlice';
import { selectEmpresaId } from '../../store/selectors/empresaSelectors';
import {
  MenuItem,
  FormControl,
  Select,
  InputLabel
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    '&.user': {
      '& .username, & .email': {
        transition: theme.transitions.create('opacity', {
          duration: theme.transitions.duration.shortest,
          easing: theme.transitions.easing.easeInOut,
        }),
      },
    },
  },
  avatar: {
    background: theme.palette.background.default,
    transition: theme.transitions.create('all', {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.easeInOut,
    }),
    bottom: 0,
    '& > img': {
      borderRadius: '50%',
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 250,
    '& .MuiInputBase-root': {
      color: 'white',
    },
    '& .MuiInputLabel-root': {
      color: 'white',
    },
    '& .MuiSelect-icon': {
      color: 'white',
    },
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    maxWidth: '100%',
    padding: theme.spacing(1), // Agregado para dar algo de espacio alrededor del texto
  },
  userName: {
    fontWeight: 'bold',
    wordBreak: 'break-word', // Esto permitirá que el nombre se divida en varias líneas si es necesario
  },
  userEmail: {
    fontSize: '0.875rem',
    opacity: 0.75,
    wordBreak: 'break-word', // También puede aplicarse al correo si se considera necesario
  }
}));

const CustomSelect = withStyles({
  root: {
    color: 'white',
  },
  icon: {
    color: 'white',
  },
})(Select);

const CustomInputLabel = withStyles({
  root: {
    color: 'white',
  },
})(InputLabel);

function UserNavbarHeader(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector(({ auth }) => auth.user);
  const selectedEmpresaId = useSelector(selectEmpresaId);

  // Verifica si user.data existe antes de acceder a propiedades internas
  const empresas = user?.data?.empresas || [];
  const userRole = user?.data?.role || '';

  useEffect(() => {
    if (userRole !== 'consulta' && empresas.length > 0) {
      const savedEmpresaId = localStorage.getItem('selectedEmpresaId');
      if (savedEmpresaId && empresas.some(e => e.id === savedEmpresaId)) {
        dispatch(setEmpresaId(savedEmpresaId));
      } else {
        dispatch(setEmpresaId(empresas[0].id));
      }
    }
  }, [dispatch, selectedEmpresaId, empresas, userRole]);

  const handleChange = (event) => {
    const newEmpresaId = event.target.value;
    dispatch(setEmpresaId(newEmpresaId));
    localStorage.setItem('selectedEmpresaId', newEmpresaId);
  };

  // Verifica si user.data existe antes de renderizar contenido dependiente
  if (!user?.data) {
    return null; // O un fallback adecuado, como un indicador de carga o un mensaje de error
  }

  return (
    <AppBar
      position="static"
      color="primary"
      classes={{ root: classes.root }}
      className={clsx(classes.appBar, "user relative flex flex-col items-center justify-center pt-24 pb-64 mb-32 z-0 shadow-0")}
    >
      {userRole !== 'consulta' && empresas.length > 0 ? (
        <FormControl variant="filled" className={classes.formControl}>
          <CustomInputLabel id="empresa-select-label">Empresa</CustomInputLabel>
          <CustomSelect
            labelId="empresa-select-label"
            id="empresa-select"
            value={selectedEmpresaId || ''}
            onChange={handleChange}
          >
            {empresas.map((empresa) => (
              <MenuItem key={empresa.id} value={empresa.id}>
                {empresa.razon_social}
              </MenuItem>
            ))}
          </CustomSelect>
        </FormControl>
      ) : (
        <div className={classes.userInfo}>
          <Typography className={classes.userName} color="inherit">
            Bienvenido, {user.data.displayName}.
          </Typography>
          <Typography className={classes.userEmail} color="inherit">
            {user.data.email}
          </Typography>
        </div>
      )}
    </AppBar>
  );
}

export default UserNavbarHeader;