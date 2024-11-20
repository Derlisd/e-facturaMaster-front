import React, { useState } from 'react';
import {
    Grid,
    Paper,
    Button,
    TextField,
    InputLabel,
    Icon,
    CircularProgress,
    InputAdornment,
    IconButton,
    Box,
    Typography
} from "@material-ui/core";
import { Visibility, VisibilityOff, CloudUpload } from '@material-ui/icons';
import Formsy from "formsy-react";
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        //height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(2),
        boxSizing: 'border-box',
    },
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
        width: '100%',
        flexWrap: 'wrap',
    },
    infoContainer: {
        padding: theme.spacing(3),
        flex: '1 1 300px',
        maxWidth: '700px',
        margin: theme.spacing(1),
        boxSizing: 'border-box',
    },
    formContainer: {
        padding: theme.spacing(3),
        flex: '1 1 300px',
        maxWidth: '700px',
        margin: theme.spacing(1),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
    },
    hiddenInput: {
        display: 'none'
    },
    uploadButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: theme.spacing(2)
    },
    inputContainer: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    submitButton: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: theme.spacing(2),
    },
    infoText: {
        marginBottom: theme.spacing(2),
    },
}));

const CertificadoForm = ({ onSubmit, buttonState, message }) => {
    const classes = useStyles();
    const [pin, setPin] = useState('');
    const [showPin, setShowPin] = useState(false);
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        const fileExtension = selectedFile.name.split('.').pop().toLowerCase();

        if (fileExtension !== 'pfx' && fileExtension !== 'p12') {
            message("error", "Solo se permiten archivos .pfx o .p12");
            e.target.value = null;  // Clear the selected file
        } else {
            setFile(selectedFile);
        }
    };

    const handleFormSubmit = () => {
        onSubmit({ file, pin }, resetForm);
    };

    const resetForm = () => {
        setFile(null);
        setPin('');
    };

    return (
        <Box className={classes.root}>
            <div className={classes.container}>
                <Paper className={classes.infoContainer} elevation={3}>
                    <Typography variant="h6" className={classes.infoText}>
                        ¿Qué es un certificado digital?
                    </Typography>
                    <Typography variant="body1" className={classes.infoText}>
                        Un certificado digital es un archivo que se utiliza para asegurar la autenticidad e integridad de un mensaje, documento o transacción electrónica. Contiene información sobre la identidad del propietario del certificado y la clave pública necesaria para verificar firmas digitales.
                    </Typography>
                    <Typography variant="h6" className={classes.infoText}>
                        ¿Qué es el PIN?
                    </Typography>
                    <Typography variant="body1" className={classes.infoText}>
                        El PIN es un número de identificación personal que se utiliza para proteger el acceso a tu certificado digital. Es necesario para autenticar y firmar documentos digitalmente.
                    </Typography>
                </Paper>
                <Formsy className="flex flex-col justify-center" onSubmit={handleFormSubmit}>
                    <Paper className={classes.formContainer} elevation={3}>
                        <Grid container spacing={2} className={classes.inputContainer}>
                            <Grid item xs={12}>
                                <InputLabel>Certificado *</InputLabel>
                                <input
                                    accept=".pfx,.p12"
                                    className={classes.hiddenInput}
                                    id="upload-file"
                                    type="file"
                                    onChange={handleFileChange}
                                />
                                <label htmlFor="upload-file">
                                    <Button
                                        variant="outlined"
                                        color="default"
                                        component="span"
                                        startIcon={<CloudUpload />}
                                        className={classes.uploadButton}
                                    >
                                        {file ? file.name : "Seleccionar archivo"}
                                    </Button>
                                </label>
                            </Grid>
                            <Grid item xs={12}>
                                <InputLabel>Pin *</InputLabel>
                                <TextField
                                    type={showPin ? 'text' : 'password'}
                                    value={pin}
                                    variant="outlined"
                                    required
                                    fullWidth
                                    onChange={e => setPin(e.target.value)}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() => setShowPin(!showPin)}
                                                >
                                                    {showPin ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} className={classes.submitButton}>
                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                >
                                    {buttonState ? <CircularProgress size={20} style={{ color: 'white' }} /> :
                                        <>
                                            <Icon style={{ color: 'white' }}>save</Icon> Validar y guardar
                                        </>
                                    }
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Formsy>
            </div>
        </Box>
    );
};

export default CertificadoForm;
