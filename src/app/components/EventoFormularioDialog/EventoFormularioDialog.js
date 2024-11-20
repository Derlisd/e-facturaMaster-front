import React, { useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, MenuItem, Grid } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ControllerService from 'app/services/ControllerService';
import Formsy from 'formsy-react';


const initialFormData = {
    tipoEve: '',
    cdc: '',
    mOtEve: '',
    iTiDE: '',
    dNumTim: '',
    dEst: '',
    dPunExp: '',
    dNumIn: '',
    dNumFin: '',
    dSerieNum: '',
    iNatRec: '',
    iTiOpe: '',
    iTiContRec: '',
    dRucRec: '',
    dDVRec: '',
    iTipIDRec: '',
    dNumIDRec: '',
    dNomRec: '',
    dNomFanRec: '',
    dDirRec: '',
    dNumCasRec: '',
    cPaisRec: '',
    cDepRec: '',
    cDisRec: '',
    cCiuRec: '',
    dTelRec: '',
    dCelRec: '',
    dEmailRec: '',
    dCodCliente: ''
};

const EventoFormularioDialog = ({ open, onClose, evento, onSubmit, documento_electronico }) => {
    const [formData, setFormData] = useState(initialFormData);
    const [paises, setPaises] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);
    const [distritos, setDistritos] = useState([]);
    const [ciudades, setCiudades] = useState([]);
    const [tipoContribuyente, setTipoContribuyentes] = useState([]);
    const [naturalezaReceptor, setNaturalezaReceptor] = useState([]);
    const [tipoOperacion, setTipoOperacion] = useState([]);
    const [tipoDocumentoIdentidad, setTipoDocumentoIdentidad] = useState([]);
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        if (documento_electronico) {
            setFormData({
                ...initialFormData,
                tipoEve: evento === 'Cancelación' ? 'ECAN' : evento === 'Inutilización' ? 'EINU' : 'EINO',
                iTiDE: documento_electronico.cod_tipo_documento,
                cdc: documento_electronico.cdc,
                dNumTim: documento_electronico.num_timbrado,
                dEst: documento_electronico.nro_documento.split('-')[0],
                dPunExp: documento_electronico.nro_documento.split('-')[1],
                dNumIn: documento_electronico.nro_documento.split('-')[2],
                dNumFin: documento_electronico.nro_documento.split('-')[2]
            });
        }
    }, [documento_electronico]);

    useEffect(() => {
        if (open) {
            fetchPaises();
            fetchTiposContribuyentes();
            fetchNaturalezaReceptor();
            fetchTipoOperacion();
            fetchTipoDocumentoIdentidad();
        }
    }, [open]);

    useEffect(() => {
        if (formData.cPaisRec) {
            fetchDepartamentos(formData.cPaisRec);
        }
    }, [formData.cPaisRec]);

    useEffect(() => {
        if (formData.cDepRec) {
            fetchDistritos(formData.cDepRec);
        }
    }, [formData.cDepRec]);

    useEffect(() => {
        if (formData.cDisRec) {
            fetchCiudades(formData.cDisRec);
        }
    }, [formData.cDisRec]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    async function fetchPaises() {
        const data = { objeto: 'paises', operacion: 'C' };
        try {
            const response = await ControllerService.controller(data);
            if (response.data.status === "success") {
                setPaises(response.data.data);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    async function fetchDepartamentos(pais_id) {
        const data = { objeto: 'departamentos', operacion: 'C', pais_id };
        try {
            const response = await ControllerService.controller(data);
            if (response.data.status === "success") {
                setDepartamentos(response.data.data);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    async function fetchDistritos(departamento_id) {
        const data = { objeto: 'distritos', operacion: 'C', departamento_id };
        try {
            const response = await ControllerService.controller(data);
            if (response.data.status === "success") {
                setDistritos(response.data.data);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    async function fetchCiudades(distrito_id) {
        const data = { objeto: 'ciudades', operacion: 'C', distrito_id };
        try {
            const response = await ControllerService.controller(data);
            if (response.data.status === "success") {
                setCiudades(response.data.data);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    async function fetchTiposContribuyentes() {
        const data = { objeto: 'tipo_contribuyente', operacion: 'C' };
        try {
            const response = await ControllerService.controller(data);
            if (response.data.status === "success") {
                setTipoContribuyentes(response.data.data);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    async function fetchNaturalezaReceptor() {
        const data = { objeto: 'naturaleza_receptor', operacion: 'C' };
        try {
            const response = await ControllerService.controller(data);
            if (response.data.status === "success") {
                setNaturalezaReceptor(response.data.data);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    async function fetchTipoOperacion() {
        const data = { objeto: 'tipo_operacion', operacion: 'C' };
        try {
            const response = await ControllerService.controller(data);
            if (response.data.status === "success") {
                setTipoOperacion(response.data.data);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    async function fetchTipoDocumentoIdentidad() {
        const data = { objeto: 'tipo_documento_identidad', operacion: 'C' };
        try {
            const response = await ControllerService.controller(data);
            if (response.data.status === "success") {
                setTipoDocumentoIdentidad(response.data.data);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    const handlePaisChange = (event, value) => {
        handleChange({
            target: {
                name: 'pais_id',
                value: value ? value.codigo : ''
            }
        });
    };

    const handleDepartamentoChange = (event, value) => {
        handleChange({
            target: {
                name: 'departamento_id',
                value: value ? value.codigo : ''
            }
        });
    };

    const handleDistritoChange = (event, value) => {
        handleChange({
            target: {
                name: 'distrito_id',
                value: value ? value.codigo : ''
            }
        });
    };

    const handleCiudadChange = (event, value) => {
        handleChange({
            target: {
                name: 'ciudad_id',
                value: value ? value.codigo : ''
            }
        });
    };

    const handleFormSubmit = () => {
        onSubmit(formData);
    };

    const renderFormulario = () => {
        if (!formData) return null;

        switch (evento) {
            case 'Cancelación':
                return (
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                name="cdc"
                                label="CDC"
                                value={formData.cdc}
                                required
                                fullWidth
                                variant="outlined"
                                onChange={handleChange}
                                inputProps={{ maxLength: 44 }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="mOtEve"
                                label="Motivo"
                                value={formData.mOtEve}
                                required
                                fullWidth
                                multiline
                                rows={4}
                                variant="outlined"
                                onChange={handleChange}
                                inputProps={{ maxLength: 500 }}
                            />
                        </Grid>
                    </Grid>
                );
            case 'Inutilización':
                return (
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="dNumTim"
                                label="Número de Timbrado"
                                value={formData.dNumTim}
                                required
                                fullWidth
                                variant="outlined"
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="dEst"
                                label="Punto de Establecimiento"
                                value={formData.dEst}
                                required
                                fullWidth
                                variant="outlined"
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="dPunExp"
                                label="Punto de Expedición"
                                value={formData.dPunExp}
                                required
                                fullWidth
                                variant="outlined"
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="dNumIn"
                                label="Número Inicial"
                                value={formData.dNumIn}
                                required
                                fullWidth
                                variant="outlined"
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="dNumFin"
                                label="Número Final"
                                value={formData.dNumFin}
                                required
                                fullWidth
                                variant="outlined"
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="dSerieNum"
                                label="Serie"
                                value={formData.dSerieNum}
                                fullWidth
                                variant="outlined"
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="mOtEve"
                                label="Motivo"
                                value={formData.mOtEve}
                                required
                                fullWidth
                                multiline
                                rows={4}
                                variant="outlined"
                                onChange={handleChange}
                                inputProps={{ maxLength: 255 }}
                            />
                        </Grid>
                    </Grid>
                );
            case 'Nominación':
                return (
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="cdc"
                                label="CDC"
                                value={formData.cdc}
                                required
                                fullWidth
                                variant="outlined"
                                onChange={handleChange}
                                inputProps={{ maxLength: 44 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                select
                                name="iNatRec"
                                label="Naturaleza del Receptor"
                                value={formData.iNatRec}
                                required
                                fullWidth
                                variant="outlined"
                                onChange={handleChange}
                            >
                                {naturalezaReceptor.map((option) => (
                                    <MenuItem key={option.codigo} value={option.codigo}>
                                        {option.descripcion}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                select
                                name="iTiOpe"
                                label="Tipo de Operación"
                                value={formData.iTiOpe}
                                required
                                fullWidth
                                variant="outlined"
                                onChange={handleChange}
                            >
                                {tipoOperacion.map((option) => (
                                    <MenuItem key={option.codigo} value={option.codigo}>
                                        {option.detalle_descripcion}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                select
                                name="iTiContRec"
                                label="Tipo de Contribuyente"
                                value={formData.iTiContRec}
                                required
                                fullWidth
                                variant="outlined"
                                onChange={handleChange}
                            >
                                {tipoContribuyente.map((option) => (
                                    <MenuItem key={option.codigo} value={option.codigo}>
                                        {option.descripcion}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="dRucRec"
                                label="RUC"
                                value={formData.dRucRec}
                                fullWidth
                                variant="outlined"
                                onChange={handleChange}
                                inputProps={{ maxLength: 12 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="dDVRec"
                                label="DV"
                                type='number'
                                value={formData.dDVRec}
                                fullWidth
                                variant="outlined"
                                onChange={handleChange}
                                inputProps={{ maxLength: 2 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                select
                                name="iTipIDRec"
                                label="Tipo documento de identidad"
                                value={formData.iTipIDRec}
                                fullWidth
                                variant="outlined"
                                onChange={handleChange}
                            >
                                {tipoDocumentoIdentidad.map((option) => (
                                    <MenuItem key={option.codigo} value={option.codigo}>
                                        {option.descripcion}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="dNumIDRec"
                                label="Número de documento"
                                value={formData.dNumIDRec}
                                fullWidth
                                variant="outlined"
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="dNomRec"
                                label="Nombre"
                                value={formData.dNomRec}
                                required
                                fullWidth
                                variant="outlined"
                                onChange={handleChange}
                                inputProps={{ maxLength: 255 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="dNomFanRec"
                                label="Nombre Fantasía"
                                value={formData.dNomFanRec}
                                fullWidth
                                variant="outlined"
                                onChange={handleChange}
                                inputProps={{ maxLength: 255 }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="dDirRec"
                                label="Dirección"
                                value={formData.dDirRec}
                                fullWidth
                                variant="outlined"
                                onChange={handleChange}
                                inputProps={{ maxLength: 255 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="dNumCasRec"
                                label="Número de Casa"
                                value={formData.dNumCasRec}
                                fullWidth
                                variant="outlined"
                                onChange={handleChange}
                                inputProps={{ maxLength: 10 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Autocomplete
                                options={paises}
                                getOptionLabel={(option) => option.descripcion}
                                onChange={handlePaisChange}
                                renderInput={(params) => (
                                    <TextField {...params} label="País" variant="outlined" fullWidth />
                                )}
                                value={paises.find(pais => pais.codigo === formData.cPaisRec) || null}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Autocomplete
                                options={departamentos.filter(depto => depto.pais_id === formData.cPaisRec)}
                                getOptionLabel={(option) => option.descripcion}
                                onChange={handleDepartamentoChange}
                                renderInput={(params) => (
                                    <TextField {...params} label="Departamento" variant="outlined" fullWidth />
                                )}
                                value={departamentos.find(depto => depto.codigo === formData.cDepRec) || null}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Autocomplete
                                options={distritos.filter(dist => dist.departamento_id === formData.cDepRec)}
                                getOptionLabel={(option) => option.descripcion}
                                onChange={handleDistritoChange}
                                renderInput={(params) => (
                                    <TextField {...params} label="Distrito" variant="outlined" fullWidth />
                                )}
                                value={distritos.find(dist => dist.codigo === formData.cDisRec) || null}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Autocomplete
                                options={ciudades.filter(ciudad => ciudad.distrito_id === formData.cDisRec)}
                                getOptionLabel={(option) => option.descripcion}
                                onChange={handleCiudadChange}
                                renderInput={(params) => (
                                    <TextField {...params} label="Ciudad" variant="outlined" fullWidth />
                                )}
                                value={ciudades.find(ciudad => ciudad.codigo === formData.cCiuRec) || null}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="dTelRec"
                                label="Teléfono"
                                value={formData.dTelRec}
                                fullWidth
                                variant="outlined"
                                onChange={handleChange}
                                inputProps={{ maxLength: 20 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="dCelRec"
                                label="Celular"
                                value={formData.dCelRec}
                                fullWidth
                                variant="outlined"
                                onChange={handleChange}
                                inputProps={{ maxLength: 20 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="dEmailRec"
                                label="Email"
                                value={formData.dEmailRec}
                                fullWidth
                                variant="outlined"
                                onChange={handleChange}
                                inputProps={{ maxLength: 255 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="dCodCliente"
                                label="Código del Cliente"
                                value={formData.dCodCliente}
                                fullWidth
                                variant="outlined"
                                onChange={handleChange}
                                inputProps={{ maxLength: 20 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="mOtEve"
                                label="Motivo"
                                value={formData.mOtEve}
                                required
                                fullWidth
                                multiline
                                rows={4}
                                variant="outlined"
                                onChange={handleChange}
                                inputProps={{ maxLength: 500 }}
                            />
                        </Grid>
                    </Grid>
                );
            default:
                return null;
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>{`Formulario de ${evento}`}</DialogTitle>
            <Formsy className="flex flex-col justify-center" onSubmit={handleFormSubmit} onValid={() => setIsFormValid(true)} onInvalid={() => setIsFormValid(false)}>
                <DialogContent>
                    {renderFormulario()}
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="primary">Cerrar</Button>
                    <Button type="submit" color="primary" disabled={!isFormValid}>Enviar</Button>
                </DialogActions>
            </Formsy>
        </Dialog>
    );
};

export default EventoFormularioDialog;
