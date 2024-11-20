import React, { useState, useEffect } from 'react';
import {
    Grid,
    Paper,
    Button,
    TextField,
    Icon,
    CircularProgress,
    Box
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
    empresa: '',
    username: '',
    email: '',
    password: ''
}

const UsuariosFuncionalesForm = ({ onSubmit, buttonState, initialValues, handleOperacion, empresas }) => {
    const classes = useStyles();
    const [formData, setFormData] = useState(setDataInitial);
    const [key, setKey] = useState(Date.now());

    useEffect(() => {
        if (initialValues) {
            setFormData({
                ...initialValues
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
            empresa: value ? value.id : ''
        });
    };

    const handleFormSubmit = () => {
        onSubmit(formData);
    };

    const handleCancel = () => {
        handleOperacion('A');
        setFormData(setDataInitial);
        setKey(Date.now()); // Cambia la clave para forzar el recreo del formulario
    };

    return (
        <Box>
            <Formsy key={key} className="flex flex-col justify-center" onSubmit={handleFormSubmit}>
                <Paper className="p-12 mt-16" elevation={3}>
                    <Grid container spacing={2} className={classes.inputContainer}>
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
                                options={empresas}
                                getOptionLabel={(option) => option.razon_social}
                                onChange={handleAutocompleteChange}
                                variant="outlined"
                                renderInput={(params) => (
                                    <TextField {...params} variant="outlined" label="Empresa" fullWidth />
                                )}
                                value={empresas.find(empresa => empresa.id === formData.empresa) || null}
                            />
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

export default UsuariosFuncionalesForm;