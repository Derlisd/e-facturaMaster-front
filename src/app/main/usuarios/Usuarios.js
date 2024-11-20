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
import UsuariosListItem from "app/components/UsuariosListItem";
import UsuariosForm from 'app/components/UsuariosForm/';
import ControllerService from "app/services/ControllerService";
import UserService from "app/services/UserService";

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
        alignItems: 'center',
        [theme.breakpoints.down('sm')]: {
            alignItems: 'stretch'
        }
    }
}));

function Usuarios() {
    const user = useSelector(({ auth }) => auth.user);
    const usuario = user.data.username;
    const privilegios = user.data.privilegios.map(privilegio => privilegio.cod_privilegio);

    const hasAlta = privilegios.includes('alta_usuarios');
    const hasCon = privilegios.includes('con_usuarios');
    const hasEliminar = privilegios.includes('eliminar_usuarios');
    const hasEditar = privilegios.includes('editar_usuarios');

    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const [usuarios, handleUsuarios] = useState([]);
    const [empresas, handleEmpresas] = useState([]);
    const [perfiles, handlePerfiles] = useState([]);
    const [operacion, handleOperacion] = useState('A');
    const [objeto, handleObjeto] = useState(window.location.pathname.replace(/\//g, ""));
    const [buttonState, handlebuttonState] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [active, handleActive] = useState(false);
    const [activeOpen, setActiveOpen] = useState(false);
    const [editData, setEditData] = useState({
        empresas: [],
        nombres: '',
        apellidos: '',
        username: '',
        email: '',
        password: '',
        perfiles: [],
        usuario: usuario
    });

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
            fetchUsuarios();
        }
    }, [hasCon]);

    useEffect(() => {
        fetchEmpresas()
        fetchPerfiles()
    }, []);

    async function fetchEmpresas() {

        const data = {
            objeto: 'empresas',
            operacion: 'C'
        };

        await ControllerService.controller(data)
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

    async function fetchPerfiles() {

        const data = {
            objeto: 'perfiles',
            operacion: 'C'
        };

        await ControllerService.controller(data)
            .then(response => {
                if (response.data.status === "success") {
                    handlePerfiles(response.data.data);
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

    async function fetchUsuarios() {
        handleUsuarios([]);

        const data = {
            objeto
        };

        await ControllerService.getList(data)
            .then(response => {
                if (response.data.status === "success") {
                    handleUsuarios(response.data.data);
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
            empresas: formData.empresas,
            nombres: formData.nombres,
            apellidos: formData.apellidos,
            username: formData.username,
            email: formData.email,
            password: formData.password,
            perfiles: formData.perfiles,
            usuario: usuario
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

        await UserService.controller(data)
            .then(response => {
                handlebuttonState(false);
                if (response.data.status === "success") {
                    message("success", 'Registro guardado exitósamente');
                    fetchUsuarios();
                    setEditData({
                        nombres: '',
                        apellidos: '',
                        empresas: [],
                        username: '',
                        email: '',
                        password: '',
                    }); // Clear edit data
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
                    fetchUsuarios();
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
                    fetchUsuarios();
                } else {
                    message("error", response.data.message);
                }
            }).catch(error => {
                console.log(error);
                message("error", error.message);
                setActiveOpen(false);
            });
    }

    function handleEditar(usuario) {
        setEditData(usuario);
        handleOperacion('M');
    }

    function handleEstado(id, active) {
        handleActive(active)
        setActiveOpen(true)
        setEditData({ id, active });
        handleOperacion('E');
    }

    function handleDeleteDialogOpen(id) {
        setEditData({ id });
        handleOperacion('B');
        setDeleteDialogOpen(true);
    }

    function handleDeleteDialogClose() {
        setDeleteDialogOpen(false);
    }

    function handleCancelClose() {
        setDeleteDialogOpen(false);
        setActiveOpen(false)
    }

    return (
        <div className={`p-24 flex flex-1 justify-center ${classes.root}`}>
            {hasAlta && (
                <Box className={classes.container}>
                    <Typography className="h2 mb-24" align="center">
                        Mantenimiento de Usuarios
                    </Typography>
                    <UsuariosForm
                        onSubmit={handleGuardar}
                        buttonState={buttonState}
                        initialValues={editData}
                        handleOperacion={handleOperacion}
                        empresas={empresas}
                        perfiles={perfiles}
                    />
                </Box>
            )}

            {hasCon && (
                <Box className={classes.listContainer}>
                    <Grid item xs={12} md={12}>
                        {usuarios.length > 0 ?
                            <UsuariosListItem
                                registro={usuarios}
                                editar={handleEditar}
                                eliminar={handleDeleteDialogOpen}
                                estado={handleEstado}
                                hasEditar={hasEditar}
                                hasEliminar={hasEliminar}
                            >
                            </UsuariosListItem>
                            : ''}
                    </Grid>
                </Box>
            )}

            <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
                <DialogTitle>Confirmar Eliminación</DialogTitle>
                <DialogContent>
                    <Typography>¿Está seguro de que desea eliminar este registro?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteDialogClose} color="primary">
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

export default Usuarios;
