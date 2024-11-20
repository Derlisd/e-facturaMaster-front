import React, { useState, useEffect } from "react";
import {
    Typography,
    Grid,
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from "@material-ui/core";
import { useSelector } from "react-redux";
import { makeStyles } from '@material-ui/styles';
import { useSnackbar } from 'notistack';
import EmpresasListItem from "app/components/EmpresasListItem";
import EmpresasForm from 'app/components/EmpresasForm/';
import ControllerService from "app/services/ControllerService";

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
        width: '100%' // Make the container take the full width
    },
    listContainer: {
        padding: theme.spacing(2),
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: theme.shadows[3],
        margin: theme.spacing(2),
        width: '100%' // Make the list container take the full width
    },
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    }
}));

const initialValues = {
    ruc: '',
    dv: '',
    razon_social: '',
    nombre_fantasia: '',
    tipo_contribuyente: '',
    produccion: false,
    actividades_economicas: [
        {
            codactividad: '',
            desc_actividad: '',
            principal: true
        }
    ],
    sucursales: [
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
            puntos_expedicion: null
        }
    ],
    timbrados: [
        {
            num_timbrado: '',
            fecha_inicio: '',
            id_csc: '001',
            csc: 'ABCD0000000000000000000000000000',
            ambiente: 'test'
        }
    ]
}
function Empresas() {
    const user = useSelector(({ auth }) => auth.user);
    const perfil = user.role[0]
    const empresas_usuario = user.data.empresas;
    const usuario = user.data.username;
    const privilegios = user.data.privilegios.map(privilegio => privilegio.cod_privilegio);

    const hasAlta = privilegios.includes('alta_empresas');
    const hasCon = privilegios.includes('con_empresas');
    const hasEliminar = privilegios.includes('eliminar_empresas');
    const hasEditar = privilegios.includes('editar_empresas');

    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const [empresas, handleEmpresas] = useState([]);
    const [paises, handlePaises] = useState([]);
    const [departamentos, handleDepartamentos] = useState([]);
    const [distritos, handleDistritos] = useState([]);
    const [ciudades, handleCiudades] = useState([]);
    const [tipos_contribuyentes, handleTiposContribuyentes] = useState([]);
    const [operacion, handleOperacion] = useState('A');
    const [objeto, handleObjeto] = useState(window.location.pathname.replace(/\//g, ""));
    const [buttonState, handlebuttonState] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [active, handleActive] = useState(false);
    const [activeOpen, setActiveOpen] = useState(false);
    const [editData, setEditData] = useState({ ...initialValues, usuario });

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
        if (hasCon) {
            fetchEmpresas();
        }
    }, [hasCon]);

    useEffect(() => {
        fetchTiposContribuyentes()
        fetchPaises()
        fecthDepartamentos()
        fecthDistritos()
        fecthCiudades()
    }, []);

    async function fetchPaises() {

        const data = {
            objeto: 'paises',
            operacion: 'C'
        };

        await ControllerService.controller(data)
            .then(response => {
                if (response.data.status === "success") {
                    handlePaises(response.data.data);
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

    async function fecthDepartamentos() {

        const data = {
            objeto: 'departamentos',
            operacion: 'C'
        };

        await ControllerService.controller(data)
            .then(response => {
                if (response.data.status === "success") {
                    handleDepartamentos(response.data.data);
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

    async function fecthDistritos() {

        const data = {
            objeto: 'distritos',
            operacion: 'C'
        };

        await ControllerService.controller(data)
            .then(response => {
                if (response.data.status === "success") {
                    handleDistritos(response.data.data);
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

    async function fecthCiudades() {

        const data = {
            objeto: 'ciudades',
            operacion: 'C'
        };

        await ControllerService.controller(data)
            .then(response => {
                if (response.data.status === "success") {
                    handleCiudades(response.data.data);
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

    async function fetchTiposContribuyentes() {

        const data = {
            objeto: 'tipo_contribuyente',
            operacion: 'C'
        };

        await ControllerService.controller(data)
            .then(response => {
                if (response.data.status === "success") {
                    handleTiposContribuyentes(response.data.data);
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

    async function fetchEmpresas() {
        handleEmpresas([]);

        const data = {
            data: {},
            objeto
        };

        if (perfil !== 'admin') {
            data.data.empresas = empresas_usuario.map(item => item.id)
        }

        await ControllerService.getListFilter(data)
            .then(response => {
                if (response.data.status === "success") {
                    handleEmpresas(response.data.data);
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

    async function handleGuardar(formData) {
        handlebuttonState(true);

        let dataToSend = {
            ruc: formData.ruc,
            dv: formData.dv,
            razon_social: formData.razon_social,
            nombre_fantasia: formData.nombre_fantasia,
            tipo_contribuyente: formData.tipo_contribuyente,
            produccion: formData.timbrados[0].ambiente == 'prod' ? true : false,
            usuario: usuario,
            actividades: JSON.stringify(formData.actividades_economicas),
            sucursales: JSON.stringify(formData.sucursales),
            timbrados: JSON.stringify(formData.timbrados)
        };

        // Añadir el ID de la sólo si es una modificación
        if (operacion === 'M') {
            dataToSend.id = formData.id;
        }

        const data = {
            data: dataToSend,
            objeto,
            operacion
        };

        await ControllerService.controller(data)
            .then(response => {
                handlebuttonState(false);
                if (response.data.status === "success") {
                    message("success", 'Registro guardado exitósamente');
                    fetchEmpresas();
                    setEditData(initialValues); // Clear edit data
                    handleOperacion('A'); // Reset operation to add
                } else {
                    message("error", response.data.message);
                }
            }).catch(error => {
                console.log(error);
                message("error", error.message);
                handlebuttonState(false);
            });
    }

    async function handleEliminar() {
        const data = {
            data: { id: editData.id, usuario },
            objeto,
            operacion
        };

        await ControllerService.controller(data)
            .then(response => {
                setDeleteDialogOpen(false);
                if (response.data.status === "success") {
                    message("success", 'Registro eliminado exitósamente');
                    fetchEmpresas();
                    handleOperacion('A'); // Reset operation to add
                } else {
                    message("error", response.data.message);
                }
            }).catch(error => {
                console.log(error);
                message("error", error.message);
                setDeleteDialogOpen(false);
            });
    }

    async function handleChangeEstado() {
        const data = {
            data: { id: editData.id, active: editData.active, usuario },
            objeto,
            operacion: 'E'
        };

        await ControllerService.controller(data)
            .then(response => {
                setActiveOpen(false);
                if (response.data.status === "success") {
                    message("success", `Registro ${active ? 'activado' : 'inactivado'} exitosamente`);
                    fetchEmpresas();
                } else {
                    message("error", response.data.message);
                }
            }).catch(error => {
                console.log(error);
                message("error", error.message);
                setActiveOpen(false);
            });
    }

    function handleEditar(empresa) {
        setEditData(empresa);
        handleOperacion('M');
    }

    function handleEstado(id, active) {
        handleActive(active)
        setActiveOpen(true)
        setEditData({ id, active });
        handleOperacion('E');
    }

    function handleDelete(id) {
        setEditData({ id });
        handleOperacion('B');
        setDeleteDialogOpen(true);
    }

    function handleCancelClose() {
        setDeleteDialogOpen(false);
        setActiveOpen(false)
    }

    return (
        <div className={`p-24 flex flex-1 justify-center ${classes.root}`}>
            {hasAlta && (
                <>
                    <Box className={classes.container}>
                        <Typography className="h2 mb-24" align="center">
                            Mantenimiento de Empresas
                        </Typography>
                        <EmpresasForm
                            onSubmit={handleGuardar}
                            buttonState={buttonState}
                            editData={editData}
                            initialValues={initialValues}
                            handleOperacion={handleOperacion}
                            tipos_contribuyentes={tipos_contribuyentes}
                            paises={paises}
                            departamentos={departamentos}
                            distritos={distritos}
                            ciudades={ciudades}
                        />
                    </Box>
                </>

            )}

            {hasCon && (
                <Box className={classes.listContainer}>
                    <Grid item xs={12} md={12}>
                        {empresas.length > 0 ?
                            <EmpresasListItem
                                registro={empresas}
                                editar={handleEditar}
                                eliminar={handleDelete}
                                estado={handleEstado}
                                hasEliminar={hasEliminar}
                                hasEditar={hasEditar}
                            >
                            </EmpresasListItem>
                            : ''}
                    </Grid>
                </Box>
            )}

            <Dialog open={deleteDialogOpen} onClose={handleCancelClose}>
                <DialogTitle>Confirmar Eliminación</DialogTitle>
                <DialogContent>
                    <Typography>¿Está seguro de que desea eliminar este registro?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelClose} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleEliminar} color="primary">
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={activeOpen} onClose={handleCancelClose}>
                <DialogTitle id="form-deactivate-dialog-title">{active ? 'Activar' : 'Desactivar'} empresa</DialogTitle>
                <DialogContent>
                    Esta de seguro de {active ? 'activar' : 'desactivar'} la empresa
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelClose} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleChangeEstado} color="primary">
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    );
}

export default Empresas;
