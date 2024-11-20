import {
    Card,
    Button,
    TextField,
    CardContent,
    Typography,
    Link,
    InputAdornment,
    Icon,
    IconButton,
    Hidden,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { yupResolver } from '@hookform/resolvers/yup';
import { darken } from '@material-ui/core/styles/colorManipulator';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { submitLogin } from 'app/auth/store/loginSlice';
import UserService from "app/services/UserService";
import * as yup from 'yup';
import _ from '@lodash';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({
    root: {
        background: `linear-gradient(to right, ${theme.palette.primary.dark} 0%, ${darken(
            theme.palette.primary.dark,
            0.5
        )} 100%)`,
        color: theme.palette.primary.contrastText,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
    },
    leftSection: {
        textAlign: 'center',
        padding: theme.spacing(2),
    },
    rightSection: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    card: {
        borderRadius: '20px', // Ajusta este valor según el nivel de curvatura que desees
    }
}));

const schema = yup.object().shape({
    email: yup.string().required('Ingrese el usuario'),
    password: yup.string().required('Por favor ingrese la contraseña.')
});

const registerSchema = yup.object().shape({
    nombres: yup.string().required('El nombre es obligatorio'),
    apellidos: yup.string().required('El apellido es obligatorio'),
    nro_documento: yup.string().required('El número de documento es obligatorio'),
    email: yup.string().email('Debe ser un correo válido').required('El email es obligatorio'),
    password: yup.string().required('La contraseña es obligatoria'),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password'), null], 'Las contraseñas deben coincidir')
        .required('Debe confirmar su contraseña'),
});

const defaultValues = {
    email: '',
    password: '',
};

const defaultValuesRegister = {
    nombres: '',
    apellidos: '',
    nro_documento: '',
    email: '',
    password: ''
};

function Login() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const login = useSelector(({ auth }) => auth.login);

    const [formData, setFormData] = useState(defaultValuesRegister);

    const { control, setValue, formState, handleSubmit, reset, trigger, setError } = useForm({
        mode: 'onChange',
        defaultValues,
        resolver: yupResolver(schema),
    });

    const { control: registerControl, formState: registerFormState, handleSubmit: handleRegisterSubmit } = useForm({
        mode: 'onChange',
        defaultValues: formData,
        resolver: yupResolver(registerSchema),
    });

    const { isValid, dirtyFields, errors } = formState;
    const { errors: registerErrors, isValid: isRegisterValid } = registerFormState;

    const [showPassword, setShowPassword] = useState(false);
    const [open, setOpen] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    function message(type, message) {
        enqueueSnackbar(message, {
            variant: type,
            autoHideDuration: 3000,
            preventDuplicate: true,
            anchorOrigin: {
                vertical: 'top',
                horizontal: 'right'
            }
        });
    }

    useEffect(() => {
        login.errors.forEach((error) => {
            setError(error.type, {
                type: 'manual',
                message: error.message,
            });
        });
    }, [login.errors, setError]);

    function onSubmit(model) {
        dispatch(submitLogin(model));
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleRegister = async (data) => {

        if (!isRegisterValid) {
            return;
        }

        const { confirmPassword, ...dataToSend } = data;

        dataToSend.usuario = 'invitado'

        const formData = {
            data: dataToSend,
            objeto: 'visitantes',
            operacion: 'A'
        };

        await UserService.register(formData)
            .then(response => {
                if (response.data.status === "success") {
                    message("success", 'Registro completado exitósamente');
                    setFormData(defaultValuesRegister)
                    handleClose();
                } else {
                    message("error", response.data.message);
                }

            }).catch(error => {
                console.log(error);
                message("error", error.message);
            });
    };

    return (
        <div className={clsx(classes.root, 'flex flex-col flex-auto p-16 sm:p-24 md:flex-row md:p-0 overflow-hidden')}>

            <Hidden mdUp>
                <div className={clsx(classes.leftSection, 'flex flex-col items-center')}>
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
                    >
                        <Typography className="text-32 sm:text-44 font-semibold leading-tight">
                            Bienvenido <br />
                            a E-FacturaMaster!
                        </Typography>
                    </motion.div>
                </div>
            </Hidden>

            <Card
                component={motion.div}
                initial={{ x: 200 }}
                animate={{ x: 0 }}
                transition={{ bounceDamping: 0 }}
                className={clsx(classes.card, 'w-full max-w-400 mx-auto m-16 md:m-0')}
                square
                layout
            >
                <CardContent className="flex flex-col items-center justify-center p-16 sm:p-32 md:p-48 md:pt-128">
                    <Typography variant="h6" className="mb-24 font-semibold text-18 sm:text-24">
                        Identificarse
                    </Typography>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1, transition: { delay: 0.1 } }}
                    >
                        <img className="w-128 mb-32" src="assets/images/logos/login.png" alt="logo" />
                    </motion.div>

                    <form
                        name="loginForm"
                        noValidate
                        className="flex flex-col justify-center w-full"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    className="mb-16"
                                    type="text"
                                    error={!!errors.email}
                                    helperText={errors?.email?.message}
                                    label="Usuario"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Icon className="text-20" color="action">
                                                    user
                                                </Icon>
                                            </InputAdornment>
                                        ),
                                    }}
                                    variant="outlined"
                                    required
                                />
                            )}
                        />

                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    className="mb-16"
                                    label="Contraseña"
                                    type={showPassword ? 'text' : 'password'}
                                    error={!!errors.password}
                                    helperText={errors?.password?.message}
                                    variant="outlined"
                                    InputProps={{
                                        className: 'pr-2',
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setShowPassword(!showPassword)}>
                                                    <Icon className="text-20" color="action">
                                                        {showPassword ? 'visibility' : 'visibility_off'}
                                                    </Icon>
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    required
                                />
                            )}
                        />

                        <Button
                            variant="contained"
                            color="primary"
                            className="w-full mx-auto mt-16"
                            aria-label="LOG IN"
                            disabled={_.isEmpty(dirtyFields) || !isValid}
                            type="submit"
                        >
                            Iniciar Sesión
                        </Button>

                        <Button
                            variant="outlined"
                            color="secondary"
                            className="w-full mx-auto mt-16"
                            onClick={handleClickOpen}
                        >
                            Registrarse
                        </Button>
                    </form>
                    {/* <div style={{ marginTop: '10px' }}>
                        <Link href="#" variant="body2">
                            Recuperar contraseña
                        </Link>
                    </div> */}
                </CardContent>
            </Card>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Registro</DialogTitle>
                <DialogContent>
                    <form
                        name="registerForm"
                        noValidate
                        className="flex flex-col justify-center w-full"
                        onSubmit={handleRegisterSubmit(handleRegister)}
                    >
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="nombres"
                                    control={registerControl}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            margin="dense"
                                            label="Nombres"
                                            type="text"
                                            fullWidth
                                            variant="outlined"
                                            error={!!registerErrors.nombres}
                                            helperText={registerErrors?.nombres?.message}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="apellidos"
                                    control={registerControl}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            margin="dense"
                                            label="Apellidos"
                                            type="text"
                                            fullWidth
                                            variant="outlined"
                                            error={!!registerErrors.apellidos}
                                            helperText={registerErrors?.apellidos?.message}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="nro_documento"
                                    control={registerControl}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            margin="dense"
                                            label="Número de Documento"
                                            type="text"
                                            fullWidth
                                            variant="outlined"
                                            error={!!registerErrors.nro_documento}
                                            helperText={registerErrors?.nro_documento?.message}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="email"
                                    control={registerControl}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            margin="dense"
                                            label="Email"
                                            type="email"
                                            fullWidth
                                            variant="outlined"
                                            error={!!registerErrors.email}
                                            helperText={registerErrors?.email?.message}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="password"
                                    control={registerControl}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            margin="dense"
                                            label="Contraseña"
                                            type="password"
                                            fullWidth
                                            variant="outlined"
                                            error={!!registerErrors.password}
                                            helperText={registerErrors?.password?.message}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="confirmPassword"
                                    control={registerControl}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            margin="dense"
                                            label="Confirmar Contraseña"
                                            type="password"
                                            fullWidth
                                            variant="outlined"
                                            error={!!registerErrors.confirmPassword}
                                            helperText={registerErrors?.confirmPassword?.message}
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>

                        <Typography variant="body2" color="error" style={{ marginTop: '16px', fontWeight: 'bold' }}>
                            Por favor, complete los campos obligatorios para proceder con el registro.
                        </Typography>

                        <Typography variant="body2" color="textSecondary" style={{ marginTop: '8px', fontWeight: 'bold' }}>
                            Nota: Use su Número de Documento como usuario para acceder al portal.
                        </Typography>
                        <DialogActions>
                            <Button onClick={handleClose} style={{ color: 'white', backgroundColor: 'red' }}>
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                style={{
                                    color: 'white',
                                    backgroundColor: isRegisterValid ? 'green' : 'gray',
                                    cursor: isRegisterValid ? 'pointer' : 'not-allowed'
                                }}
                                disabled={!isRegisterValid}
                            >
                                Registrarse
                            </Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>


            <Hidden smDown>
                <div className={clsx(classes.rightSection, 'flex flex-col items-center')}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1, transition: { delay: 0.1 } }}
                    >
                        <img style={{ width: '600px', height: '500px' }} className="w-128 mb-32" src="assets/images/logos/logo.png" alt="logo" />
                    </motion.div>
                </div>
            </Hidden>
        </div>
    );
}

export default Login;
