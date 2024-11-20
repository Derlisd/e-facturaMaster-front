import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Grid, InputLabel, Select, MenuItem, FormControl, IconButton
} from "@material-ui/core";
import { useSnackbar } from 'notistack';
import { Add as AddIcon, Remove as RemoveIcon } from '@material-ui/icons';
import ControllerService from 'app/services/ControllerService';

const PuntosExpedicionDialog = ({ open, setFormData, formData, handleClose, puntosExpedicion, index }) => {
    const [puntos, setPuntos] = useState(puntosExpedicion || []);
    const [tipos_documentos, setTiposDocumentos] = useState([]);
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
        fetchTiposDocumentos()
    }, []);

    async function fetchTiposDocumentos() {
        const data = {
            objeto: 'tipo_documento',
            operacion: 'C'
        };

        await ControllerService.controller(data)
            .then(response => {
                if (response.data.status === "success") {
                    setTiposDocumentos(response.data.data);
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

    useEffect(() => {
        setPuntos(puntosExpedicion);
    }, [puntosExpedicion]);

    const handlePuntosExpedicionChange = (index, puntosExpedicion) => {
        const newSucursales = [...formData.sucursales];
        newSucursales[index].puntos_expedicion = puntosExpedicion;
        setFormData({ ...formData, sucursales: newSucursales });
    };

    const handleChange = (e, index) => {
        const { name, value } = e.target;
        const newPuntos = [...puntos];

        newPuntos[index] = { ...newPuntos[index], [name]: value };

        setPuntos(newPuntos);
    };

    const handleAddPunto = () => {
        setPuntos([...puntos, { punto_expedicion: '', tipo_documento: '1', num_inicial: '0000001', descripcion: '', eslogan: '' }]);
    };

    const handleRemovePunto = (index) => {
        const newPuntos = puntos.filter((_, i) => i !== index);
        setPuntos(newPuntos);
    };

    const handleSave = () => {
        handlePuntosExpedicionChange(index, puntos);
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        Puntos de Expedición
                    </Grid>
                    <Grid item>
                        <Button
                            variant="contained"
                            color="default"
                            onClick={handleAddPunto}
                            startIcon={<AddIcon />}
                        >
                            Agregar
                        </Button>
                    </Grid>
                </Grid>
            </DialogTitle>
            <DialogContent>
                {puntos.map((punto, index) => (
                    <Grid container spacing={2} key={index}>
                        <Grid item xs={12} md={3}>
                            <TextField
                                label="Punto de Expedición"
                                name="punto_expedicion"
                                value={punto.punto_expedicion}
                                onChange={(e) => handleChange(e, index)}
                                variant="outlined"
                                fullWidth
                                inputProps={{
                                    minLength: 3,
                                    maxLength: 3
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <FormControl fullWidth variant="outlined" required>
                                <InputLabel>Tipo Documento</InputLabel>
                                <Select
                                    name="tipo_documento"
                                    value={punto.tipo_documento}
                                    onChange={(e) => handleChange(e, index)}
                                    label="Tipo Documento"
                                    fullWidth
                                >
                                    {tipos_documentos.map(tipo_documento => (
                                        <MenuItem key={tipo_documento.id} value={tipo_documento.id}>
                                            {tipo_documento.descripcion}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField
                                label="Número Inicial"
                                name="num_inicial"
                                value={punto.num_inicial}
                                onChange={(e) => handleChange(e, index)}
                                variant="outlined"
                                fullWidth
                                inputProps={{
                                    minLength: 7,
                                    maxLength: 7
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} md={5}>
                            <TextField
                                label="Descripción"
                                name="descripcion"
                                value={punto.descripcion}
                                onChange={(e) => handleChange(e, index)}
                                variant="outlined"
                                fullWidth
                                inputProps={{
                                    minLength: 0,
                                    maxLength: 255
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} md={5}>
                            <TextField
                                label="Eslogan para logo en el KUDE"
                                name="eslogan"
                                value={punto.eslogan}
                                onChange={(e) => handleChange(e, index)}
                                variant="outlined"
                                fullWidth
                                inputProps={{
                                    minLength: 0,
                                    maxLength: 255
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} md={1}>
                            <IconButton onClick={() => handleRemovePunto(index)} color="secondary">
                                <RemoveIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                ))}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancelar</Button>
                <Button onClick={handleSave}>Aceptar</Button>
            </DialogActions>
        </Dialog>

    );
};

export default PuntosExpedicionDialog;
