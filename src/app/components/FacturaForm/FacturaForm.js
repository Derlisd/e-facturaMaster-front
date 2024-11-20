import React, { useState, useEffect } from 'react';
import {
    Grid,
    Box,
    Button,
    TextField,
    Typography,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Icon
} from "@material-ui/core";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import DeleteIcon from '@material-ui/icons/Delete';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/styles';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import esLocale from "date-fns/locale/es";
import ControllerService from 'app/services/ControllerService';
import { useSnackbar } from 'notistack';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { selectEmpresaId } from 'app/store/selectors/empresaSelectors';
import { useSelector } from "react-redux";
import Autocomplete from '@material-ui/lab/Autocomplete';
import themesConfig from 'app/fuse-configs/themesConfig';
import FacturaFormPreview from './FacturaFormPreview';
import FacturaService from 'app/services/FacturaService';

dayjs.extend(utc);
dayjs.extend(timezone);

const useStyles = makeStyles(theme => ({
    tableContainer: {
        maxWidth: '500px',  // Define el ancho máximo que deseas
        alignItems: 'flex-start'
    },
    inputContainer: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    submitButton: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: theme.spacing(2),
    },
    searchButtonCliente: {
        minWidth: '40px',  // Tamaño mínimo del botón para hacerlo cuadrado
        width: '40px',     // Ajusta esto según el tamaño del input
        height: '40px',
        borderRadius: '50%', // Botón redondeado
        marginLeft: '8px',
        marginTop: '15px',
        backgroundColor: themesConfig.default.palette.primary.main,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'  // Centrando el ícono
    },
    searchButtonProducto: {
        minWidth: '40px',  // Tamaño mínimo del botón para hacerlo cuadrado
        width: '40px',     // Ajusta esto según el tamaño del input
        height: '40px',
        borderRadius: '50%', // Botón redondeado
        backgroundColor: themesConfig.default.palette.primary.main,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'  // Centrando el ícono
    },
    subtotalText: {
        fontWeight: 'bold',
        fontSize: '1.2rem'
    }
}));

const FacturaCabeceraForm = ({ initialValues, formData, setFormData, onSubmit }) => {
    const classes = useStyles();
    const timeZone = 'America/Asuncion'; // Especifica la zona horaria
    const { enqueueSnackbar } = useSnackbar();
    const empresa = useSelector(selectEmpresaId);
    const [clientes, setClientes] = useState([]);
    const [nro_secuencia, handleNroSecuencia] = useState()
    const [tipos_documentos, setTiposDocumentos] = useState([]);
    const [tipos_transacciones, setTiposTransacciones] = useState([]);
    const [tipos_contribuyentes, setTiposContribuyentes] = useState([]);
    const [tipos_impuestos, setTiposImpuestos] = useState([]);
    const [monedas, setMonedas] = useState([]);
    const [condiciones_operaciones, setCondicionesOperaciones] = useState([]);
    const [tipos_operaciones, setTiposOperaciones] = useState([]);
    const [indicador_presencia, setIndicadorPresencia] = useState([]);
    const [tipos_naturaleza_receptor, setTiposNaturalezaReceptor] = useState([]);
    const [unidades_medida, setUnidadesMedida] = useState([]);
    const [productos, setProductos] = useState([]);
    const [sucursales, setSucursales] = useState([]);
    const [desc_empresa, handleDescEmpresa] = useState('');
    const [desc_sucursal, handleDescSucursal] = useState('');
    const [desc_punto_expedicion, handleDescPuntoExpedicion] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRucVisible, setIsRucVisible] = useState(false);
    const [openSearchCliente, setOpenSearchCliente] = useState(false);
    const [openSearchProducto, setOpenSearchProducto] = useState(false);
    const [searchQueryCliente, setSearchQueryCliente] = useState('')
    const [filteredClientes, setFilteredClientes] = useState([]);
    const [searchQueryProducto, setSearchQueryProducto] = useState('')
    const [filteredProductos, setFilteredProductos] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const puntosExpedicion = sucursales.find(s => s.punto_establecimiento === formData.cabecera.dest)?.puntos_expedicion || [];

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

    useEffect(() => {
        fetchNaturalezaReceptor()
        fetchTiposDocumentos();
        fetchTiposContribuyentes();
        fetchTiposTransacciones();
        fetchClientes();
        fetchMonedas()
        fetchCondicionesOperaciones()
        fetchTiposImpuestos()
        fetchTiposOperaciones()
        fetchIndicarPresencia()
        fetchUnidadesMedida()
        fetchProductos()
        fetchSucursales()
    }, []);

    useEffect(() => {
        fetchSucursales();
        fetchProductos();
        fetchClientes();
    }, [empresa]);

    const fetchSucursales = async () => {

        const data = {
            objeto: 'empresas_sucursales',
            data: {
                empresa,
                tipo_documento: 1
            }
        };

        await ControllerService.getListFilter(data)
            .then(response => {
                if (response.data.status === "success") {
                    setSucursales(response.data.data);
                    if (response.data.data.length === 0) {
                        message("error", 'No se encontraron resultados de sucursales');
                    }
                } else {
                    message("error", response.data.message);
                }
            }).catch(error => {
                console.log(error);
                message("error", error.message);
            });
    };

    const fetchProductos = async () => {
        const data = {
            objeto: 'productos',
            data: {
                empresa
            }
        };

        await ControllerService.getListFilter(data)
            .then(response => {
                if (response.data.status === "success") {
                    setProductos(response.data.data);
                    setFilteredProductos(response.data.data);
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
    };

    const fetchUnidadesMedida = async () => {
        const data = {
            objeto: 'unidades_de_medida',
            operacion: 'C'
        };

        await ControllerService.controller(data)
            .then(response => {
                if (response.data.status === "success") {
                    setUnidadesMedida(response.data.data);
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
    };

    const fetchIndicarPresencia = async () => {
        const data = {
            objeto: 'indicador_presencia',
            operacion: 'C'
        };

        await ControllerService.controller(data)
            .then(response => {
                if (response.data.status === "success") {
                    setIndicadorPresencia(response.data.data);
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
    };

    const fetchTiposOperaciones = async () => {
        const data = {
            objeto: 'tipo_operacion',
            operacion: 'C'
        };

        await ControllerService.controller(data)
            .then(response => {
                if (response.data.status === "success") {
                    setTiposOperaciones(response.data.data);
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
    };

    const fetchTiposImpuestos = async () => {
        const data = {
            objeto: 'tipo_impuesto',
            operacion: 'C'
        };

        await ControllerService.controller(data)
            .then(response => {
                if (response.data.status === "success") {
                    setTiposImpuestos(response.data.data);
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
    };


    const fetchCondicionesOperaciones = async () => {
        const data = {
            objeto: 'condicion_operacion',
            operacion: 'C'
        };

        await ControllerService.controller(data)
            .then(response => {
                if (response.data.status === "success") {
                    setCondicionesOperaciones(response.data.data);
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
    };

    const fetchMonedas = async () => {
        const data = {
            objeto: 'moneda'
        };

        await ControllerService.getList(data)
            .then(response => {
                if (response.data.status === "success") {
                    setMonedas(response.data.data);
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
    };

    const fetchNaturalezaReceptor = async () => {
        const data = {
            objeto: 'naturaleza_receptor',
            operacion: 'C'
        };

        await ControllerService.controller(data)
            .then(response => {
                if (response.data.status === "success") {
                    setTiposNaturalezaReceptor(response.data.data);
                    setIsRucVisible(true)
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
    };

    const fetchTiposDocumentos = async () => {
        const data = {
            objeto: 'tipo_documento_identidad',
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
    };

    const fetchTiposContribuyentes = async () => {
        const data = {
            objeto: 'tipo_contribuyente',
            operacion: 'C'
        };

        await ControllerService.controller(data)
            .then(response => {
                if (response.data.status === "success") {
                    setTiposContribuyentes(response.data.data);
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
    };

    const fetchTiposTransacciones = async () => {
        const data = {
            objeto: 'tipo_transaccion',
            operacion: 'C'
        };

        await ControllerService.controller(data)
            .then(response => {
                if (response.data.status === "success") {
                    setTiposTransacciones(response.data.data);
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
    };

    const fetchClientes = async () => {
        const data = {
            data: {
                empresa
            },
            objeto: 'clientes'
        };

        await ControllerService.getListFilter(data)
            .then(response => {
                if (response.data.status === "success") {
                    setClientes(response.data.data);
                    setFilteredClientes(response.data.data);
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
    };

    const handleDateChange = (newDate) => {

        if (!newDate || !dayjs(newDate).isValid()) {
            console.error("Fecha inválida seleccionada.");
            return;
        }

        // Forzamos la conversión de newDate en un formato válido de dayjs
        const parsedDate = dayjs(newDate);

        // Verifica si ya hay una fecha previa con hora
        const previousDateTime = formData.cabecera.dfeemide
            ? dayjs(formData.cabecera.dfeemide).tz(timeZone)
            : dayjs().tz(timeZone);

        // Crear un nuevo objeto dayjs para la nueva fecha
        const updatedDateTime = parsedDate
            .startOf('day')  // Asegúrate de que comienza al inicio del día
            .set('hour', previousDateTime.hour())
            .set('minute', previousDateTime.minute())
            .set('second', previousDateTime.second())
            .tz(timeZone, true);  // Aplicar la zona horaria manteniendo el tiempo

        // Actualiza el estado con la nueva fecha y la hora preservada
        setFormData({
            ...formData,
            cabecera: {
                ...formData.cabecera,
                dfeemide: dayjs(updatedDateTime.toDate()).tz(timeZone).format('YYYY-MM-DDTHH:mm:ssZ')  // Convierte de dayjs a un objeto Date
            }
        });
    };

    const handleChange = async (e, section) => {

        const { name, value } = e.target;

        setFormData((prevState) => ({
            ...prevState,
            [section]: {
                ...prevState[section],
                [name]: value,
            },
        }));

        if (section === 'cabecera' && name === 'dest') {
            let sucursal = sucursales.find(suc => suc.punto_establecimiento === value);
            handleDescSucursal(sucursal.descripcion);
            handleDescEmpresa(sucursal.razon_social);
        }

        if (section === 'cabecera' && name === 'dpunexp') {

            // Buscar la descripción del punto de expedición seleccionado
            const puntoSeleccionado = puntosExpedicion.find(punto => punto.punto_expedicion === value);
            if (puntoSeleccionado) {
                handleDescPuntoExpedicion(puntoSeleccionado.descripcion);
            }

            const data = {
                empresa,
                dest: formData.cabecera.dest,
                dpunexp: value
            }

            let response_sequence = await FacturaService.get_next_sequence(data)

            handleNroSecuencia(response_sequence.data.data.dnumdoc)
        }

        if (section === 'cliente' && name === 'ruc') {
            // Filtrado de clientes basado en ruc, razón social o número de documento
            const filtered = clientes.filter(cliente =>
                (cliente.ruc && cliente.ruc.toLowerCase().includes(query))
            );

            setFilteredClientes(filtered); // Actualiza el estado con los clientes filtrados
            setFormData({
                ...formData,
                cliente: {
                    tipo_documento: filtered.tipo_documento ? filtered.tipo_documento : '',
                    naturaleza: filtered.naturaleza ? filtered.naturaleza : '',
                    tipo_contribuyente: filtered.tipo_contribuyente ? filtered.tipo_contribuyente : '',
                    nro_documento: filtered.nro_documento ? filtered.nro_documento : '',
                    razon_social: filtered.razon_social ? filtered.razon_social : '',
                    ruc: filtered.ruc ? filtered.ruc : '',
                    dv: filtered.dv ? filtered.dv : '',
                    direccion: filtered.direccion ? filtered.direccion : '',
                    email: filtered.email ? filtered.email : '',
                    telefono: filtered.telefono ? filtered.telefono : '',
                    celular: filtered.celular ? filtered.celular : '',
                    nro_casa: filtered.nro_casa ? filtered.nro_casa : ''
                }
            });
        }

        if (section === 'cliente' && name === 'naturaleza') {
            setIsRucVisible(value.toString() === '1');
        }
    };

    const handleInputChange = (e, value, name) => {
        setFormData((prevState) => ({
            ...prevState,
            cliente: {
                ...prevState.cliente,
                [name]: value,  // Actualiza el campo RUC en formData.cliente
            },
        }));
    };

    const handleInputChangeProducto = (index, value) => {
        setFormData((prevState) => {
            const detallesActualizados = [...prevState.Detalles];
            detallesActualizados[index].dcodint = value;  // Actualiza el valor en el detalle específico

            return {
                ...prevState,
                Detalles: detallesActualizados,
            };
        });
    };

    // Confirmar el producto al perder el foco
    const handleConfirmProducto = (index, producto) => {
        // Verificar si el producto ya existe en filteredProductos
        const productoExistente = filteredProductos.find(prod => prod.dcodint === producto.dcodint);
        // Si no existe, lo agregamos a filteredProductos
        if (!productoExistente && producto.dcodint) {
            setFilteredProductos((prevFilteredProductos) => [
                ...prevFilteredProductos,
                producto  // Agregar el producto completo
            ]);
        }
    };

    const handleSelectChange = (e, newValue, name) => {
        if (newValue) {
            setFormData((prevState) => ({
                ...prevState,
                cliente: {
                    ...prevState.cliente,
                    [name]: newValue.ruc || '',  // Usamos el name para actualizar dinámicamente
                    dv: newValue.dv || '',
                    razon_social: newValue.razon_social || '',
                    direccion: newValue.direccion || '',
                    telefono: newValue.telefono || '',
                    email: newValue.email || '',
                    celular: newValue.celular || ''
                }
            }));
        }
    };

    const handleProductoChange = (index, newValue) => {
        if (newValue) {

            const detallesActualizados = [...formData.Detalles];
            const cantidad = detallesActualizados[index].dcantproser || 1; // Asegúrate de tener una cantidad
            const precioUnitario = newValue.duniproser || 0;
            const total_bruto_item = cantidad * precioUnitario;

            // Inicializamos los valores de base gravada e IVA líquido
            let dbasgraviva = 0;
            let dliqivaitem = 0;

            // Verificamos si el ítem está afecto a IVA
            if (newValue.iafeciva === 1) {  // Afectado por IVA
                if (newValue.dtasiva === 5) {
                    dliqivaitem = total_bruto_item / 21; // IVA 5%
                    dbasgraviva = total_bruto_item - dliqivaitem;
                } else if (newValue.dtasiva === 10) {
                    dliqivaitem = total_bruto_item / 11; // IVA 10%
                    dbasgraviva = total_bruto_item - dliqivaitem;
                }
            }

            detallesActualizados[index] = {
                ...detallesActualizados[index],
                dcodint: newValue.dcodint,
                ddesproser: newValue.ddesproser,
                iafeciva: newValue.iafeciva,
                dtasiva: newValue.dtasiva,
                cunimed: newValue.cunimed,
                dcantproser: cantidad,
                duniproser: precioUnitario,
                dtotbruopeitem: total_bruto_item,
                dtotopeitem: total_bruto_item,
                dbasgraviva: dbasgraviva,      // Base gravada
                dliqivaitem: dliqivaitem       // Liquidación del IVA
            };

            setFormData({
                ...formData,
                Detalles: detallesActualizados
            });

            // Calcular subtotales
            calculateSubtotals(detallesActualizados);
        }
    };


    // Modificar handleChangeDetails para usar cálculos no formateados
    const handleChangeDetails = (e, index = null) => {
        const { name, value } = e.target;

        // Hacer una copia del array de detalles
        const newDetalles = [...formData.Detalles];

        // Verificamos si el campo existe y luego actualizamos
        if (newDetalles[index]) {

            // Eliminar puntos o comas del valor ingresado para facilitar los cálculos
            const valorSinFormato = value.replace(/[,.]/g, '');

            // Asignar el valor sin formato al detalle correspondiente
            newDetalles[index][name] = valorSinFormato;

            // Si los valores que cambian son 'dcantproser' (cantidad) o 'duniproser' (precio), recalcular el subtotal
            if (name === 'dtasiva' || name === 'dcantproser' || name === 'duniproser') {

                // Obtener la cantidad y el precio como números sin formato
                const cantidad = parseFloat(newDetalles[index].dcantproser) || 0;
                const precio = parseFloat(newDetalles[index].duniproser) || 0;
                newDetalles[index].duniproser = precio;
                newDetalles[index].dcantproser = cantidad;
                // Calcular el subtotal bruto (sin formato)
                const dtotbruopeitem = cantidad * precio;
                newDetalles[index].dtotbruopeitem = dtotbruopeitem;
                newDetalles[index].dtotopeitem = dtotbruopeitem;

                // Obtener la tasa de IVA y calcular el impuesto
                const tasaIva = parseInt(newDetalles[index].dtasiva) || 0;
                newDetalles[index].dtasiva = tasaIva;
                let dliqivaitem = 0;

                if (tasaIva === 10) {
                    dliqivaitem = dtotbruopeitem / 11;  // IVA del 10%
                } else if (tasaIva === 5) {
                    dliqivaitem = dtotbruopeitem / 21;  // IVA del 5%
                }

                // Calcular la base gravada y el total del IVA
                newDetalles[index].dliqivaitem = dliqivaitem;
                newDetalles[index].dbasgraviva = dtotbruopeitem - dliqivaitem;
            }

            // Actualizar el estado con los detalles y los nuevos subtotales
            setFormData({
                ...formData,
                Detalles: newDetalles
            });

            // Recalcular los subtotales para todos los detalles
            calculateSubtotals(newDetalles);
        }
    };


    const handleChangeFormaPago = (event, index) => {
        const { name, value } = event.target;

        setFormData((prevFormData) => {
            // Crear una copia de la lista de formas de pago
            const updatedFormaPago = [...prevFormData.FormaPago];

            // Actualizar el campo específico dentro del objeto en el índice dado
            updatedFormaPago[index] = {
                ...updatedFormaPago[index], // copiar el objeto actual
                [name]: value               // actualizar el campo modificado
            };

            // Retornar el nuevo estado con la forma de pago actualizada
            return {
                ...prevFormData,
                FormaPago: updatedFormaPago
            };
        });
    };

    // Función para calcular los subtotales globales (sin formatear los cálculos)
    const calculateSubtotals = (detalles) => {

        const subtotals = {
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

        detalles.forEach(item => {

            switch (item.iafeciva) {
                case 1: // Operación gravada

                    if (item.dtasiva === 5) {
                        subtotals.dsub5 += item.dtotbruopeitem;
                        subtotals.dbasegrav5 += item.dbasgraviva;
                        subtotals.diva5 += item.dliqivaitem;
                    } else if (item.dtasiva === 10) {
                        subtotals.dsub10 += item.dtotbruopeitem;
                        subtotals.dbasegrav10 += item.dbasgraviva;
                        subtotals.diva10 += item.dliqivaitem;
                    }

                    break;

                case 2:  // Operación exonerada
                    subtotals.dsubexo += item.dtotbruopeitem;  // Total operación exonerada
                    break;

                case 3:  // Operación exenta
                    subtotals.dsubexe += item.dtotbruopeitem;  // Total operación exenta
                    break;

                case 4:  // Gravado parcial
                    if (item.dtasiva === 5) {
                        subtotals.dsub5 += item.dtotbruopeitem;
                        subtotals.dbasegrav5 += item.dbasgraviva;
                        subtotals.diva5 += item.dliqivaitem;
                    } else if (item.dtasiva === 10) {
                        subtotals.dsub10 += item.dtotbruopeitem;
                        subtotals.dbasegrav10 += item.dbasgraviva;
                        subtotals.diva10 += item.dliqivaitem;
                    }
                    break;
            }

            // Descuentos y anticipos
            subtotals.dtotdesc += parseFloat(item.ddescitem) || 0;
            subtotals.dtotdescglotem += parseFloat(item.ddescgloitem) || 0;
            subtotals.dtotantitem += parseFloat(item.dantpreuniit) || 0;
            subtotals.dtotant += parseFloat(item.dantglopreuniit) || 0;

            // Total bruto de la operación
            subtotals.dtotope += item.dtotbruopeitem;

            // Total neto de la operación
            subtotals.dtotgralope += item.dtotbruopeitem - (parseFloat(item.ddescitem) || 0);
        });

        // Total IVA
        subtotals.dtotiva = subtotals.diva5 + subtotals.diva10;

        // Total base gravada IVA
        subtotals.dtbasgraiva = subtotals.dbasegrav5 + subtotals.dbasegrav10;
        // Actualizar forma de pago con el total calculado
        const totalPago = subtotals.dtotope;

        setFormData(prevFormData => ({
            ...prevFormData,
            FormaPago: prevFormData.FormaPago.map(formaPago => ({
                ...formaPago,
                dmontipag: totalPago
            })),
            Subtotales: subtotals // Crear una copia profunda
        }));
    };



    const handleAddDetail = () => {
        setFormData((prevState) => ({
            ...prevState,
            Detalles: [
                ...prevState.Detalles,
                {
                    dcodint: '',
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
                }
            ]
        }));
    };

    const handleRemoveDetail = (index) => {
        const newDetails = [...formData.Detalles]; // Hacer una copia del array de detalles
        newDetails.splice(index, 1); // Eliminar el detalle en la posición 'index'

        // Actualizar el estado con los detalles y los nuevos subtotales
        setFormData({
            ...formData,
            Detalles: newDetails
        });

        calculateSubtotals(newDetails);
    };

    // Manejar el cambio en el campo Producto

    const handleFormSubmit = async () => {
        setOpenDialog(false);
        setIsLoading(true);
        try {

            // Formatear la fecha con el formato adecuado para mantener la hora en la zona local
            const formattedDate = dayjs(formData.cabecera.dfeemide).tz(timeZone).format('YYYY-MM-DDTHH:mm:ssZ');  // Incluye zona horaria

            const dataToSend = {
                ...formData,
                cabecera: {
                    ...formData.cabecera,
                    dfeemide: formattedDate  // Usamos la fecha formateada en lugar del objeto Date
                }
            };

            await onSubmit(dataToSend);
        } catch (error) {
            setIsLoading(false);
            console.error("Error guardando la cabecera de la factura", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearchCliente = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQueryCliente(query);

        // Filtrado de clientes basado en ruc, razón social o número de documento
        const filtered = clientes.filter(cliente =>
            (cliente.ruc && cliente.ruc.toLowerCase().includes(query)) ||
            (cliente.razon_social && cliente.razon_social.toLowerCase().includes(query)) ||
            (cliente.nro_documento && cliente.nro_documento.toLowerCase().includes(query))
        );

        setFilteredClientes(filtered); // Actualiza el estado con los clientes filtrados
    };

    const handleSearchProducto = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQueryProducto(query);

        // Filtrado de clientes basado en ruc, razón social o número de documento
        const filtered = productos.filter(producto =>
            (producto.dcodint && producto.dcodint.toLowerCase().includes(query)) ||
            (producto.ddesproser && producto.ddesproser.toLowerCase().includes(query)));

        setFilteredProductos(filtered); // Actualiza el estado con los productos filtrados
    };

    const handleDoubleClick = (cliente) => {
        // Aquí puedes capturar el cliente seleccionado

        setFormData({
            ...formData,
            cliente: {
                tipo_documento: cliente.tipo_documento ? cliente.tipo_documento : '',
                naturaleza: cliente.naturaleza ? cliente.naturaleza : '',
                tipo_contribuyente: cliente.tipo_contribuyente ? cliente.tipo_contribuyente : '',
                nro_documento: cliente.nro_documento ? cliente.nro_documento : '',
                razon_social: cliente.razon_social ? cliente.razon_social : '',
                ruc: cliente.ruc ? cliente.ruc : '',
                dv: cliente.dv ? cliente.dv : '',
                direccion: cliente.direccion ? cliente.direccion : '',
                email: cliente.email ? cliente.email : '',
                telefono: cliente.telefono ? cliente.telefono : '',
                celular: cliente.celular ? cliente.celular : '',
                nro_casa: cliente.nro_casa ? cliente.nro_casa : ''
            }
        });

        setOpenSearchCliente(false); // Cierra el diálogo
    };

    const handleDoubleClickProducto = (producto, index) => {

        const cantidad = 1; // Asegúrate de tener una cantidad
        const total_bruto_item = cantidad * producto.duniproser;

        // Inicializamos los valores de base gravada e IVA líquido
        let dbasgraviva = 0;
        let dliqivaitem = 0;

        // Verificamos si el ítem está afecto a IVA
        if (producto.iafeciva === 1) {  // Afectado por IVA
            if (producto.dtasiva === 5) {
                dliqivaitem = total_bruto_item / 21; // IVA 5%
                dbasgraviva = total_bruto_item - dliqivaitem;
            } else if (producto.dtasiva === 10) {
                dliqivaitem = total_bruto_item / 11; // IVA 10%
                dbasgraviva = total_bruto_item - dliqivaitem;
            }
        }

        const newDetalles = [...formData.Detalles];
        newDetalles[index].dcodint = producto.dcodint;
        newDetalles[index].dgtin = producto.dgtin;
        newDetalles[index].ddesproser = producto.ddesproser;
        newDetalles[index].cunimed = producto.cunimed;
        newDetalles[index].duniproser = producto.duniproser;
        newDetalles[index].iafeciva = producto.iafeciva;
        newDetalles[index].dcantproser = cantidad;
        newDetalles[index].dtotbruopeitem = total_bruto_item;
        newDetalles[index].dtotopeitem = total_bruto_item;
        newDetalles[index].dbasgraviva = dbasgraviva;
        newDetalles[index].dliqivaitem = dliqivaitem;

        setFormData({
            ...formData,
            Detalles: newDetalles
        });

        // Recalcular los subtotales para todos los detalles
        calculateSubtotals(newDetalles);

        setOpenSearchProducto(false); // Cierra el diálogo
    };

    const handleOpenDialogSearchCliente = () => {
        fetchClientes();
        setOpenSearchCliente(true);
    };

    const handleOpenDialogSearchProducto = () => {
        fetchProductos()
        setOpenSearchProducto(true);
    };

    const handleCloseDialog = () => {
        setOpenSearchCliente(false);
        setOpenSearchProducto(false);
        setOpenDialog(false);
    };

    const handleRemove = () => {
        // Limpia los datos del formulario
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
    }

    const ClienteSearch = (
        <Dialog open={openSearchCliente} onClose={() => setOpenSearchCliente(false)} fullWidth PaperProps={{
            style: {
                position: 'absolute',
                top: '0%',  // Ajustar este valor para mover el diálogo más arriba
                transform: 'translate(0, 0)'
            }
        }}>
            <DialogTitle>
                Buscar Cliente
                <IconButton
                    aria-label="close"
                    onClick={handleCloseDialog}
                    style={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    label="Buscar por razón social o nro de documento"
                    value={searchQueryCliente}
                    onChange={handleSearchCliente}
                    margin="dense"
                />
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ width: '20%' }}>Nro Documento</TableCell>
                            <TableCell style={{ width: '40%' }}>Razon Social</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredClientes.map((cliente) => (
                            <TableRow
                                key={cliente.id}
                                onDoubleClick={() => handleDoubleClick(cliente)}
                                hover
                            >
                                <TableCell>{cliente.ruc ? `${cliente.ruc}-${cliente.dv}` : cliente.nro_documento}</TableCell>
                                <TableCell>{cliente.razon_social}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </DialogContent>
        </Dialog>
    )

    const ProductoSearch = (
        <Dialog open={openSearchProducto} onClose={() => setOpenSearchProducto(false)} fullWidth PaperProps={{
            style: {
                position: 'absolute',
                top: '0%',  // Ajustar este valor para mover el diálogo más arriba
                transform: 'translate(0, 0)'
            }
        }}>
            <DialogTitle>
                Buscar Producto
                <IconButton
                    aria-label="close"
                    onClick={handleCloseDialog}
                    style={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    label="Buscar por codigo o descripción"
                    value={searchQueryProducto}
                    onChange={handleSearchProducto}
                    margin="dense"
                />
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ width: '20%' }}>Cod Producto</TableCell>
                            <TableCell style={{ width: '40%' }}>Descripción</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredProductos.map((producto, index) => (
                            <TableRow
                                key={producto.id}
                                onDoubleClick={() => handleDoubleClickProducto(producto, index)}
                                hover
                            >
                                <TableCell>{producto.dgtin ? producto.dgtin : producto.dcodint}</TableCell>
                                <TableCell>{producto.ddesproser}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </DialogContent>
        </Dialog>
    )

    const handleOpen = () => {
        setOpenDialog(true);
    };

    return (
        <Box>
            <form>
                <Typography variant="h6" gutterBottom>
                    Datos de la Factura
                </Typography>

                <Grid container spacing={2} className={classes.inputContainer}>

                    {/* Sucursal */}
                    <Grid item xs={12} md={1}>
                        <FormControl fullWidth variant="outlined" required>
                            <InputLabel>Sucursal</InputLabel>
                            <Select
                                name="dest"
                                value={formData.cabecera.dest}
                                onChange={(e) => handleChange(e, 'cabecera')}
                                label="Sucursal"
                            >
                                {sucursales.map(sucursal => (
                                    <MenuItem key={sucursal.id} value={sucursal.punto_establecimiento}>
                                        {sucursal.punto_establecimiento}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Descripcion de la sucursal */}
                    <Grid item xs={12} md={2}>
                        <TextField
                            name="desc_sucursal"
                            label="Descripción"
                            value={desc_sucursal}
                            fullWidth
                            variant="outlined"
                            disabled
                        />
                    </Grid>

                    {/* Punto de Expedición */}
                    <Grid item xs={12} md={1}>
                        <FormControl fullWidth variant="outlined" required>
                            <InputLabel>Punt. Exp.</InputLabel>
                            <Select
                                name="dpunexp"
                                value={formData.cabecera.dpunexp}
                                onChange={(e) => handleChange(e, 'cabecera')}
                                label="Punt. Exp."
                                disabled={puntosExpedicion.length === 0}
                            >
                                {puntosExpedicion.map(punto => (
                                    <MenuItem key={punto.id} value={punto.punto_expedicion}>
                                        {punto.punto_expedicion} {/* Mostrar el punto de expedición */}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Descripcion del punto de expedición */}
                    <Grid item xs={12} md={2}>
                        <TextField
                            name="desc_punto_expedicion"
                            label="Descripción"
                            value={desc_punto_expedicion}
                            fullWidth
                            variant="outlined"
                            disabled
                        />
                    </Grid>

                    {/* Nro de secuencia */}
                    <Grid item xs={12} md={2}>
                        <TextField
                            name="nro_secuencia"
                            label="Nro Secuencia"
                            value={nro_secuencia || ''}
                            fullWidth
                            variant="outlined"
                            disabled
                        />
                    </Grid>

                    <Grid item xs={12} md={2}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>
                            <KeyboardDatePicker
                                className={classes.datePicker}
                                value={formData.cabecera.dfeemide}  // Mantén la fecha y hora en el estado
                                onChange={(date) => handleDateChange(date)}  // Llama a la función que mantiene la zona horaria y hora
                                label="Fecha Emisión"
                                format="dd/MM/yyyy"  // Solo mostrarás la fecha
                                variant="inline"
                                inputVariant="outlined"
                                required
                            />
                        </MuiPickersUtilsProvider>
                    </Grid>

                    <Grid item xs={12} md={2}>
                        <FormControl fullWidth variant="outlined" required>
                            <InputLabel>Moneda</InputLabel>
                            <Select
                                name="moneda"
                                value={formData.cabecera.moneda_id}
                                onChange={(e) => handleChange(e, 'cabecera')}
                                label="Moneda"
                            >
                                {monedas.map(moneda => (
                                    <MenuItem key={moneda.id} value={moneda.codigo}>
                                        {moneda.descripcion}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={2}>
                        <FormControl fullWidth variant="outlined" required>
                            <InputLabel>Condición de la operación</InputLabel>
                            <Select
                                name="condicion_operacion_id"
                                value={formData.cabecera.condicion_operacion_id}
                                onChange={(e) => handleChange(e, 'cabecera')}
                                label="Condición de la operación"
                            >
                                {condiciones_operaciones.map(condicion => (
                                    <MenuItem key={condicion.id} value={condicion.codigo}>
                                        {condicion.descripcion}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={2}>
                        <FormControl fullWidth variant="outlined" required>
                            <InputLabel>Tipo de Transacción</InputLabel>
                            <Select
                                name="tipo_transaccion_id"
                                value={formData.cabecera.tipo_transaccion_id}
                                onChange={(e) => handleChange(e, 'cabecera')}
                                label="Tipo de Transacción"
                            >
                                {tipos_transacciones.map(trans => (
                                    <MenuItem key={trans.id} value={trans.codigo}>
                                        {trans.descripcion}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={2}>
                        <FormControl fullWidth variant="outlined" required>
                            <InputLabel>Indicar de Presencia</InputLabel>
                            <Select
                                name="indicador_presencia"
                                value={formData.cabecera.indicador_presencia}
                                onChange={(e) => handleChange(e, 'cabecera')}
                                label="Indicar de Presencia"
                            >
                                {indicador_presencia.map(trans => (
                                    <MenuItem key={trans.id} value={trans.codigo}>
                                        {trans.descripcion}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* <Grid item xs={12} md={2}>
                        <FormControl fullWidth variant="outlined" required>
                            <InputLabel>Tipo Operación</InputLabel>
                            <Select
                                name="tipo_operacion_id"
                                value={formData.cabecera.tipo_operacion_id}
                                onChange={(e) => handleChange(e, 'cabecera')}
                                label="Tipo Operación"
                            >
                                {tipos_operaciones.map(trans => (
                                    <MenuItem key={trans.id} value={trans.codigo}>
                                        {trans.detalle_descripcion}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid> */}

                    {/* <Grid item xs={12} md={6}>
                        <TextField
                            name="dinfoemi"
                            label="Información Emisión"
                            value={formData.cabecera.dinfoemi}
                            onChange={(e) => handleChange(e, 'cabecera')}
                            required
                            fullWidth
                            variant="outlined"
                        />
                    </Grid> */}
                </Grid>

                <Typography variant="h6" gutterBottom>
                    Datos del Cliente
                </Typography>

                <Grid container spacing={2} className={classes.inputContainer}>

                    <Button
                        variant="contained"
                        color="primary"
                        title='Buscar cliente'
                        startIcon={<SearchIcon style={{ marginLeft: '13px' }} />}
                        onClick={handleOpenDialogSearchCliente}
                        className={classes.searchButtonCliente}
                    >
                    </Button>

                    {/* Naturaleza Receptor */}
                    <Grid item xs={12} md={2}>
                        <FormControl fullWidth variant="outlined" required>
                            <InputLabel>Naturaleza Receptor</InputLabel>
                            <Select
                                name="naturaleza"
                                value={formData.cliente.naturaleza}
                                onChange={(e) => handleChange(e, 'cliente')}
                                label="Naturaleza Receptor"
                            >
                                {tipos_naturaleza_receptor.map(contrib => (
                                    <MenuItem key={contrib.id} value={contrib.codigo}>
                                        {contrib.descripcion}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {isRucVisible ? (
                        <>
                            {/* Tipo de Contribuyente */}
                            <Grid item xs={12} md={2}>
                                <FormControl fullWidth variant="outlined" required>
                                    <InputLabel>Tipo de Contribuyente</InputLabel>
                                    <Select
                                        name="tipo_contribuyente"
                                        value={formData.cliente.tipo_contribuyente}
                                        onChange={(e) => handleChange(e, 'cliente')}
                                        label="Tipo de Contribuyente"
                                    >
                                        {tipos_contribuyentes.map(contrib => (
                                            <MenuItem key={contrib.id} value={contrib.codigo}>
                                                {contrib.descripcion}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            {/* Campos RUC y DV */}
                            <Grid item xs={12} md={2}>
                                <Autocomplete
                                    freeSolo
                                    options={clientes}
                                    getOptionLabel={(option) => option.ruc || ''}
                                    onInputChange={(e, value) => handleInputChange(e, value, 'ruc')}  // onInputChange para escribir el valor
                                    onChange={(e, newValue) => handleSelectChange(e, newValue, 'ruc')}  // onChange para seleccionar una opción
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            value={formData.cliente.ruc}
                                            label="RUC"
                                            variant="outlined"
                                            fullWidth
                                        />
                                    )}
                                    value={clientes.find(cliente => cliente.ruc === formData.cliente.ruc) || ''}
                                />
                            </Grid>

                            <Grid item xs={12} md={1}>
                                <TextField
                                    name="dv"
                                    label="DV"
                                    value={formData.cliente.dv}
                                    onChange={(e) => handleChange(e, 'cliente')}
                                    fullWidth
                                    variant="outlined"
                                />
                            </Grid>
                        </>
                    ) : (
                        <>
                            {/* Tipo de Documento y Número de Documento si naturaleza es 2 */}
                            <Grid item xs={12} md={2}>
                                <FormControl fullWidth variant="outlined" required>
                                    <InputLabel>Tipo de Documento</InputLabel>
                                    <Select
                                        name="tipo_documento"
                                        value={formData.cliente.tipo_documento}
                                        onChange={(e) => handleChange(e, 'cliente')}
                                        label="Tipo de Documento"
                                    >
                                        {tipos_documentos.map(doc => (
                                            <MenuItem key={doc.id} value={doc.codigo}>
                                                {doc.descripcion}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <TextField
                                    name="nro_documento"
                                    label="Número de Documento"
                                    value={formData.cliente.nro_documento}
                                    onChange={(e) => handleChange(e, 'cliente')}
                                    fullWidth
                                    variant="outlined"
                                />
                            </Grid>
                        </>
                    )}

                    {/* Razón Social */}
                    <Grid item xs={12} md={4}>
                        <TextField
                            name="razon_social"
                            label="Razón Social"
                            value={formData.cliente.razon_social}
                            onChange={(e) => handleChange(e, 'cliente')}
                            fullWidth
                            variant="outlined"
                            required
                        />
                    </Grid>

                    {/* Dirección */}
                    {/* <Grid item xs={12} md={4}>
                        <TextField
                            name="direccion"
                            label="Dirección"
                            value={formData.cliente.direccion}
                            onChange={(e) => handleChange(e, 'cliente')}
                            fullWidth
                            variant="outlined"
                        />
                    </Grid> */}

                    {/* Email */}
                    <Grid item xs={12} md={2}>
                        <TextField
                            name="email"
                            label="Email"
                            value={formData.cliente.email}
                            onChange={(e) => handleChange(e, 'cliente')}
                            fullWidth
                            variant="outlined"
                        />
                    </Grid>

                    {/* Telefono */}
                    <Grid item xs={12} md={2}>
                        <TextField
                            name="telefono"
                            label="Teléfono"
                            value={formData.cliente.telefono}
                            onChange={(e) => handleChange(e, 'cliente')}
                            fullWidth
                            variant="outlined"
                        />
                    </Grid>

                    {/* Celular */}
                    <Grid item xs={12} md={2}>
                        <TextField
                            name="celular"
                            label="Celular"
                            value={formData.cliente.celular}
                            onChange={(e) => handleChange(e, 'cliente')}
                            fullWidth
                            variant="outlined"
                        />
                    </Grid>
                </Grid>

                {/* Detalles de la Factura */}
                <Box display="flex" alignItems="center" mb={2}>
                    <Typography variant="h6" gutterBottom>
                        Detalles de la Factura
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddCircleOutlineIcon />}
                        onClick={handleAddDetail}
                        style={{ marginLeft: '16px' }}
                    >
                        Añadir Producto
                    </Button>
                </Box>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ width: '5%' }}></TableCell>
                                <TableCell style={{ width: '15%' }}>Producto</TableCell>
                                <TableCell style={{ width: '30%' }}>Descripción</TableCell>
                                <TableCell style={{ width: '5%' }}>Porc. IVA</TableCell>
                                <TableCell style={{ width: '10%' }}>Uni. Med.</TableCell>
                                <TableCell style={{ width: '5%' }}>Cantidad</TableCell>
                                <TableCell style={{ width: '10%' }}>Prec. Uni.</TableCell>
                                <TableCell style={{ width: '10%' }}>Subtotal</TableCell>
                                <TableCell style={{ width: '10%' }}>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {formData.Detalles.map((detalle, index) => (
                                <TableRow key={index}>

                                    <TableCell style={{ width: '5%' }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            title='Buscar productos'
                                            startIcon={<SearchIcon style={{ marginLeft: '13px' }} />}
                                            onClick={handleOpenDialogSearchProducto}
                                            className={classes.searchButtonProducto}
                                        >
                                        </Button>
                                    </TableCell>

                                    {/* Producto */}
                                    <TableCell style={{ width: '15%' }}>
                                        <Autocomplete
                                            freeSolo
                                            options={filteredProductos}
                                            getOptionLabel={(option) => option.dcodint || ''}
                                            onInputChange={(e, value) => handleInputChangeProducto(index, value)}  // Pasa el índice y el valor
                                            onChange={(e, newValue) => handleProductoChange(index, newValue)}  // Pasa el índice y el nuevo valor
                                            onBlur={() => handleConfirmProducto(index, formData.Detalles[index])}  // Confirma el producto completo
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    value={formData.Detalles[index].dcodint}  // Valor del campo específico en la fila
                                                    variant="outlined"
                                                    fullWidth
                                                />
                                            )}
                                            value={filteredProductos.find(producto => producto.dcodint === formData.Detalles[index].dcodint) || null}  // Valor del Autocomplete
                                        />
                                    </TableCell>

                                    <TableCell style={{ width: '30%' }}>
                                        <TextField
                                            name="ddesproser"
                                            value={detalle.ddesproser}
                                            onChange={(e) => handleChangeDetails(e, index)}
                                            fullWidth
                                            variant="outlined"
                                            required
                                        />
                                    </TableCell>
                                    <TableCell style={{ width: '5%' }}>
                                        <FormControl fullWidth variant="outlined" required>
                                            <Select
                                                name="dtasiva"
                                                value={parseInt(detalle.dtasiva)}
                                                onChange={(e) => handleChangeDetails(e, index)}
                                            >
                                                <MenuItem value="5">
                                                    5%
                                                </MenuItem>
                                                <MenuItem value="10">
                                                    10%
                                                </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </TableCell>
                                    <TableCell style={{ width: '10%' }}>
                                        <FormControl fullWidth variant="outlined" required>
                                            <Select
                                                name="cunimed"
                                                value={detalle.cunimed}
                                                onChange={(e) => handleChangeDetails(e, index)}
                                            >
                                                {unidades_medida.map(unidad_medida => (
                                                    <MenuItem key={unidad_medida.id} value={unidad_medida.codigo}>
                                                        {unidad_medida.descripcion}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </TableCell>
                                    <TableCell style={{ width: '8%' }}>
                                        <TextField
                                            name="dcantproser"
                                            value={detalle.dcantproser}
                                            onChange={(e) => handleChangeDetails(e, index)}
                                            fullWidth
                                            variant="outlined"
                                            required
                                        />
                                    </TableCell>
                                    <TableCell style={{ width: '10%' }}>
                                        <TextField
                                            name="duniproser"
                                            value={formatNumber(formData.cabecera.moneda_id, detalle.duniproser, 0)}
                                            onChange={(e) => handleChangeDetails(e, index)}
                                            fullWidth
                                            variant="outlined"
                                            required
                                        />
                                    </TableCell>
                                    <TableCell style={{ width: '10%' }}>
                                        <TextField
                                            name="dtotbruopeitem"
                                            value={formatNumber(formData.cabecera.moneda_id, detalle.dtotbruopeitem, 0)}
                                            fullWidth
                                            variant="outlined"
                                            disabled
                                        />
                                    </TableCell>
                                    <TableCell style={{ width: '5%' }}>
                                        <IconButton onClick={() => handleRemoveDetail(index)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Forma de Pago */}
                {/* <Box display="flex" alignItems="center" mb={2} className={classes.inputContainer}>
                    <Typography variant="h6" gutterBottom>
                        Forma de Pago
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddCircleOutlineIcon />}
                        onClick={handleAddDetail}
                        style={{ marginLeft: '16px' }}
                    >
                        Añadir
                    </Button>
                </Box>

                <TableContainer component={Paper} className={classes.tableContainer}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ width: '5%' }}>Método de Pago</TableCell>
                                <TableCell style={{ width: '5%' }}>Monto</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {formData.FormaPago.map((forma_pago, index) => (
                                <TableRow key={index}>

                                    <TableCell style={{ width: '10%' }}>
                                        <FormControl fullWidth variant="outlined" required>
                                            <Select
                                                name="medio_pago_id"
                                                value={forma_pago.medio_pago_id}
                                                onChange={(e) => handleChangeFormaPago(e, index)}
                                            >
                                                <MenuItem value="1">
                                                    Efectivo
                                                </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </TableCell>

                                    <TableCell style={{ width: '10%' }}>
                                        <TextField
                                            name="dmontipag"
                                            value={forma_pago.dmontipag}
                                            fullWidth
                                            variant="outlined"
                                            disabled
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer> */}

                <Box mt={4}>
                    <Typography variant="h6">Subtotales</Typography>
                    <Grid container spacing={2} className={classes.inputContainer}>
                        {/* dsubexe */}
                        <Grid item xs={12} sm={2}>
                            <TextField
                                label="Subtotal Exento"
                                name="dsubexe"
                                fullWidth
                                variant="outlined"
                                value={formatNumber(formData.cabecera.moneda_id, formData.Subtotales.dsubexe, 0) || formData.Subtotales.dsubexe}
                                InputProps={{
                                    style: {
                                        maxWidth: '100%',
                                        fontWeight: 'bold',
                                        fontSize: '15px',
                                        height: '30px',
                                        padding: '0px 0px'
                                    },
                                    readOnly: true,
                                }}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </Grid>

                        {/* dsub5 */}
                        <Grid item xs={12} sm={2}>
                            <TextField
                                label="Subtotal 5%"
                                name="dsub5"
                                fullWidth
                                variant="outlined"
                                value={formatNumber(formData.cabecera.moneda_id, formData.Subtotales.dsub5, 0) || formData.Subtotales.dsub5}
                                InputProps={{
                                    style: {
                                        maxWidth: '100%',
                                        fontWeight: 'bold',
                                        fontSize: '15px',
                                        height: '30px',
                                        padding: '0px 0px'
                                    },
                                    readOnly: true,
                                }}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </Grid>

                        {/* dsub10 */}
                        <Grid item xs={12} sm={2}>
                            <TextField
                                label="Subtotal 10%"
                                name="dsub10"
                                fullWidth
                                variant="outlined"
                                value={formatNumber(formData.cabecera.moneda_id, formData.Subtotales.dsub10, 0) || formData.Subtotales.dsub10}
                                InputProps={{
                                    style: {
                                        maxWidth: '100%',
                                        fontWeight: 'bold',
                                        fontSize: '15px',
                                        height: '30px',
                                        padding: '0px 0px'
                                    },
                                    readOnly: true,
                                }}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </Grid>

                        {/* dtotope */}
                        <Grid item xs={12} sm={2}>
                            <TextField
                                label="Total Operación"
                                name="dtotope"
                                fullWidth
                                variant="outlined"
                                value={formatNumber(formData.cabecera.moneda_id, formData.Subtotales.dtotope, 0) || formData.Subtotales.dtotope}
                                InputProps={{
                                    style: {
                                        maxWidth: '100%',
                                        fontWeight: 'bold',
                                        fontSize: '15px',
                                        height: '30px',
                                        padding: '0px 0px'
                                    },
                                    readOnly: true,
                                }}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </Grid>

                        {/* diva5 */}
                        <Grid item xs={12} sm={2}>
                            <TextField
                                label="IVA 5%"
                                name="diva5"
                                fullWidth
                                variant="outlined"
                                value={formatNumber(formData.cabecera.moneda_id, formData.Subtotales.diva5, 0) || formData.Subtotales.diva5}
                                InputProps={{
                                    style: {
                                        maxWidth: '100%',
                                        fontWeight: 'bold',
                                        fontSize: '15px',
                                        height: '30px',
                                        padding: '0px 0px'
                                    },
                                    readOnly: true,
                                }}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </Grid>

                        {/* diva10 */}
                        <Grid item xs={12} sm={2}>
                            <TextField
                                label="IVA 10%"
                                name="diva10"
                                fullWidth
                                variant="outlined"
                                value={formatNumber(formData.cabecera.moneda_id, formData.Subtotales.diva10, 0) || formData.Subtotales.diva10}
                                InputProps={{
                                    style: {
                                        maxWidth: '100%',
                                        fontWeight: 'bold',
                                        fontSize: '15px',
                                        height: '30px',
                                        padding: '0px 0px'
                                    },
                                    readOnly: true,
                                }}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </Grid>

                        {/* dliqtotiva5 */}
                        <Grid item xs={12} sm={2}>
                            <TextField
                                label="Liquidación IVA 5%"
                                name="dliqtotiva5"
                                fullWidth
                                variant="outlined"
                                value={formatNumber(formData.cabecera.moneda_id, formData.Subtotales.dliqtotiva5, 0) || formData.Subtotales.dliqtotiva5}
                                InputProps={{
                                    style: {
                                        maxWidth: '100%',
                                        fontWeight: 'bold',
                                        fontSize: '15px',
                                        height: '30px',
                                        padding: '0px 0px'
                                    },
                                    readOnly: true,
                                }}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </Grid>

                        {/* dliqtotiva10 */}
                        <Grid item xs={12} sm={2}>
                            <TextField
                                label="Liquidación IVA 10%"
                                name="dliqtotiva10"
                                fullWidth
                                variant="outlined"
                                value={formatNumber(formData.cabecera.moneda_id, formData.Subtotales.dliqtotiva10, 0) || formData.Subtotales.dliqtotiva10}
                                InputProps={{
                                    style: {
                                        maxWidth: '100%',
                                        fontWeight: 'bold',
                                        fontSize: '15px',
                                        height: '30px',
                                        padding: '0px 0px'
                                    },
                                    readOnly: true,
                                }}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </Grid>

                        {/* dtotiva */}
                        <Grid item xs={12} sm={2}>
                            <TextField
                                label="Total IVA"
                                name="dtotiva"
                                fullWidth
                                variant="outlined"
                                value={formatNumber(formData.cabecera.moneda_id, formData.Subtotales.dtotiva, 0) || formData.Subtotales.dtotiva}
                                InputProps={{
                                    style: {
                                        maxWidth: '100%',
                                        fontWeight: 'bold',
                                        fontSize: '15px',
                                        height: '30px',
                                        padding: '0px 0px'
                                    },
                                    readOnly: true,
                                }}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </Grid>

                        {/* dbasegrav5 */}
                        <Grid item xs={12} sm={2}>
                            <TextField
                                label="Base Gravada 5%"
                                name="dbasegrav5"
                                fullWidth
                                variant="outlined"
                                value={formatNumber(formData.cabecera.moneda_id, formData.Subtotales.dbasegrav5, 0) || formData.Subtotales.dbasegrav5}
                                InputProps={{
                                    style: {
                                        maxWidth: '100%',
                                        fontWeight: 'bold',
                                        fontSize: '15px',
                                        height: '30px',
                                        padding: '0px 0px'
                                    },
                                    readOnly: true,
                                }}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </Grid>

                        {/* dbasegrav10 */}
                        <Grid item xs={12} sm={2}>
                            <TextField
                                label="Base Gravada 10%"
                                name="dbasegrav10"
                                fullWidth
                                variant="outlined"
                                value={formatNumber(formData.cabecera.moneda_id, formData.Subtotales.dbasegrav10, 0) || formData.Subtotales.dbasegrav10}
                                InputProps={{
                                    style: {
                                        maxWidth: '100%',
                                        fontWeight: 'bold',
                                        fontSize: '15px',
                                        height: '30px',
                                        padding: '0px 0px'
                                    },
                                    readOnly: true,
                                }}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </Grid>

                        {/* dtbasgraiva */}
                        <Grid item xs={12} sm={2}>
                            <TextField
                                label="Total Base Gravada IVA"
                                name="dtbasgraiva"
                                fullWidth
                                variant="outlined"
                                value={formatNumber(formData.cabecera.moneda_id, formData.Subtotales.dtbasgraiva, 0) || formData.Subtotales.dtbasgraiva}
                                InputProps={{
                                    style: {
                                        maxWidth: '100%',
                                        fontWeight: 'bold',
                                        fontSize: '15px',
                                        height: '30px',
                                        padding: '0px 0px'
                                    },
                                    readOnly: true,
                                }}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </Grid>

                        {/* dtotgralope */}
                        <Grid item xs={12} sm={2}>
                            <TextField
                                label="Total General de la Operación"
                                name="dtotgralope"
                                fullWidth
                                variant="outlined"
                                value={formatNumber(formData.cabecera.moneda_id, formData.Subtotales.dtotgralope, 0) || formData.Subtotales.dtotgralope}
                                InputProps={{
                                    style: {
                                        maxWidth: '100%',
                                        fontWeight: 'bold',
                                        fontSize: '15px',
                                        height: '30px',
                                        padding: '0px 0px'
                                    },
                                    readOnly: true,
                                }}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </Grid>

                    </Grid>
                </Box>

                <Grid container spacing={2} className={classes.submitButton}>
                    <Grid item xs={12}>
                        <Button
                            type="button"
                            variant="contained"
                            color="primary"
                            onClick={handleOpen}
                        >
                            {isLoading ? <CircularProgress size={20} style={{ color: 'white' }} /> : <><Icon style={{ color: 'white' }}>save</Icon> Grabar esta factura</>}
                        </Button>
                        <Button
                            type="button"
                            variant="contained"
                            color="primary"
                            onClick={handleRemove}
                            style={{ marginLeft: '10px', backgroundColor: 'red' }}
                        >
                            <Icon style={{ color: 'white' }}>cancel</Icon> Cancelar
                        </Button>
                    </Grid>
                </Grid>
            </form>

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
                <DialogTitle>Confirmar datos de la Factura - Emisor: {desc_empresa}</DialogTitle>
                <DialogContent dividers>
                    <FacturaFormPreview
                        tipos_documentos={tipos_documentos}
                        tipos_transacciones={tipos_transacciones}
                        tipos_contribuyentes={tipos_contribuyentes}
                        tipos_impuestos={tipos_impuestos}
                        monedas={monedas}
                        condiciones_operaciones={condiciones_operaciones}
                        tipos_operaciones={tipos_operaciones}
                        indicadores_presencia={indicador_presencia}
                        tipos_naturaleza_receptor={tipos_naturaleza_receptor}
                        unidades_medida={unidades_medida}
                        formData={formData}
                        desc_sucursal={desc_sucursal}
                        nro_secuencia={nro_secuencia}
                        classes={classes}
                        formatNumber={formatNumber}
                        isRucVisible={isRucVisible}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        type="button"
                        onClick={handleFormSubmit}
                        variant="contained"
                        color="primary"
                        disabled={isLoading}
                    >
                        {isLoading ? <CircularProgress size={20} style={{ color: 'white' }} /> : <><Icon style={{ color: 'white' }}>check-circle</Icon> Confirmar</>}
                    </Button>
                    <Button onClick={handleCloseDialog} color="primary" style={{ backgroundColor: 'red', color: 'white' }}>
                        <><Icon style={{ color: 'white' }}>cancel</Icon> Cerrar</>
                    </Button>
                </DialogActions>
            </Dialog>

            {ClienteSearch}
            {ProductoSearch}
        </Box>
    );
};

export default FacturaCabeceraForm;
