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
import { IconButton, Icon, Avatar } from '@material-ui/core';
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

    const classes = useStyles();

    const data = props.data.map((item, index) => ({
        fecha_creacion: item.fecha_creacion,
        cdc: <>
            <IconButton
                size="small"
                title={item.tipo_documento}
            >
                {item.tipo_documento == 'FE' ? <Avatar className="md:mx-4" title='Factura Electrónica' style={{ size: '5px' }}>FE</Avatar>
                    : item.tipo_documento == 'AFC' ? <Avatar className="md:mx-4" title='Autofactura Electrónica'>AFE</Avatar>
                        : item.tipo_documento == 'NCR' ? <Avatar className="md:mx-4" title='Nota de Crédito Electrónica'>NCE</Avatar>
                            : item.tipo_documento == 'NDE' ? <Avatar className="md:mx-4" title='Nota de Débito Electrónica'>NDE</Avatar>
                                : <Avatar className="md:mx-4" title='Nota de Remisión Electrónica'>NRE</Avatar>}
            </IconButton>
            {item.cdc}
        </>,
        motivo: item.motivo,
        fecha_firma: item.fecha_firma,
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

                {item.enviado_sifen ?
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

            </>
    }));

    return (
        <MaterialTable data={data}></MaterialTable>
    );
}