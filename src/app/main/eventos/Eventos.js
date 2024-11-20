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
    RemoveRedEye as ViewDetail
} from '@material-ui/icons';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import esLocale from "date-fns/locale/es";
import React, { useState, useEffect } from "react";
import Formsy from "formsy-react";
import { useSelector } from "react-redux";
import renderIf from "render-if";
import './Eventos.css'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/styles';
import EventosService from 'app/services/EventosService';
import ControllerService from "app/services/ControllerService";
import { useSnackbar } from 'notistack';
import EventosListItem from "app/components/EventosListItem";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

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
        color: '#008000', // Rojo
    },
    rejectedIcon: {
        color: '#FF0000', // Rojo
    },
    documentTypeIconBlue: {
        color: '#0000FF', // Azul
    },
    documentTypeIconGreen: {
        color: '#008000', // Verde
    },
    documentTypeIconRed: {
        color: '#FF0000', // Rojo
    },
    documentTypeIconYellow: {
        color: '#FFD700', // Amarillo
    },
    documentTypeIconOrange: {
        color: '#FFA500', // Naranja
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

function Eventos() {

    const user = useSelector(({ auth }) => auth.user);
    let usuario = user.data.username;
    let empresa = user.data.empresa
    const timeZone = 'America/Asuncion'; // Especifica la zona horaria
    const classes = useStyles();
    // Estados para las fechas de filtro
    const [fechaInicial, setFechaInicial] = useState(dayjs().tz(timeZone).startOf('day').toDate());
    const [fechaFinal, setFechaFinal] = useState(dayjs().tz(timeZone).endOf('day').toDate());
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [activeOpen, setActiveOpen] = useState(false);
    const [eventos, handleEventos] = useState([]);
    const [tipos_documentos, handleTiposDocumentos] = useState([]);
    const [buttonState, handlebuttonState] = useState(false);
    const [checkedItems, setCheckedItems] = useState({ 1: true, 4: true, 5: true, 6: true, 7: true });
    const [mensaje, setMensaje] = useState('');
    const [openMensaje, setOpenMensaje] = useState(false);

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
            fechaInicial,
            fechaFinal
        }

        await EventosService.getList(filter)
            .then(response => {
                handleEventos([])
                if (response.data.status == "success") {
                    handleEventos(response.data.data)
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

    const handleClose = () => {
        setOpenMensaje(false);
        setMensaje('');
    };

    return (
        <div className="p-24 flex flex-1 justify-center">
            <div className="fullWidth">

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

                <Typography className="h2 mb-24">
                    Eventos
                </Typography>

                <Formsy className="flex flex-col justify-center" onSubmit={handleFilter}>
                    <Paper className="p-12 mt-16">

                        <Grid container className={classes.datePickerGrid}>
                            <Hidden xsDown>
                                <MuiPickersUtilsProvider
                                    utils={DateFnsUtils}
                                    locale={esLocale}
                                >
                                    <KeyboardDatePicker
                                        className={classes.datePicker}
                                        value={fechaInicial}
                                        onChange={setFechaInicial}
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
                                        value={fechaFinal}
                                        onChange={setFechaFinal}
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
                                        <KeyboardDatePicker
                                            className={classes.datePicker}
                                            value={fechaInicial}
                                            onChange={setFechaInicial}
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
                                            value={fechaFinal}
                                            onChange={setFechaFinal}
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
                    {(renderIf(eventos.length > 0))(
                        <EventosListItem
                            data={eventos}
                            ver_detalle={ver_detalle}
                        >
                        </EventosListItem>
                    )}
                </Grid>

            </div>
        </div>

    );
}

export default Eventos;
