import React, { useState, useEffect } from "react";
import {
    Typography,
    Grid,
    Box
} from "@material-ui/core";
import { useSelector } from "react-redux";
import { makeStyles } from '@material-ui/styles';
import CertificadosService from 'app/services/CertificadosService';
import { useSnackbar } from 'notistack';
import CertificadosListItem from "app/components/CertificadosListItem";
import CertificadoForm from 'app/components/CertificadosForm';
import { selectEmpresaId } from '../../store/selectors/empresaSelectors';

const useStyles = makeStyles(theme => ({
    dialogPaper: {
        width: '100%',
        maxWidth: '800px'
    },
    container: {
        padding: theme.spacing(2),
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: theme.shadows[3],
        margin: theme.spacing(2),
        width: '100%'
    },
    listContainer: {
        padding: theme.spacing(2),
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: theme.shadows[3],
        margin: theme.spacing(2),
        width: '100%' // Make the list container take the full width
    }
}));

function Certificados() {
    const user = useSelector(({ auth }) => auth.user);
    let empresa = useSelector(selectEmpresaId);
    const usuario = user.data.username;
    const privilegios = user.data.privilegios.map(privilegio => privilegio.cod_privilegio);

    const hasAltaCertificados = privilegios.includes('alta_certificados');
    const hasConCertificados = privilegios.includes('con_certificados');

    const classes = useStyles();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [certificados, handleCertificados] = useState([]);
    const [buttonState, handlebuttonState] = useState(false);

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
        if (hasConCertificados) {
            fetchCertificados();
        }
    }, [hasConCertificados]);

    async function fetchCertificados() {
        await CertificadosService.getList()
            .then(response => {
                if (response.data.status === "success") {
                    handleCertificados(response.data.data);
                    if (response.data.data.length === 0) {
                        message("error", 'No se encontraron resultados');
                    }
                } else {
                    message("error", response.data.message);
                }
            }).catch(error => {
                console.log(error);
                message("error", error.message);
            });
    }

    async function handleGuardar({ file, pin }, resetForm) {
        handlebuttonState(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('pin', pin);
        formData.append('usuario', usuario);
        formData.append('empresa', empresa);

        await CertificadosService.guardar(formData)
            .then(response => {
                handlebuttonState(false);
                if (response.data.status === "success") {
                    message("success", response.data.message);
                    fetchCertificados();
                    resetForm(); // Reset form fields
                } else {
                    message("error", response.data.message);
                }
            }).catch(error => {
                console.log(error);
                message("error", error.message);
                handlebuttonState(false);
            });
    }

    return (
        <div className="p-24 flex flex-1 justify-center">
            {hasAltaCertificados && (
                <Box className={classes.container}>
                    <Typography className="h2 mb-24" align="center">
                        Certificado Digital
                    </Typography>
                    <CertificadoForm
                        onSubmit={handleGuardar}
                        buttonState={buttonState}
                        message={message}
                    />
                </Box>
            )}

            {hasConCertificados && (
                <Box className={classes.listContainer}>
                    <Grid item xs={12} md={12}>
                        {certificados.length > 0 ?
                            <CertificadosListItem
                                registro={certificados}
                            >
                            </CertificadosListItem>
                            : ''}
                    </Grid>
                </Box>
            )}
        </div>
    );
}

export default Certificados;
