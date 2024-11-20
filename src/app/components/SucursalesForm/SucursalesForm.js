import React from 'react';
import { Grid, TextField, IconButton, Button, Typography } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Add as AddIcon, Remove as RemoveIcon } from '@material-ui/icons';

const SucursalesForm = ({ sucursales, handleOpenDialog, paises, departamentos, distritos, ciudades, setFormData, formData, classes }) => {

    const handleSucursalChange = (index, e) => {
        const { name, value } = e.target;
        const newSucursales = formData.sucursales.map((sucursal, i) => {
            if (i === index) {
                return { ...sucursal, [name]: value };
            }
            return sucursal;
        });
        setFormData({ ...formData, sucursales: newSucursales });
    };
    // Función para agregar una nueva sucursal
    const handleAddSucursal = () => {
        setFormData({
            ...formData,
            sucursales: [
                ...formData.sucursales,
                {
                    punto_establecimiento: '',
                    descripcion: '',
                    direccion: '',
                    numero_casa: '0',
                    pais_id: '',
                    departamento_id: '',
                    distrito_id: '',
                    ciudad_id: '',
                    telefono: '',
                    email: '',
                    complemento_1: '',
                    complemento_2: '',
                    puntos_expedicion: [{
                        punto_expedicion: '',
                        tipo_documento: '',
                        serie_comprobante: '',
                        num_inicial: ''
                    }]
                }
            ]
        });
    };

    const handleRemoveSucursal = (index) => {
        const newSucursales = formData.sucursales.filter((_, i) => i !== index);
        setFormData({ ...formData, sucursales: newSucursales });
    };


    return (
        <>
            <Grid container alignItems="center" className={classes.sectionTitleContainer}>
                <Grid item>
                    <Typography variant="h6">
                        Sucursales
                    </Typography>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color="default"
                        className={classes.addButton}
                        onClick={handleAddSucursal}
                    >
                        <AddIcon /> Agregar Sucursal
                    </Button>
                </Grid>
            </Grid>

            {sucursales.map((sucursal, index) => (
                <Grid container spacing={2} key={index}>
                    <Grid item xs={12} md={2}>
                        <TextField
                            name="punto_establecimiento"
                            label="Punto Establecimiento"
                            value={sucursal.punto_establecimiento}
                            required
                            fullWidth
                            variant="outlined"
                            onChange={(e) => handleSucursalChange(index, e)}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            name="descripcion"
                            label="Descripción"
                            value={sucursal.descripcion}
                            required
                            fullWidth
                            variant="outlined"
                            onChange={(e) => handleSucursalChange(index, e)}
                        />
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <TextField
                            name="direccion"
                            label="Dirección"
                            value={sucursal.direccion}
                            required
                            fullWidth
                            variant="outlined"
                            onChange={(e) => handleSucursalChange(index, e)}
                        />
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <TextField
                            name="numero_casa"
                            label="Número Casa"
                            value={sucursal.numero_casa}
                            required
                            fullWidth
                            variant="outlined"
                            onChange={(e) => handleSucursalChange(index, e)}
                        />
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Autocomplete
                            options={paises}
                            getOptionLabel={(option) => option.descripcion}
                            onChange={(e, value) => handleSucursalChange(index, { target: { name: 'pais_id', value: value ? value.id : '' } })}
                            renderInput={(params) => (
                                <TextField {...params} label="País" variant="outlined" fullWidth />
                            )}
                            value={paises.find(pais => pais.id === sucursal.pais_id) || null}
                        />
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Autocomplete
                            options={departamentos.filter(depto => depto.pais_id === sucursal.pais_id)}
                            getOptionLabel={(option) => option.descripcion}
                            onChange={(e, value) => handleSucursalChange(index, { target: { name: 'departamento_id', value: value ? value.id : '' } })}
                            renderInput={(params) => (
                                <TextField {...params} label="Departamento" variant="outlined" fullWidth />
                            )}
                            value={departamentos.find(depto => depto.id === sucursal.departamento_id) || null}
                        />
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Autocomplete
                            options={distritos.filter(dist => dist.departamento_id === sucursal.departamento_id)}
                            getOptionLabel={(option) => option.descripcion}
                            onChange={(e, value) => handleSucursalChange(index, { target: { name: 'distrito_id', value: value ? value.id : '' } })}
                            renderInput={(params) => (
                                <TextField {...params} label="Distrito" variant="outlined" fullWidth />
                            )}
                            value={distritos.find(dist => dist.id === sucursal.distrito_id) || null}
                        />
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Autocomplete
                            options={ciudades.filter(ciudad => ciudad.distrito_id === sucursal.distrito_id)}
                            getOptionLabel={(option) => option.descripcion}
                            onChange={(e, value) => handleSucursalChange(index, { target: { name: 'ciudad_id', value: value ? value.id : '' } })}
                            renderInput={(params) => (
                                <TextField {...params} label="Ciudad" variant="outlined" fullWidth />
                            )}
                            value={ciudades.find(ciudad => ciudad.id === sucursal.ciudad_id) || null}
                        />
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <TextField
                            name="telefono"
                            label="Teléfono"
                            value={sucursal.telefono}
                            required
                            fullWidth
                            variant="outlined"
                            onChange={(e) => handleSucursalChange(index, e)}
                        />
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <TextField
                            name="email"
                            label="Email"
                            value={sucursal.email}
                            required
                            fullWidth
                            variant="outlined"
                            onChange={(e) => handleSucursalChange(index, e)}
                        />
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <TextField
                            name="complemento_1"
                            label="Complemento 1"
                            value={sucursal.complemento_1}
                            fullWidth
                            variant="outlined"
                            onChange={(e) => handleSucursalChange(index, e)}
                        />
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <TextField
                            name="complemento_2"
                            label="Complemento 2"
                            value={sucursal.complemento_2}
                            fullWidth
                            variant="outlined"
                            onChange={(e) => handleSucursalChange(index, e)}
                        />
                    </Grid>
                    <Grid item xs={12} md={1} className={classes.removeButton}>
                        <IconButton title='Remover Sucursal' onClick={() => handleRemoveSucursal(index)}>
                            <RemoveIcon />
                        </IconButton>
                        <IconButton title='Agregar Puntos de Expedición' onClick={() => handleOpenDialog(index)}>
                            <AddIcon />
                        </IconButton>
                    </Grid>

                </Grid>
            ))}
        </>
    );
};

export default SucursalesForm;
