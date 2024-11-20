import {
    Typography,
    Grid,
    Paper,
    Button,
    Hidden,
    TextField,
    Icon,
    FormControlLabel,
    Checkbox,
    CircularProgress,
    Avatar
} from "@material-ui/core";
import {
    CheckCircleOutline as ApprovedIcon,
    HighlightOff as RejectedIcon,
    //HourglassEmpty as InProcessIcon,
    History as SendPending,
    CloudUpload as SentIcon,
    //Edit as SignedXmlIcon,
    CloudDownloadOutlined as DownloadDocument,
    LibraryBooks as DocumentTypeIcon,
    RemoveRedEye as ViewDetail,
    Block as EventCancelacion,
    AccountBox as EventNominacion,
    RemoveCircleOutline as EventInutilizacion
} from '@material-ui/icons';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import esLocale from "date-fns/locale/es";
import React, { useState, useEffect } from "react";
import Formsy from "formsy-react";
import { useSelector } from "react-redux";
import renderIf from "render-if";
import './DocumentosElectronicos.css'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/styles';
import DocumentosElectronicosService from 'app/services/DocumentosElectronicosService';
import EventosService from "app/services/EventosService";
import ControllerService from "app/services/ControllerService";
import { useSnackbar } from 'notistack';
import DocumentosElectronicosListItem from "app/components/DocumentosElectronicosListItem";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { selectEmpresaId } from '../../store/selectors/empresaSelectors';
import EventoFormularioDialog from "app/components/EventoFormularioDialog";

dayjs.extend(utc);
dayjs.extend(timezone);

const useStyles = makeStyles(theme => ({
    dialogPaper: {
        width: '800px'
    },
    checkboxGrid: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    checkboxItem: {
        flex: '0 0 auto',
        marginRight: theme.spacing(2),
    },
    iconGrid: {
        display: 'flex',
        alignItems: 'center',
        marginTop: theme.spacing(2),
    },
    datePickerGrid: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'left', // Alinea las fechas y el botón de búsqueda a la derecha
        flex: 1,
        [theme.breakpoints.down('xs')]: {
            justifyContent: 'flex-start', // Alinea a la izquierda en pantallas pequeñas
            flexDirection: 'column', // Apilar elementos verticalmente en pantallas pequeñas
        },
    },
    datePicker: {
        width: '200px',
        marginRight: theme.spacing(2),
        marginTop: theme.spacing(2),
        [theme.breakpoints.down('xs')]: {
            width: '100%', // Ocupa el ancho completo en pantallas pequeñas
            marginRight: 0, // Elimina el margen derecho en pantallas pequeñas
            marginBottom: theme.spacing(2), // Añade un margen inferior para separarlo del siguiente elemento
        },
    },
    searchButton: {
        display: 'flex',
        alignItems: 'center',
        marginTop: theme.spacing(3),
        [theme.breakpoints.down('xs')]: {
            width: '100%', // Ocupa el ancho completo en pantallas pequeñas
            justifyContent: 'center', // Centra el botón en pantallas pequeñas
        },
    },
    textField: {
        width: '200px',
        marginRight: theme.spacing(2),
        marginTop: theme.spacing(2),
        [theme.breakpoints.down('xs')]: {
            width: '100%',
            marginRight: 0,
            marginBottom: theme.spacing(2),
        },
    },
    statusIcon: {
        marginLeft: theme.spacing(1),
    },
    xmlIcon: {
        color: '#FFD700', // Amarillo
    },
    sentIcon: {
        color: '#0000FF', // Azul
    },
    inProcessIcon: {
        color: '#FFD700', // Amarillo
    },
    SendPendingIcon: {
        color: '#4dff00', // VerdeLimon
    },
    sendMailIcon: {
        color: '#0000FF', // Amarillo
        verticalAlign: 'middle',
    },
    approvedIcon: {
        color: '#008000', // Verde
    },
    viewDetailIcon: {
        color: '#FF0000', // Rojo
    },
    downloadDocumentIcon: {
        color: '#008000', // Verde
    },
    rejectedIcon: {
        color: '#FF0000', // Rojo
    },
    eventCancelacionIcon: {
        color: '#FF0000', // Rojo
    },
    eventNominacionIcon: {
        color: '#008000', // Verde
    },
    eventInutilizacionIcon: {
        color: '#FF0000', // Rojo
    },
    documentTypeLabel: {
        marginLeft: theme.spacing(2),
    },
    dialogContent: {
        overflow: 'hidden', // Para asegurar que el iframe ocupe todo el espacio
    },
    iframe: {
        width: '100%',
        height: 'calc(100vh - 200px)', // Ajusta la altura según tus necesidades
        border: 'none',
    }
}));

function DocumentosElectronicos() {

    const user = useSelector(({ auth }) => auth.user);
    let empresa = useSelector(selectEmpresaId);

    const timeZone = 'America/Asuncion'; // Especifica la zona horaria
    const classes = useStyles();
    // Estados para las fechas de filtro
    const [fechaEmisionInicial, setFechaEmisionInicial] = useState(dayjs().tz(timeZone).startOf('day').toDate());
    const [fechaEmisionFinal, setFechaEmisionFinal] = useState(dayjs().tz(timeZone).endOf('day').toDate());
    const [fechaFirmaInicial, setFechaFirmaInicial] = useState(dayjs().tz(timeZone).startOf('day').toDate());
    const [fechaFirmaFinal, setFechaFirmaFinal] = useState(dayjs().tz(timeZone).endOf('day').toDate());
    const [objeto, handleObjeto] = useState(window.location.pathname.replace(/\//g, ""));
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [activeOpen, setActiveOpen] = useState(false);
    const [nroLote, setNroLote] = useState();
    const [documentos_electronicos, handleDocumentosElectronicos] = useState([]);
    const [tipos_documentos, handleTiposDocumentos] = useState([]);
    const [buttonState, handlebuttonState] = useState(false);
    const [checkedItems, setCheckedItems] = useState({ 1: true, 4: true, 5: true, 6: true, 7: true });
    const [filterCheckedItems, setFilterCheckedItems] = useState({
        nroLote: true,
        fechaEmision: true,
        fechaFirma: true,
        estado_aprobado: false,
        estado_rechazado: false
    });
    const [pdfUrl, setPdfUrl] = useState('');
    const [openPdf, setOpenPdf] = useState(false);
    const [xmlUrl, setXmlUrl] = useState('');
    const [openXml, setOpenXml] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [openMensaje, setOpenMensaje] = useState(false);
    const [documento_electronico, setDocumentoElectronico] = useState('');
    const [selectedEvent, setSelectedEvent] = useState('');
    const [openDialog, setOpenDialog] = useState(false);

    function message(type, message) {
        enqueueSnackbar(message, {
            variant: type,
            autoHideDuration: 3000,
            preventDuplicate: true,
            anchorOrigin: {
                vertical: 'top',
                horizontal: 'right'
            }
        })
    }

    useEffect(() => {
        fetchTiposDocumentos()
        handleFilter()
    }, []);

    async function fetchTiposDocumentos() {

        const data = {
            objeto: 'tipo_documento',
            operacion: 'C'
        };

        await ControllerService.controller(data)
            .then(response => {
                if (response.data.status == "success") {
                    let options = []
                    for (const item of response.data.data) {
                        options.push({
                            codigo: item.codigo,
                            descripcion: item.descripcion,
                            defaultChecked: true
                        })
                    }
                    handleTiposDocumentos(options)

                    if (response.data.data.length == 0) {
                        message("error", 'No se encontraron resultados');
                    }
                } else {
                    message("error", JSON.stringify(response.data.message));
                }
            }).catch(error => {
                console.log(error)
                message("error", error);
            });
    }

    async function handleFilter() {

        let filter = {
            empresa,
            tipo_documento: Object.keys(checkedItems).filter(id => checkedItems[id]),
            nroLote: filterCheckedItems.nroLote ? nroLote : undefined,
            fechaEmisionInicial: filterCheckedItems.fechaEmision ? fechaEmisionInicial : undefined,
            fechaEmisionFinal: filterCheckedItems.fechaEmision ? fechaEmisionFinal : undefined,
            fechaFirmaInicial: filterCheckedItems.fechaFirma ? fechaFirmaInicial : undefined,
            fechaFirmaFinal: filterCheckedItems.fechaFirma ? fechaFirmaFinal : undefined,
            estado: filterCheckedItems.estado_aprobado ? 'Aprobado' : filterCheckedItems.estado_rechazado ? 'Rechazado' : undefined
        }

        await DocumentosElectronicosService.getList(filter)
            .then(response => {
                handleDocumentosElectronicos([])
                if (response.data.status == "success") {
                    handleDocumentosElectronicos(response.data.data)
                    if (response.data.data.length == 0) {
                        message("error", 'No se encontraron resultados');
                    }
                } else {
                    message("error", JSON.stringify(response.data.message));
                }
            }).catch(error => {
                console.log(error)
                message("error", error);
            });
    }

    async function generar_pdf(cdc) {

        try {
            const data = {
                cdc
            };

            let responseDocument = await DocumentosElectronicosService.kude(data)

            const url = URL.createObjectURL(new Blob([responseDocument.data], { type: 'application/pdf' }));
            setPdfUrl(url);
            setOpenPdf(true);

        } catch (error) {
            message('error', 'No se pudo generar el kude')
        }

    }

    async function generar_xml(cdc) {

        try {
            const data = {
                cdc
            };

            let response = await DocumentosElectronicosService.xml(data)

            // Crea una URL a partir del Blob
            const url = URL.createObjectURL(new Blob([response.data], { type: 'application/xml' }));

            // Crea un enlace de descarga
            const a = document.createElement('a');
            a.href = url;
            a.download = `${cdc}.xml`; // Nombre del archivo a descargar
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url); // Libera la URL creada

        } catch (error) {
            console.log(error)
            message('error', 'No se pudo generar el xml')
        }

    }

    async function ver_detalle(mensaje) {
        setMensaje(mensaje);
        setOpenMensaje(true);
    }

    // Manejar el cambio de estado de los checkboxes
    const handleChange = (id) => (event) => {
        console.log(id)
        setCheckedItems({
            ...checkedItems,
            [id]: event.target.checked,
        });
    };


    const handleFilterChange = (event) => {
        setFilterCheckedItems({
            ...filterCheckedItems,
            [event.target.name]: event.target.checked,
        });
    };

    const handleClose = () => {
        setOpenPdf(false);
        setPdfUrl('');
        setOpenXml(false);
        setXmlUrl('');
        setOpenMensaje(false);
        setMensaje('');
    };

    const handleEventChange = (value, documento) => {
        setSelectedEvent(value);
        setDocumentoElectronico(documento)
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    // Esta función manejará los datos enviados desde el formulario
    const handleSubmit = async (formData) => {

        formData.id_empresa = empresa

        await EventosService.sendService(formData)
            .then(response => {
                console.log(response)
                if (response.data.status == "success") {
                    message("success", response.data.message);
                } else {
                    message("error", response.data.message);
                }
            }).catch(error => {
                console.log(error)
                message("error", error);
            });

        // Cerrar el diálogo después de enviar los datos
        setOpenDialog(false);
    };

    return (
        <div className="p-24 flex flex-1 justify-center">
            <div className="fullWidth">

                {/* <Dialog open={activeOpen} onClose={handleCancelClose} classes={{ paper: classes.dialogPaper }} aria-labelledby="form-dialog-title">
                    <div align='right'><Button onClick={handleCancelClose} color="primary">
                        X
                    </Button></div>
                    <DialogTitle id="form-deactivate-dialog-title">{active ? 'Activar' : 'Desactivar'} empresa</DialogTitle>
                    <DialogContent>
                        Esta de seguro de {active ? 'activar' : 'desactivar'} la empresa
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCancelClose} color="primary">
                            Cancelar
                        </Button>
                        <Button onClick={handleEstado} color="primary">
                            Aceptar
                        </Button>
                    </DialogActions>
                </Dialog> */}

                <Dialog
                    open={openMensaje}
                    onClose={handleClose}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>Detalle de rechazo</DialogTitle>
                    <DialogContent className={classes.dialogContent}>
                        {mensaje}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cerrar
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={openXml}
                    onClose={handleClose}
                    maxWidth="lg"
                    fullWidth
                >
                    <DialogTitle>Vista previa</DialogTitle>
                    <DialogContent className={classes.dialogContent}>
                        {xmlUrl && (
                            <iframe
                                src={xmlUrl}
                                className={classes.iframe}
                                title="Documento Electrónico"
                            />
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cerrar
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={openPdf}
                    onClose={handleClose}
                    maxWidth="lg"
                    fullWidth
                >
                    <DialogTitle>Vista previa</DialogTitle>
                    <DialogContent className={classes.dialogContent}>
                        {pdfUrl && (
                            <iframe
                                src={pdfUrl}
                                className={classes.iframe}
                                title="Documento Electrónico"
                            />
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cerrar
                        </Button>
                    </DialogActions>
                </Dialog>

                <Typography className="h2 mb-24">
                    Documentos Electronicos
                </Typography>

                <Formsy className="flex flex-col justify-center" onSubmit={handleFilter}>
                    <Paper className="p-12 mt-16">

                        <Grid container className={classes.datePickerGrid}>
                            <Grid container alignItems="center" spacing={2}>
                                <Grid item>
                                    <Typography variant="subtitle1">Filtrar por:</Typography>
                                </Grid>
                                <Grid item className={classes.checkboxGrid} xs>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={filterCheckedItems.nroLote}
                                                onChange={handleFilterChange}
                                                name="nroLote"
                                                color="primary"
                                            />
                                        }
                                        label="Nro Lote"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={filterCheckedItems.fechaEmision}
                                                onChange={handleFilterChange}
                                                name="fechaEmision"
                                                color="primary"
                                            />
                                        }
                                        label="Fecha Emisión"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={filterCheckedItems.fechaFirma}
                                                onChange={handleFilterChange}
                                                name="fechaFirma"
                                                color="primary"
                                            />
                                        }
                                        label="Fecha Firma"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={filterCheckedItems.estado_aprobado}
                                                onChange={handleFilterChange}
                                                name="estado_aprobado"
                                                color="primary"
                                            />
                                        }
                                        label="Aprobados"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={filterCheckedItems.estado_rechazado}
                                                onChange={handleFilterChange}
                                                name="estado_rechazado"
                                                color="primary"
                                            />
                                        }
                                        label="Rechazados"
                                    />
                                </Grid>
                            </Grid>

                            <Hidden xsDown>
                                <MuiPickersUtilsProvider
                                    utils={DateFnsUtils}
                                    locale={esLocale}
                                >
                                    <TextField
                                        className={classes.textField}
                                        label="Nro Lote"
                                        variant="outlined"
                                        value={nroLote}
                                        onChange={(e) => setNroLote(e.target.value)}
                                    />
                                    <KeyboardDatePicker
                                        className={classes.datePicker}
                                        value={fechaEmisionInicial}
                                        onChange={setFechaEmisionInicial}
                                        label="Fecha Emisión Inicial"
                                        openTo="year"
                                        format="dd/MM/yyyy"
                                        views={["year", "month", "date"]}
                                        variant="inline"
                                        inputVariant="outlined"
                                        required
                                    />
                                    <KeyboardDatePicker
                                        className={classes.datePicker}
                                        value={fechaEmisionFinal}
                                        onChange={setFechaEmisionFinal}
                                        label="Fecha Emisión Final"
                                        openTo="year"
                                        format="dd/MM/yyyy"
                                        views={["year", "month", "date"]}
                                        variant="inline"
                                        inputVariant="outlined"
                                        required
                                    />

                                </MuiPickersUtilsProvider>
                                <MuiPickersUtilsProvider
                                    utils={DateFnsUtils}
                                    locale={esLocale}
                                >
                                    <KeyboardDatePicker
                                        className={classes.datePicker}
                                        value={fechaFirmaInicial}
                                        onChange={setFechaFirmaInicial}
                                        label="Fecha Firma Inicial"
                                        openTo="year"
                                        format="dd/MM/yyyy"
                                        views={["year", "month", "date"]}
                                        variant="inline"
                                        inputVariant="outlined"
                                        required
                                    />
                                    <KeyboardDatePicker
                                        className={classes.datePicker}
                                        value={fechaFirmaFinal}
                                        onChange={setFechaFirmaFinal}
                                        label="Fecha Firma Final"
                                        openTo="year"
                                        format="dd/MM/yyyy"
                                        views={["year", "month", "date"]}
                                        variant="inline"
                                        inputVariant="outlined"
                                        required
                                    />
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="default"
                                        className={classes.searchButton}
                                    >
                                        {buttonState ? <CircularProgress size={20} /> :
                                            <>
                                                <Icon style={{ color: 'green' }}>search</Icon> Buscar
                                            </>
                                        }
                                    </Button>
                                </MuiPickersUtilsProvider>
                            </Hidden>
                            <Hidden smUp>
                                <Grid container direction="column" alignItems="flex-start">
                                    <MuiPickersUtilsProvider
                                        utils={DateFnsUtils}
                                        locale={esLocale}
                                    >
                                        <TextField
                                            className={classes.textField}
                                            label="Nro Lote"
                                            variant="outlined"
                                            value={nroLote}
                                            onChange={(e) => setNroLote(e.target.value)}
                                        />
                                        <KeyboardDatePicker
                                            className={classes.datePicker}
                                            value={fechaEmisionInicial}
                                            onChange={setFechaEmisionInicial}
                                            label="Fecha Emisión Inicial"
                                            openTo="year"
                                            format="dd/MM/yyyy"
                                            views={["year", "month", "date"]}
                                            variant="inline"
                                            inputVariant="outlined"
                                            required
                                        />
                                        <KeyboardDatePicker
                                            className={classes.datePicker}
                                            value={fechaEmisionFinal}
                                            onChange={setFechaEmisionFinal}
                                            label="Fecha Emisión Final"
                                            openTo="year"
                                            format="dd/MM/yyyy"
                                            views={["year", "month", "date"]}
                                            variant="inline"
                                            inputVariant="outlined"
                                            required
                                        />

                                    </MuiPickersUtilsProvider>
                                    <MuiPickersUtilsProvider
                                        utils={DateFnsUtils}
                                        locale={esLocale}
                                    >
                                        <KeyboardDatePicker
                                            className={classes.datePicker}
                                            value={fechaFirmaInicial}
                                            onChange={setFechaFirmaInicial}
                                            label="Fecha Firma Inicial"
                                            openTo="year"
                                            format="dd/MM/yyyy"
                                            views={["year", "month", "date"]}
                                            variant="inline"
                                            inputVariant="outlined"
                                            required
                                        />
                                        <KeyboardDatePicker
                                            className={classes.datePicker}
                                            value={fechaFirmaFinal}
                                            onChange={setFechaFirmaFinal}
                                            label="Fecha Firma Final"
                                            openTo="year"
                                            format="dd/MM/yyyy"
                                            views={["year", "month", "date"]}
                                            variant="inline"
                                            inputVariant="outlined"
                                            required
                                        />
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="default"
                                            className={classes.searchButton}
                                        >
                                            {buttonState ? <CircularProgress size={20} /> :
                                                <>
                                                    <Icon style={{ color: 'green' }}>search</Icon> Buscar
                                                </>
                                            }
                                        </Button>
                                    </MuiPickersUtilsProvider>
                                </Grid>
                            </Hidden>
                        </Grid><br></br>
                        <Grid container className={classes.checkboxGrid}>
                            {tipos_documentos.map((item) => (
                                <Grid item key={item.codigo} className={classes.checkboxItem}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                defaultChecked={item.defaultChecked}
                                                checked={checkedItems[item.codigo] || false}
                                                onChange={handleChange(item.codigo)}
                                            />
                                        }
                                        label={item.descripcion}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                        <Grid container className={classes.iconGrid}>

                            <Typography variant="subtitle1" className={classes.documentTypeLabel}>Referencia:</Typography>
                            {/* <SignedXmlIcon className={`${classes.statusIcon} ${classes.xmlIcon}`} titleAccess="XML firmado" /> */}
                            <Icon className={`${classes.statusIcon} ${classes.xmlIcon}`} title="Documento firmado">done_all</Icon>
                            <SentIcon className={`${classes.statusIcon} ${classes.sentIcon}`} titleAccess="Enviado" />
                            <SendPending className={`${classes.statusIcon} ${classes.SendPendingIcon}`} titleAccess="Pendiente de Envio" />
                            <Icon className={`${classes.statusIcon} ${classes.inProcessIcon}`} title="Pendiente de Respuesta">pending_actions</Icon>
                            {/* <InProcessIcon className={`${classes.statusIcon} ${classes.inProcessIcon}`} titleAccess="Pendiente de Respuesta" /> */}
                            <ApprovedIcon className={`${classes.statusIcon} ${classes.approvedIcon}`} titleAccess="Aprobado" />
                            <RejectedIcon className={`${classes.statusIcon} ${classes.rejectedIcon}`} titleAccess="Rechazado" />
                            <ViewDetail className={`${classes.statusIcon} ${classes.viewDetailIcon}`} titleAccess="Ver mensaje de rechazo" />
                            <Icon className={`${classes.statusIcon} ${classes.sendMailIcon}`} title="Correo enviado">forward_to_inbox</Icon>
                            <DownloadDocument className={`${classes.statusIcon} ${classes.downloadDocumentIcon}`} titleAccess="Descargado por el cliente" />

                            {/*  <Typography variant="subtitle1" className={classes.documentTypeLabel}>Eventos:</Typography>

                            <EventCancelacion className={`${classes.statusIcon} ${classes.eventCancelacionIcon}`} titleAccess="Cancelación" />
                            <EventNominacion className={`${classes.statusIcon} ${classes.eventNominacionIcon}`} titleAccess="Nominación" />
                            <EventInutilizacion className={`${classes.statusIcon} ${classes.eventInutilizacionIcon}`} titleAccess="Inutilización" /> */}

                            <Typography variant="subtitle1" className={classes.documentTypeLabel}>Documentos:</Typography>
                            <Avatar className="md:mx-4" title='Factura Electrónica'>FE</Avatar>
                            <Avatar className="md:mx-4" title='Nota de Crédito Electrónica'>NCE</Avatar>
                            <Avatar className="md:mx-4" title='Nota de Débito Electrónica'>NDE</Avatar>
                            <Avatar className="md:mx-4" title='Nota de Remisión Electrónica'>NRE</Avatar>
                            <Avatar className="md:mx-4" title='Autofactura Electrónica'>AFE</Avatar>
                        </Grid>

                    </Paper>
                </Formsy><br></br>

                <Grid item xs={12} md={12}>
                    {(renderIf(documentos_electronicos.length > 0))(
                        <DocumentosElectronicosListItem
                            data={documentos_electronicos}
                            generar_pdf={generar_pdf}
                            generar_xml={generar_xml}
                            ver_detalle={ver_detalle}
                            selectedEvent={selectedEvent}
                            handleEventChange={handleEventChange}
                        >
                        </DocumentosElectronicosListItem>
                    )}
                </Grid>

                <EventoFormularioDialog
                    open={openDialog}
                    onClose={handleCloseDialog}
                    evento={selectedEvent}
                    onSubmit={handleSubmit}
                    documento_electronico={documento_electronico}
                />

            </div>
        </div>

    );
}

export default DocumentosElectronicos;
