import React, { useState, useEffect } from 'react';
import {
    Grid,
    Paper,
    Button,
    TextField,
    InputLabel,
    Icon,
    CircularProgress,
    Box,
    FormControlLabel,
    Checkbox,
    FormHelperText
} from "@material-ui/core";
import Formsy from "formsy-react";
import { makeStyles } from '@material-ui/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';

const useStyles = makeStyles(theme => ({
    inputContainer: {
        marginBottom: theme.spacing(2),
    },
    submitButton: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: theme.spacing(2),
    },
    actionButton: {
        marginTop: theme.spacing(2),
        marginRight: theme.spacing(2)
    }
}));

const setDataInitial = {
    empresas: [],
    nombres: '',
    apellidos: '',
    username: '',
    email: '',
    password: '',
    perfiles: []
}

const UsuariosForm = ({ onSubmit, buttonState, initialValues, handleOperacion, empresas, perfiles }) => {
    const classes = useStyles();
    const [formData, setFormData] = useState(setDataInitial);
    const [hasError, setHasError] = useState(false);
    const [key, setKey] = useState(Date.now());

    useEffect(() => {
        if (initialValues) {
            setFormData({
                ...initialValues,
                perfiles: initialValues.perfiles ? initialValues.perfiles.map(perfil => perfil.id) : [],
                empresas: initialValues.empresas ? initialValues.empresas.map(empresa => ({ id: empresa.id, razon_social: empresa.razon_social })) : []
            });
            setKey(Date.now()); // Cambia la clave para forzar el recreo del formulario
        }
    }, [initialValues]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleAutocompleteChange = (event, value) => {
        setFormData({
            ...formData,
            empresas: value.map(empresa => ({ id: empresa.id, razon_social: empresa.razon_social }))
        });
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData((prevState) => {
            const newPerfiles = checked
                ? [...prevState.perfiles, name]
                : prevState.perfiles.filter((perfil) => perfil !== name);
            return { ...prevState, perfiles: newPerfiles };
        });
    };

    const handleFormSubmit = () => {
        if (formData.perfiles.length === 0) {
            setHasError(true);
            return;
        }
        setHasError(false);
        onSubmit(formData);
    };

    const handleCancel = () => {
        handleOperacion('A');
        setFormData(setDataInitial);
        setHasError(false);
        setKey(Date.now()); // Cambia la clave para forzar el recreo del formulario
    };

    return (
        <Box>
            <Formsy key={key} className="flex flex-col justify-center" onSubmit={handleFormSubmit}>
                <Paper className="p-12 mt-16" elevation={3}>
                    <Grid container spacing={2} className={classes.inputContainer}>
                        <Grid item xs={12} md={3}>
                            <TextField
                                name="nombres"
                                label="Nombres"
                                value={formData.nombres}
                                required
                                fullWidth
                                variant="outlined"
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField
                                name="apellidos"
                                label="Apellidos"
                                value={formData.apellidos}
                                required
                                fullWidth
                                variant="outlined"
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField
                                name="username"
                                label="Nombre de usuario"
                                value={formData.username}
                                required
                                fullWidth
                                variant="outlined"
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField
                                name="email"
                                label="Email"
                                type='email'
                                value={formData.email}
                                required
                                fullWidth
                                variant="outlined"
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField
                                name="password"
                                label="Contraseña"
                                type='password'
                                value={formData.password}
                                required
                                fullWidth
                                variant="outlined"
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Autocomplete
                                multiple
                                options={empresas}
                                getOptionLabel={(option) => option.razon_social}
                                onChange={handleAutocompleteChange}
                                renderInput={(params) => (
                                    <TextField {...params} variant="outlined" label="Empresas" fullWidth />
                                )}
                                value={formData.empresas}
                            />
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <InputLabel>Perfiles</InputLabel>
                            {perfiles.map((perfil) => (
                                <FormControlLabel
                                    key={perfil.id}
                                    control={
                                        <Checkbox
                                            checked={formData.perfiles.includes(perfil.id)}
                                            onChange={handleCheckboxChange}
                                            name={perfil.id}
                                        />
                                    }
                                    label={perfil.perfil}
                                />
                            ))}
                            {hasError && (
                                <FormHelperText error>
                                    Debe seleccionar al menos un perfil.
                                </FormHelperText>
                            )}
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} className={classes.submitButton}>
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                            >
                                {buttonState ? <CircularProgress size={20} style={{ color: 'white' }} /> :
                                    <>
                                        <Icon style={{ color: 'white' }}>save</Icon>
                                        Guardar
                                    </>
                                }
                            </Button>

                            <Button
                                variant="contained"
                                color="default"
                                onClick={handleCancel}
                            >
                                <Icon style={{ color: 'white' }}>cancel</Icon>
                                Cancelar
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Formsy>
        </Box>
    );
};

export default UsuariosForm;
