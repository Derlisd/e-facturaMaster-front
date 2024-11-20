import React, { useState, useEffect } from 'react';
import {
    Grid,
    Paper,
    Button,
    TextField,
    Typography,
    Icon,
    CircularProgress,
    Box,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    IconButton
} from "@material-ui/core";
import { Add as AddIcon, Remove as RemoveIcon } from '@material-ui/icons';
import Formsy from "formsy-react";
import { makeStyles } from '@material-ui/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import SucursalesForm from '../SucursalesForm/index';
import PuntosExpedicionDialog from '../PuntosExpedicionDialog/index';

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
    },
    sectionTitleContainer: {
        display: 'flex',
        alignItems: 'center',
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(2),
        fontWeight: 'bold',
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    radioGroup: {
        flexDirection: 'row',
    },
    addButton: {
        marginLeft: theme.spacing(2),
    },
    removeButton: {
        marginTop: theme.spacing(2),
    }
}));

const EmpresasForm = ({ onSubmit, buttonState, editData, initialValues, handleOperacion, tipos_contribuyentes, paises, departamentos, distritos, ciudades }) => {
    const classes = useStyles();
    const [formData, setFormData] = useState(initialValues);
    const [key, setKey] = useState(Date.now());
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedSucursalIndex, setSelectedSucursalIndex] = useState(null);

    useEffect(() => {
        if (editData) {
            setFormData({
                ...initialValues,
                ...editData,
                actividades_economicas: editData.actividades_economicas || [{ codactividad: '', desc_actividad: '', principal: true }],
                sucursales: editData.sucursales || [{ punto_establecimiento: '', descripcion: '', direccion: '', numero_casa: '0', pais_id: '', departamento_id: '', distrito_id: '', ciudad_id: '', telefono: '', email: '', complemento_1: '', complemento_2: '' }],
                timbrados: editData.timbrados || [{ num_timbrado: '', fecha_inicio: '', id_csc: '001', csc: 'ABCD0000000000000000000000000000', ambiente: 'test' }]
            });
            setKey(Date.now()); // Cambia la clave para forzar el recreo del formulario
        }
    }, [editData]);

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
            tipo_contribuyente: value ? value.id : ''
        });
    };

    const handleActivityChange = (index, e) => {
        const { name, value } = e.target;
        const newActivities = formData.actividades_economicas.map((activity, i) => {
            if (i === index) {
                return { ...activity, [name]: value };
            }
            return activity;
        });
        setFormData({ ...formData, actividades_economicas: newActivities });
    };

    const handleActivityTypeChange = (index, e) => {
        const { value } = e.target;
        const newActivities = formData.actividades_economicas.map((activity, i) => {
            if (i === index) {
                return { ...activity, principal: value };
            }
            return activity;
        });
        setFormData({ ...formData, actividades_economicas: newActivities });
    };

    const handleAddActivity = () => {
        setFormData({
            ...formData,
            actividades_economicas: [...formData.actividades_economicas, { codactividad: '', desc_actividad: '', principal: true }]
        });
    };

    const handleRemoveActivity = (index) => {
        const newActivities = formData.actividades_economicas.filter((_, i) => i !== index);
        setFormData({ ...formData, actividades_economicas: newActivities });
    };

    const handleTimbradoChange = (index, e) => {
        const { name, value } = e.target;
        const newTimbrados = formData.timbrados.map((timbrado, i) => {
            if (i === index) {
                return { ...timbrado, [name]: value };
            }
            return timbrado;
        });
        setFormData({ ...formData, timbrados: newTimbrados });
    };

    const handleFormSubmit = () => {
        onSubmit(formData);
    };

    const handleCancel = () => {
        handleOperacion('A');
        setFormData(initialValues);
        setKey(Date.now()); // Cambia la clave para forzar el recreo del formulario
    };

    const handleOpenDialog = (index) => {
        setSelectedSucursalIndex(index);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    return (
        <Box>
            <Formsy key={key} className="flex flex-col justify-center" onSubmit={handleFormSubmit}>
                <Paper className="p-12 mt-16" elevation={3}>
                    <Grid container spacing={2} className={classes.inputContainer}>
                        <Grid item xs={12} md={2}>
                            <TextField
                                name="ruc"
                                label="Ruc"
                                value={formData.ruc}
                                required
                                fullWidth
                                variant="outlined"
                                onChange={handleChange}
                                inputProps={{ maxLength: 8 }}
                            />
                        </Grid>
                        <Grid item xs={12} md={1}>
                            <TextField
                                name="dv"
                                label="Dv"
                                value={formData.dv}
                                required
                                fullWidth
                                variant="outlined"
                                onChange={handleChange}
                                inputProps={{ maxLength: 1 }}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField
                                name="razon_social"
                                label="Razon Social"
                                value={formData.razon_social}
                                required
                                fullWidth
                                variant="outlined"
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField
                                name="nombre_fantasia"
                                label="Nombre Fantasía"
                                value={formData.nombre_fantasia}
                                fullWidth
                                variant="outlined"
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Autocomplete
                                options={tipos_contribuyentes}
                                getOptionLabel={(option) => option.descripcion}
                                onChange={handleAutocompleteChange}
                                renderInput={(params) => (
                                    <TextField {...params} label="Tipo contribuyente" variant="outlined" fullWidth />
                                )}
                                value={tipos_contribuyentes.find(tipo_contribuyente => tipo_contribuyente.id === formData.tipo_contribuyente) || null}
                            />
                        </Grid>
                    </Grid>

                    {/* Sección de Actividades Económicas */}
                    <Grid container alignItems="center" className={classes.sectionTitleContainer}>
                        <Grid item>
                            <Typography variant="h6">
                                Actividades Económicas
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="default"
                                className={classes.addButton}
                                onClick={handleAddActivity}
                            >
                                <AddIcon /> Agregar Actividad
                            </Button>
                        </Grid>
                    </Grid>
                    {formData.actividades_economicas.map((activity, index) => (
                        <Grid container spacing={2} className={classes.inputContainer} key={index}>
                            <Grid item xs={12} md={2}>
                                <TextField
                                    name="codactividad"
                                    label="Código Actividad"
                                    value={activity.codactividad}
                                    required
                                    fullWidth
                                    variant="outlined"
                                    onChange={(e) => handleActivityChange(index, e)}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    name="desc_actividad"
                                    label="Descripción Actividad"
                                    value={activity.desc_actividad}
                                    required
                                    fullWidth
                                    variant="outlined"
                                    onChange={(e) => handleActivityChange(index, e)}
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <FormControl component="fieldset" className={classes.formControl}>
                                    <FormLabel component="legend">Tipo</FormLabel>
                                    <RadioGroup
                                        name="principal"
                                        value={String(activity.principal)}
                                        onChange={(e) => handleActivityTypeChange(index, e)}
                                        className={classes.radioGroup}
                                    >
                                        <FormControlLabel value="true" control={<Radio />} label="Principal" />
                                        <FormControlLabel value="false" control={<Radio />} label="Secundario" />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={1} className={classes.removeButton}>
                                <IconButton onClick={() => handleRemoveActivity(index)}>
                                    <RemoveIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    ))}

                    {/* Sección de Sucursales */}
                    <SucursalesForm
                        sucursales={formData.sucursales}
                        handleOpenDialog={handleOpenDialog}
                        paises={paises}
                        departamentos={departamentos}
                        distritos={distritos}
                        ciudades={ciudades}
                        setFormData={setFormData}
                        formData={formData}
                        classes={classes}
                    />

                    <PuntosExpedicionDialog
                        open={openDialog}
                        handleClose={handleCloseDialog}
                        puntosExpedicion={formData.sucursales[selectedSucursalIndex]?.puntos_expedicion || []}
                        index={selectedSucursalIndex}
                        setFormData={setFormData}
                        formData={formData}
                    />

                    {/* Sección de Timbrados */}
                    <Typography variant="h6" className={classes.sectionTitleContainer}>
                        Timbrado
                    </Typography>
                    <Grid container spacing={2} className={classes.inputContainer}>
                        <Grid item xs={12} md={2}>
                            <TextField
                                name="num_timbrado"
                                label="Número Timbrado"
                                value={formData.timbrados[0].num_timbrado}
                                required
                                fullWidth
                                variant="outlined"
                                onChange={(e) => handleTimbradoChange(0, e)}
                            />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <TextField
                                name="fecha_inicio"
                                label="Fecha Inicio"
                                type="date"
                                value={formData.timbrados[0].fecha_inicio}
                                required
                                fullWidth
                                variant="outlined"
                                onChange={(e) => handleTimbradoChange(0, e)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <TextField
                                name="id_csc"
                                label="ID CSC"
                                value={formData.timbrados[0].id_csc}
                                required
                                fullWidth
                                variant="outlined"
                                onChange={(e) => handleTimbradoChange(0, e)}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField
                                name="csc"
                                label="CSC"
                                value={formData.timbrados[0].csc}
                                required
                                fullWidth
                                variant="outlined"
                                onChange={(e) => handleTimbradoChange(0, e)}
                            />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <FormControl component="fieldset" className={classes.formControl}>
                                <FormLabel component="legend">Ambiente</FormLabel>
                                <RadioGroup
                                    name="ambiente"
                                    value={formData.timbrados[0].ambiente}
                                    onChange={(e) => handleTimbradoChange(0, e)}
                                    className={classes.radioGroup}
                                >
                                    <FormControlLabel value="prod" control={<Radio />} label="Producción" />
                                    <FormControlLabel value="test" control={<Radio />} label="Test" />
                                </RadioGroup>
                            </FormControl>
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

export default EmpresasForm;
