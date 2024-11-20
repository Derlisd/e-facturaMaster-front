import React, { useState, useEffect } from "react";
import {
    Typography,
    Grid,
    Box,
    Button,
    TextField,
    Paper,
    Icon,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    IconButton,
    CircularProgress
} from "@material-ui/core";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import esLocale from "date-fns/locale/es";
import { useSelector } from "react-redux";
import { makeStyles } from '@material-ui/styles';
import FacturaService from 'app/services/FacturaService';
import { useSnackbar } from 'notistack';
import FacturaListItem from "app/components/FacturaListItem";
import FacturaForm from 'app/components/FacturaForm';
import { selectEmpresaId } from 'app/store/selectors/empresaSelectors';
import ControllerService from 'app/services/ControllerService';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import moment from "moment";

dayjs.extend(utc);
dayjs.extend(timezone);


const useStyles = makeStyles(theme => ({
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
        marginTop: theme.spacing(2),
        width: '100%'
    },
    filtersContainer: {
        padding: theme.spacing(3),
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        marginBottom: theme.spacing(2),
        marginTop: 0,
        width: '100%'
    },
    headerContainer: {
        padding: theme.spacing(0),
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        marginBottom: theme.spacing(2),
        marginTop: 0,
        width: '100%',  // Reducir el ancho del Paper de la cabecera
        textAlign: 'center'
    },
    addButton: {
        backgroundColor: theme.palette.primary.main,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        [theme.breakpoints.down('sm')]: {
            marginBottom: theme.spacing(2)  // Ajustar para espacios móviles
        }
    },
    sendButton: {
        backgroundColor: theme.palette.primary.main,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        [theme.breakpoints.down('sm')]: {
            marginBottom: theme.spacing(2)  // Ajustar para espacios móviles
        }
    },
    buttonSearch: {
        backgroundColor: theme.palette.primary.main,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        [theme.breakpoints.down('sm')]: {
            marginTop: theme.spacing(2)  // Ajustar para espacios móviles
        }
    },
    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%'
    },
    filtersGridContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
            alignItems: 'stretch'  // Cambia la distribución en pantallas pequeñas
        }
    },
    datePicker: {
        width: '200px',
        alignItems: 'center',
        marginRight: theme.spacing(2),
        [theme.breakpoints.down('xs')]: {
            width: '100%', // Ocupa el ancho completo en pantallas pequeñas
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2), // Añade un margen inferior para separarlo del siguiente elemento
        },
    },
}));

const timeZone = 'America/Asuncion'; // Especifica la zona horaria

const initialValues = {
    cliente: {
        tipo_documento: '',
        naturaleza: 1,
        tipo_contribuyente: 2,
        nro_documento: '',
        razon_social: 'SIN NOMBRE',
        ruc: '',
        dv: '',
        direccion: '',
        email: '',
        telefono: '',
        celular: '',
        nro_casa: 0,
    },
    cabecera: {
        tipo_transaccion_id: 1,
        tipo_impuesto_id: 1,
        indicador_presencia: 1,
        moneda_id: 'PYG',
        condicion_operacion_id: 1,
        tipo_operacion_id: 1,
        dinfoemi: '',
        dest: '',
        dpunexp: '',
        dfeemide: dayjs().tz(timeZone).toDate(),
    },
    FormaPago: [
        {
            medio_pago_id: 1,
            dmontipag: 0,
            cmonetipag: 'PYG'
        }
    ],
    Detalles: [{
        dcodint: 0,
        ddesproser: '',
        cunimed: 77,
        dcantproser: 1,
        duniproser: 0,
        ddescitem: 0,
        dporcdesit: 0,
        ddescgloitem: 0,
        dantpreuniit: 0,
        dantglopreuniit: 0,
        dtotbruopeitem: 0,
        dtotopeitem: 0,
        iafeciva: 1,
        dpropiva: 100,
        dtasiva: 10,
        dbasgraviva: 0,
        dliqivaitem: 0,
        dbasexe: 0
    }],
    Subtotales: {
        dsubexe: 0,
        dsubexo: 0,
        dsub5: 0,
        dsub10: 0,
        dtotope: 0,
        dtotdesc: 0,
        ddesctotal: 0,
        dporcdesctotal: 0,
        dtotdescglotem: 0,
        dtotantitem: 0,
        dtotant: 0,
        danticipo: 0,
        dredon: 0,
        dcomi: 0,
        dtotgralope: 0,
        diva5: 0,
        diva10: 0,
        dliqtotiva5: 0,
        dliqtotiva10: 0,
        divacomi: 0,
        dtotiva: 0,
        dbasegrav5: 0,
        dbasegrav10: 0,
        dtbasgraiva: 0,
        dtotalgs: 0
    }
}

function Factura() {
    const user = useSelector(({ auth }) => auth.user);
    const empresa = useSelector(selectEmpresaId);
    const usuario = user.data.username;
    const privilegios = user.data.privilegios.map(privilegio => privilegio.cod_privilegio);

    const hasAltaFactura = privilegios.includes('alta_factura');
    const hasConFactura = privilegios.includes('con_factura');
    const hasEditarFactura = privilegios.includes('editar_factura');
    const hasEliminarFactura = privilegios.includes('eliminar_factura');

    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const [isLoading, setIsLoading] = useState(false);
    const [facturas, handleFactura] = useState([]);
    const [data_empresa, handleEmpresa] = useState({})
    const [tableKey, setTableKey] = useState(Date.now()); // Para forzar el rerender de la tabla
    const [showForm, setShowForm] = useState(false); // Estado para mostrar/ocultar el formulario
    const [fechaInicio, setFechaInicio] = useState(dayjs().tz(timeZone).startOf('month').toDate()); // Fecha inicial del mes
    const [fechaFin, setFechaFin] = useState(dayjs().tz(timeZone).endOf('month').toDate()); // Fecha final del mes
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedFactura, setSelectedFactura] = useState(null);
    const [facturaData, handleFacturaData] = useState({
        detalles: [],
        subtotales: {},
        forma_pagos: []
    })
    const [formData, setFormData] = useState(initialValues);
    const [selectedFacturasSend, setSelectedFacturasSend] = useState([]);
    const [openDialogSend, setOpenDialogSend] = useState(false);
    const [nro_lote, setNroLote] = useState('');

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

    const formatNumber = (moneda, valor, decimales) => {
        let number = '';

        if (moneda == 'PYG') {
            number = new Intl.NumberFormat('es-PY', {
                minimumFractionDigits: decimales,
                maximumFractionDigits: decimales
            }).format(valor);

            number.replace(/,/g, '.')
        } else {
            number = new Intl.NumberFormat('en-US', {
                minimumFractionDigits: decimales,
                maximumFractionDigits: decimales
            }).format(valor);

            // Reemplaza comas con puntos y puntos con comas
            number = number.replace(/,/g, '_')  // Temporalmente reemplaza comas con un carácter temporal
                .replace(/\./g, ',') // Reemplaza puntos con comas
                .replace(/_/g, '.'); // Finalmente reemplaza el carácter temporal (las comas originales) con puntos
        }

        return number
    }

    // Función para manejar el envío del formulario desde FacturaForm
    const handleFormSubmit = async (formData) => {
        try {

            let data = {
                ...formData,
                empresa,
                usuario
            }

            let response = await FacturaService.create(data);

            if (response.data.status === "success") {
                message('success', response.data.message);
            } else {
                message("error", response.data.message);
            }

            await fetchFactura();

            setFormData({
                ...initialValues,
                Detalles: initialValues.Detalles.map(() => ({
                    dcodint: 0,
                    ddesproser: '',
                    cunimed: 77,
                    dcantproser: 1,
                    duniproser: 0,
                    ddescitem: 0,
                    dporcdesit: 0,
                    ddescgloitem: 0,
                    dantpreuniit: 0,
                    dantglopreuniit: 0,
                    dtotbruopeitem: 0,
                    dtotopeitem: 0,
                    iafeciva: 1,
                    dpropiva: 100,
                    dtasiva: 10,
                    dbasgraviva: 0,
                    dliqivaitem: 0,
                    dbasexe: 0
                }))
            });
            //setShowForm(false); // Ocultar el formulario después del envío
        } catch (error) {
            console.error('Error al crear la factura:', error);
            message('error', 'Error al crear la factura');
        }
    };

    useEffect(() => {
        if (hasConFactura) {
            fetchFactura();
            fetchEmpresa()
        }
    }, [hasConFactura]);

    useEffect(() => {
        fetchFactura();
        fetchEmpresa()
    }, [empresa]);

    const fetchEmpresa = async () => {
        const data = {
            objeto: 'empresas',
            operacion: 'F',
            data: {
                id: empresa
            }
        };

        await ControllerService.controller(data)
            .then(response => {
                if (response.data.status === "success") {
                    handleEmpresa(response.data.data[0]);
                    if (response.data.data.length === 0) {
                        message("error", 'No se encontraron resultados de la empresa');
                    }
                } else {
                    message("error", response.data.message);
                }
            }).catch(error => {
                console.log(error);
                message("error", error.message);
            });
    };

    async function fetchFactura() {

        handleFactura([]);

        let data = {
            objeto: 'factura_cab',
            data: {
                empresa,
                fecha_inicio: fechaInicio || null,
                fecha_fin: fechaFin || null
            }
        };

        await FacturaService.getListFilter(data)
            .then(response => {
                if (response.data.status === "success") {

                    if (response.data.data.length === 0) {
                        message("error", 'No se encontraron resultados');
                    } else {
                        const data_factura = [];
                        for (const item of response.data.data) {
                            data_factura.push({
                                acciones:
                                    <>
                                        <IconButton
                                            size="small"
                                            title='Ver Detalles'
                                            onClick={() => { handleDetalles(item) }}
                                        >
                                            <Icon style={{ color: 'green' }}>remove_red_eye</Icon>
                                        </IconButton>
                                    </>
                                ,
                                id: item.id,
                                razon_social: item.razon_social,
                                nro_documento: item.nro_documento,
                                nro_factura: item.nro_factura,
                                tipo_transaccion: item.tipo_transaccion,
                                tipo_impuesto: item.tipo_impuesto,
                                moneda: item.moneda,
                                condicion_operacion: item.condicion_operacion,
                                tipo_operacion: item.tipo_operacion,
                                total: formatNumber(item.moneda, item.total, 0),
                                fecha_emision: moment(item.fecha_emision).format('DD/MM/YYYY HH:mm:ss'),
                                fecha_creacion: moment(item.fecha_creacion).format('DD/MM/YYYY HH:mm:ss'),
                            });
                        }

                        handleFactura(data_factura);

                    }

                    setTableKey(Date.now()); // Forzar rerender de la tabla

                } else {
                    message("error", response.data.message);
                    handleFactura([]);
                }
            }).catch(error => {
                console.log(error);
                message("error", error.message);
                handleFactura([]);
            });
    }

    // Función para manejar cuando se selecciona una factura
    const handleDetalles = async (factura) => {
        setSelectedFactura(factura);

        let data = {
            objeto: 'factura_det',
            data: {
                factura_cab_id: factura.id
            }
        };

        await FacturaService.getListFilter(data)
            .then(response => {
                if (response.data.status === "success") {
                    console.log("response.data.data: ", response.data.data[0])
                    handleFacturaData(response.data.data[0].sp_factura_det_list_filter);
                    if (response.data.data.length === 0) {
                        message("error", 'No se encontraron resultados');
                    }
                } else {
                    message("error", response.data.message);
                }

                setOpenDialog(true);  // Abre el diálogo

            }).catch(error => {
                console.log(error);
                message("error", error.message);
            });
    };

    const handleEnviar = async () => {

        setIsLoading(true);
        setOpenDialogSend(false);

        let data = {
            empresa,
            nro_lote,
            documentos: selectedFacturasSend.map(item => ({ id: item.id })),
            usuario
        };

        await FacturaService.send(data)
            .then(response => {
                if (response.data.status === "success") {
                    message('success', response.data.message);
                } else {
                    message("error", response.data.message);
                }

                setIsLoading(false);
            }).catch(error => {
                console.log(error);
                message("error", error.message);
            })
    }

    const handleClickOpenDialog = () => {

        if (selectedFacturasSend.length === 0) {
            message('error', 'Debe seleccionar al menos un documento');
            return;
        }

        setOpenDialogSend(true);
    };

    // Función para cerrar el diálogo
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setOpenDialogSend(false);
        setSelectedFactura(null);  // Limpiar los datos de la factura
    };

    const handleToggleForm = () => {
        setShowForm(!showForm); // Cambia entre mostrar u ocultar el formulario
    };

    const handleBuscar = () => {
        fetchFactura(); // Llama la función de fetch con las fechas seleccionadas
    };

    const handleSelectionChange = (selectedRows) => {
        setSelectedFacturasSend(selectedRows);
    };

    return (
        <div className={`p-24 flex flex-1 ${classes.root}`}>

            {/* Cabecera con el título */}
            <Paper className={classes.headerContainer}>
                <Typography variant="h4" className="mb-24 mt-24">
                    {showForm ? "Crear Factura" : "Factura"} - Emisor: {data_empresa.razon_social}
                </Typography>
            </Paper>

            {hasAltaFactura && (
                <>
                    <Paper className={classes.filtersContainer}>
                        <div className={classes.filtersGridContainer}>
                            <Grid container spacing={2} alignItems="center">
                                {/* Botón Añadir Factura y Enviar alineados a la izquierda */}
                                <Grid item xs={12} sm={3} md={showForm ? 2 : 2}>
                                    <Button
                                        className={classes.addButton}
                                        variant="contained"
                                        color="primary"
                                        onClick={handleToggleForm}
                                        fullWidth
                                        startIcon={showForm ? <Icon>arrow_back</Icon> : <Icon>add_circle_outline</Icon>}
                                    >
                                        {showForm ? "Volver al listado" : "Nueva"}
                                    </Button>
                                </Grid>

                                <Grid item xs={12} sm={3} md={2}>
                                    {showForm ? null : (
                                        <Button
                                            className={classes.sendButton}
                                            variant="contained"
                                            color="primary"
                                            onClick={handleClickOpenDialog}
                                            fullWidth
                                            startIcon={<Icon>send</Icon>}
                                        >
                                            Enviar
                                        </Button>
                                    )}
                                </Grid>
                            </Grid>

                            {/* Filtros de Fecha y el botón Buscar alineados a la derecha */}
                            {showForm ? null : (
                                <>
                                    <Grid container item xs={12} sm={9} md={6} justifyContent="flex-end" spacing={2}>
                                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>
                                            <KeyboardDatePicker
                                                className={classes.datePicker}
                                                value={fechaInicio}
                                                onChange={setFechaInicio}
                                                label="Desde"
                                                openTo="year"
                                                format="dd/MM/yyyy"
                                                views={["year", "month", "date"]}
                                                variant="inline"
                                                inputVariant="outlined"
                                                required
                                            />

                                            <KeyboardDatePicker
                                                className={classes.datePicker}
                                                value={fechaFin}
                                                onChange={setFechaFin}
                                                label="Hasta"
                                                openTo="year"
                                                format="dd/MM/yyyy"
                                                views={["year", "month", "date"]}
                                                variant="inline"
                                                inputVariant="outlined"
                                                required
                                            />
                                        </MuiPickersUtilsProvider>
                                    </Grid>

                                    <Grid item xs={12} sm={3} md={1}>
                                        <Button
                                            className={classes.buttonSearch}
                                            variant="contained"
                                            color="primary"
                                            onClick={handleBuscar}
                                            fullWidth
                                            startIcon={<Icon>search</Icon>}
                                        >
                                            Buscar
                                        </Button>
                                    </Grid>
                                </>
                            )}
                        </div>
                    </Paper>

                    {showForm ? (
                        <Box className={classes.container}>
                            <FacturaForm initialValues={initialValues} formData={formData} setFormData={setFormData} onSubmit={handleFormSubmit} />
                        </Box>
                    ) : (
                        <Box className={classes.listContainer}>
                            <Grid item xs={12} md={12}>
                                {facturas.length > 0 ? (
                                    <FacturaListItem
                                        key={tableKey} // Clave dinámica para forzar rerender
                                        hasEditar={hasEditarFactura}
                                        hasEliminar={hasEliminarFactura}
                                        data={facturas}
                                        onSelectionChange={handleSelectionChange}
                                    />
                                ) : (
                                    <Typography align="center" color="textSecondary">
                                        No se encontraron facturas.
                                    </Typography>
                                )}
                            </Grid>
                        </Box>
                    )}
                </>
            )}

            <Dialog
                open={openDialogSend}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    style: {
                        position: 'absolute',
                        top: '0%',  // Ajustar este valor para mover el diálogo más arriba
                        transform: 'translate(0, 0)'
                    }
                }}
            >
                <DialogTitle>Envio de Documentos</DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={9}>
                            <TextField
                                autoFocus
                                required
                                label="Nro Lote."
                                value={nro_lote}
                                fullWidth
                                variant="outlined"
                                onChange={(e) => setNroLote(e.target.value)}
                                error={nro_lote.trim() === ''}
                                helperText={nro_lote.trim() === '' ? 'Este campo es requerido.' : ''}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField
                                label="Total a enviar"
                                value={selectedFacturasSend.length}
                                fullWidth
                                variant="outlined"
                                disabled
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Paper>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Nro Factura</TableCell>
                                            <TableCell>Fecha</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {selectedFacturasSend.map((item, index) => {
                                            return (
                                                <TableRow key={index}>
                                                    <TableCell>{item.nro_factura}</TableCell>
                                                    <TableCell>{item.fecha_emision}</TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </Paper>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button
                        type="button"
                        onClick={handleEnviar}
                        variant="contained"
                        color="primary"
                        disabled={isLoading || nro_lote.trim() === ''}
                    >
                        {isLoading ? <CircularProgress size={20} style={{ color: 'white' }} /> : <><Icon style={{ color: 'white' }}>check-circle</Icon> Confirmar</>}
                    </Button>
                    <Button onClick={handleCloseDialog} color="primary" style={{ backgroundColor: 'red', color: 'white' }}>
                        <><Icon style={{ color: 'white' }}>cancel</Icon> Cerrar</>
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Diálogo para mostrar los detalles de la factura */}
            {selectedFactura && (
                <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                    <DialogTitle>Detalles de la Factura {selectedFactura.nro_factura}</DialogTitle>
                    <DialogContent dividers>
                        {/* Información de la cabecera de la factura con campos de texto */}
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Razón Social"
                                    value={selectedFactura.razon_social}
                                    fullWidth
                                    variant="outlined"
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Nro Documento"
                                    value={selectedFactura.nro_documento}
                                    fullWidth
                                    variant="outlined"
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Tipo Transacción"
                                    value={selectedFactura.tipo_transaccion}
                                    fullWidth
                                    variant="outlined"
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Condición Operación"
                                    value={selectedFactura.condicion_operacion}
                                    fullWidth
                                    variant="outlined"
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Total"
                                    value={formatNumber(selectedFactura.moneda, selectedFactura.total, 0)}
                                    fullWidth
                                    variant="outlined"
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Fecha Emisión"
                                    value={moment(selectedFactura.fecha_emision).format('DD/MM/YYYY HH:mm:ss')}
                                    fullWidth
                                    variant="outlined"
                                    InputProps={{ readOnly: true }}
                                />
                            </Grid>
                        </Grid>

                        {/* Formas de Pago */}
                        <Box mt={3}>
                            <Typography variant="h6">Formas de Pago</Typography>
                            <Paper>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Descripción</TableCell>
                                            <TableCell>Moneda</TableCell>
                                            <TableCell>Monto</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {(facturaData.forma_pagos || []).map((pago, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{pago.medio_pago_descripcion}</TableCell>
                                                <TableCell>{pago.moneda_pago}</TableCell>
                                                <TableCell>{formatNumber(selectedFactura.moneda, pago.monto_pago, 0)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Paper>
                        </Box>

                        {/* Detalle de Productos */}
                        <Box mt={3}>
                            <Typography variant="h6">Detalle de Productos</Typography>
                            <Paper>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Cod. Producto</TableCell>
                                            <TableCell>Descripción</TableCell>
                                            <TableCell>Cantidad</TableCell>
                                            <TableCell>Precio</TableCell>
                                            <TableCell>Subtotal</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {(facturaData.detalles || []).map((detalle, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{detalle.cod_producto}</TableCell>
                                                <TableCell>{detalle.descripcion_producto}</TableCell>
                                                <TableCell>{detalle.cantidad}</TableCell>
                                                <TableCell>{formatNumber(selectedFactura.moneda, detalle.precio_unitario, 0) || 0}</TableCell>
                                                <TableCell>{formatNumber(selectedFactura.moneda, detalle.total_item, 0) || 0}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Paper>
                        </Box>

                        {/* Subtotales */}
                        <Box mt={3}>
                            <Typography variant="h6">Subtotales</Typography>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Total IVA:</TableCell>
                                        <TableCell>{formatNumber(selectedFactura.moneda, facturaData.subtotales.dtotiva, 0)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Total Gravada:</TableCell>
                                        <TableCell>{formatNumber(selectedFactura.moneda, facturaData.subtotales.dtbasgraiva, 0)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Total Operación:</TableCell>
                                        <TableCell>{formatNumber(selectedFactura.moneda, facturaData.subtotales.dtotgralope, 0)}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color="primary">Cerrar</Button>
                    </DialogActions>
                </Dialog>
            )}

        </div>
    );
}

export default Factura;
