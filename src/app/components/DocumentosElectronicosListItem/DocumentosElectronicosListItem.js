import React, { useState } from "react";
import {
    CheckCircleOutline as ApprovedIcon,
    HighlightOff as RejectedIcon,
    HourglassEmpty as InProcessIcon,
    History as SendPending,
    CloudUpload as SentIcon,
    Edit as SignedXmlIcon,
    CloudDownloadOutlined as DownloadDocument,
} from '@material-ui/icons';
import { IconButton, Icon, Avatar, Select, MenuItem } from '@material-ui/core';
import MaterialTable from './MaterialTable';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
    statusIcon: {
        marginLeft: theme.spacing(1),
        verticalAlign: 'middle',
    },
    xmlIcon: {
        color: '#FFD700', // Amarillo
        verticalAlign: 'middle',
    },
    sentIcon: {
        color: '#0000FF', // Azul
        verticalAlign: 'middle',
    },
    inProcessIcon: {
        color: '#FFD700', // Amarillo
        verticalAlign: 'middle',
    },
    sendMailIcon: {
        color: '#0000FF', // Amarillo
        verticalAlign: 'middle',
    },
    SendPendingIcon: {
        color: '#4dff00', // VerdeLimon
        verticalAlign: 'middle',
    },
    approvedIcon: {
        color: '#008000', // Verde
        verticalAlign: 'middle',
    },
    rejectedIcon: {
        color: '#FF0000', // Rojo
        verticalAlign: 'middle',
    },
    downloadDocumentIcon: {
        color: '#008000', // Rojo
    },
    iconButton: {
        verticalAlign: 'middle',
    }
}));

export default function DataTable(props) {

    console.log("props: ", props)

    const classes = useStyles();

    let formatter = new Intl.NumberFormat('es-PY', {
        style: 'currency',
        currency: 'PYG',
        minimumFractionDigits: 0
    }
    );

    const data = props.data.map((item, index) => ({
        acciones:
            <>
                <IconButton
                    size="small"
                    title='Generar PDF'
                    onClick={() => { props.generar_pdf(item.cdc) }}
                >
                    <Icon style={{ color: 'red' }}>picture_as_pdf</Icon>
                </IconButton>
                <IconButton
                    size="small"
                    title='Generar XML'
                    onClick={() => { props.generar_xml(item.cdc) }}
                >
                    <Icon style={{ color: 'green' }}>integration_instructions</Icon>
                </IconButton>
            </>,
        nro_lote: item.nro_lote,
        nro_documento_search: item.nro_documento,
        nro_documento:
            <>
                <IconButton
                    size="small"
                    title={item.abrev_tipo_documento}
                >
                    {item.abrev_tipo_documento == 'FE' ? <Avatar className="md:mx-4" title='Factura Electrónica' style={{ size: '5px' }}>FE</Avatar>
                        : item.abrev_tipo_documento == 'AFC' ? <Avatar className="md:mx-4" title='Autofactura Electrónica'>AFE</Avatar>
                            : item.abrev_tipo_documento == 'NCR' ? <Avatar className="md:mx-4" title='Nota de Crédito Electrónica'>NCE</Avatar>
                                : item.abrev_tipo_documento == 'NDE' ? <Avatar className="md:mx-4" title='Nota de Débito Electrónica'>NDE</Avatar>
                                    : <Avatar className="md:mx-4" title='Nota de Remisión Electrónica'>NRE</Avatar>}
                </IconButton>
                {item.nro_documento}
            </>,
        fecha_emision: item.fecha_emision,
        ruc: item.ruc,
        cdc: item.cdc,
        razon_social: item.razon_social,
        fecha_firma: item.fecha_firma,
        monto_total: formatter.format(item.monto_total).replace('Gs.', ''),
        estado_documento:
            <>
                {/*  <SignedXmlIcon className={`${classes.statusIcon} ${classes.xmlIcon}`} titleAccess={item.estado_firma_documento} /> */}
                <Icon className={`${classes.statusIcon} ${classes.marginIcon} ${classes.xmlIcon}`} title={item.estado_firma_documento}>done_all</Icon>
                {item.enviado_sifen ?
                    <SentIcon className={`${classes.statusIcon} ${classes.sentIcon}`} titleAccess="Enviado" />
                    :
                    <SendPending className={`${classes.statusIcon} ${classes.SendPendingIcon}`} titleAccess="Pendiente de Envio" />
                }

                {item.estado_envio_sifen == 'Pendiente' ?
                    <Icon className={`${classes.statusIcon} ${classes.inProcessIcon}`} title="Pendiente de Respuesta">pending_actions</Icon>
                    :
                    ''
                }

                {item.enviado_sifen && item.estado_envio_sifen != 'Pendiente' ?
                    item.estado_envio_sifen == 'Aprobado' ?
                        < ApprovedIcon className={`${classes.statusIcon} ${classes.approvedIcon}`} titleAccess={item.estado_envio_sifen} />
                        :
                        <>
                            <RejectedIcon className={`${classes.statusIcon} ${classes.rejectedIcon}`} titleAccess={item.estado_envio_sifen} />

                            <IconButton
                                size="small"
                                title='Ver detalle'
                                onClick={() => { props.ver_detalle(item.mensaje) }}
                            >
                                <Icon style={{ color: 'red' }}>remove_red_eye
                                </Icon>
                            </IconButton>
                        </>
                    : ''
                }

                {item.estado_envio_email == 'Enviado' ?
                    <Icon className={`${classes.statusIcon} ${classes.sendMailIcon}`} title="Correo enviado">forward_to_inbox</Icon>
                    : ''
                }

                {item.download_cliente ?
                    <DownloadDocument className={`${classes.statusIcon} ${classes.downloadDocumentIcon}`} titleAccess={`Descargado por el cliente: ${item.download_date}`} />
                    : ''
                }

            </>,
        eventos: item.enviado_sifen ?
            item.estado_envio_sifen == 'Aprobado' ?
                <>
                    <IconButton
                        size="small"
                        title='Cancelación'
                        onClick={() => { props.handleEventChange('Cancelación', item) }}
                    >
                        <Icon style={{ color: 'red' }}>block
                        </Icon>
                    </IconButton>
                    <IconButton
                        size="small"
                        title='Nominación'
                        onClick={() => { props.handleEventChange('Nominación', item) }}
                    >
                        <Icon style={{ color: 'green' }}>account_box
                        </Icon>
                    </IconButton>
                </>
                : item.estado_envio_sifen == 'Rechazado' ?
                    <IconButton
                        size="small"
                        title='Inutilización'
                        onClick={() => { props.handleEventChange('Inutilización', item) }}
                    >
                        <Icon style={{ color: 'red' }}>remove_circle_outline
                        </Icon>
                    </IconButton>
                    : ''
            : ''
        /* eventos: item.enviado_sifen ? <Select
            value={props.selectedEvent}
            onChange={(event) => props.handleEventChange(event.target.value, item)}
            displayEmpty
        >
            <MenuItem value="" disabled>
                Seleccionar evento
            </MenuItem>
            <MenuItem value="Cancelación">Cancelación</MenuItem>
            <MenuItem value="Nominación">Nominación</MenuItem>
            <MenuItem value="Inutilización">Inutilización</MenuItem>
        </Select> : '' */

    }));

    return (
        <MaterialTable data={data}></MaterialTable>
    );
}