import React, { useState } from "react";
import {
    Typography,
    Grid,
    Button,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Paper,
    TableContainer,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Icon
} from "@material-ui/core";
import { useSelector } from "react-redux";
import { makeStyles } from '@material-ui/styles';
import { useSnackbar } from 'notistack';
import DocumentosElectronicosService from "app/services/DocumentosElectronicosService";
import moment from "moment";
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import DescriptionIcon from '@material-ui/icons/Description';

const useStyles = makeStyles(theme => ({
    container: {
        padding: theme.spacing(2),
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: theme.shadows[3],
        margin: theme.spacing(2),
        width: '100%'
    },
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%'
    },
    formContainer: {
        width: '100%',
        padding: theme.spacing(3),
        marginBottom: theme.spacing(2), // Reducir el margen inferior
    },
    textField: {
        marginBottom: theme.spacing(2)
    },
    downloadButtons: {
        display: 'flex',
        justifyContent: 'flex-start', // Alinear los botones a la izquierda
        marginBottom: theme.spacing(2)
    },
    detailSection: {
        marginTop: theme.spacing(4), // Reducir el margen superior
        width: '100%',
        padding: theme.spacing(3)
    },
    tableContainer: {
        maxWidth: '100%',
        overflowX: 'auto'
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'flex-end', // Alinear el botón a la derecha
        marginBottom: theme.spacing(2),
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

function Empresas() {
    const user = useSelector(({ auth }) => auth.user);
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const [cdc, handleCdc] = useState('');
    const [documento_electronico, handleDocumentoElectronico] = useState({});
    const [buttonState, handlebuttonState] = useState(false);
    const [detalles, handleDetalles] = useState([]);
    const [pdfUrl, setPdfUrl] = useState('');
    const [openPdf, setOpenPdf] = useState(false);

    let formatter = new Intl.NumberFormat('es-PY', {
        style: 'currency',
        currency: 'PYG',
        minimumFractionDigits: 0
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

    async function handleBuscar(event) {
        event.preventDefault();
        handlebuttonState(true);

        const data = { cdc };

        await DocumentosElectronicosService.consulta(data)
            .then(response => {
                handlebuttonState(false);
                if (response.data.status === "success") {
                    handleDocumentoElectronico(response.data.data.documento_electronico);
                    handleDetalles(response.data.data.detalle);
                } else {
                    message("error", response.data.message);
                }
            }).catch(error => {
                console.log(error);
                message("error", error.message);
                handlebuttonState(false);
            });
    }

    const handleDownloadPdf = async () => {
        const data = { cdc };

        await DocumentosElectronicosService.kude(data)
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `kude_${cdc}.pdf`);
                document.body.appendChild(link);
                link.click();
            }).catch(error => {
                console.log(error);
                message("error", error.message);
            });
    }

    const handleDownloadXml = async () => {
        const data = { cdc };

        await DocumentosElectronicosService.xml(data)
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `xml_${cdc}.xml`);
                document.body.appendChild(link);
                link.click();
            }).catch(error => {
                console.log(error);
                message("error", error.message);
            });
    }

    const handleClose = () => {
        setOpenPdf(false);
        setPdfUrl('');
    };

    async function visualizar_pdf() {

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

    const form = (
        <Paper className={classes.formContainer}>
            {documento_electronico && Object.keys(documento_electronico).length > 0 && (
                <div className={classes.downloadButtons}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleDownloadPdf}
                        style={{ marginRight: '8px', backgroundColor: '#d32f2f', color: '#fff' }} // Rojo para PDF
                        startIcon={<PictureAsPdfIcon />}
                    >
                        Descargar PDF
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleDownloadXml}
                        style={{ backgroundColor: '#1976d2', color: '#fff' }} // Azul para XML
                        startIcon={<DescriptionIcon />}
                    >
                        Descargar XML
                    </Button>
                </div>
            )}
            <form onSubmit={handleBuscar} className={classes.form}>
                <TextField
                    label="CDC"
                    variant="outlined"
                    fullWidth
                    className={classes.textField}
                    value={cdc}
                    onChange={event => handleCdc(event.target.value)}
                />
                <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={buttonState}
                >
                    Buscar
                </Button>
            </form>
        </Paper>
    );

    const IframePDF = (
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
    )

    const formulario = (
        <Paper className={classes.detailSection}>
            {documento_electronico && Object.keys(documento_electronico).length > 0 && (
                <div className={classes.buttonContainer}>
                    <Button
                        onClick={visualizar_pdf}
                        variant="contained"
                        color="secondary"
                    >
                       <Icon>picture_as_pdf</Icon>
                       <Typography>Vista Previa</Typography>
                    </Button>
                </div>
            )}
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Typography variant="h6">Nro Documento</Typography>
                    <TextField
                        value={documento_electronico.nro_documento || ''}
                        InputProps={{ readOnly: true }}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h6">Razón Social</Typography>
                    <TextField
                        value={documento_electronico.razon_social || ''}
                        InputProps={{ readOnly: true }}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h6">RUC</Typography>
                    <TextField
                        value={documento_electronico.ruc || ''}
                        InputProps={{ readOnly: true }}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h6">Fecha Emision</Typography>
                    <TextField
                        value={documento_electronico.fecha_emision ? moment(documento_electronico.fecha_emision).format('DD/MM/YYYY HH:mm:ss') : ''}
                        InputProps={{ readOnly: true }}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h6">Fecha Firma</Typography>
                    <TextField
                        value={documento_electronico.fecha_firma ? moment(documento_electronico.fecha_firma).format('DD/MM/YYYY HH:mm:ss') : ''}
                        InputProps={{ readOnly: true }}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h6">Monto Total</Typography>
                    <TextField
                        value={documento_electronico.monto_total ? formatter.format(documento_electronico.monto_total).replace('Gs.', '') : ''}
                        InputProps={{ readOnly: true }}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h6">Fecha Envío Sifen</Typography>
                    <TextField
                        value={documento_electronico.fecha_envio_sifen ? moment(documento_electronico.fecha_envio_sifen).format('DD/MM/YYYY HH:mm:ss') : ''}
                        InputProps={{ readOnly: true }}
                        fullWidth
                    />
                </Grid>
            </Grid>
        </Paper>
    );

    const detalle = (
        <Paper className={classes.detailSection}>
            <Typography variant="h6">Detalle</Typography>
            <TableContainer className={classes.tableContainer}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Codigo</TableCell>
                            <TableCell>Descripción</TableCell>
                            <TableCell>Cantidad</TableCell>
                            <TableCell>Precio</TableCell>
                            <TableCell>Descuento</TableCell>
                            <TableCell>Exenta</TableCell>
                            <TableCell>IVA 5%</TableCell>
                            <TableCell>IVA 10%</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {detalles.map((detalle, index) => (
                            <TableRow key={index}>
                                <TableCell>{detalle.codigo}</TableCell>
                                <TableCell>{detalle.descripcion}</TableCell>
                                <TableCell>{detalle.cantidad}</TableCell>
                                <TableCell>{detalle.precio}</TableCell>
                                <TableCell>{detalle.descuento}</TableCell>
                                <TableCell>{detalle.exenta}</TableCell>
                                <TableCell>{detalle.iva5}</TableCell>
                                <TableCell>{detalle.iva10}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );

    return (
        <div className={`p-24 flex flex-1 justify-center ${classes.root}`}>
            {IframePDF}
            {form}
            {formulario}
            {detalle}
        </div>
    );
}

export default Empresas;
