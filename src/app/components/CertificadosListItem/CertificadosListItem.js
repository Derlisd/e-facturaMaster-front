import React from 'react';
import MaterialTable from './MaterialTable';
import { IconButton, Icon } from '@material-ui/core';
import { withRouter } from 'react-router-dom';

function EmpresasListItem(props) {

    let data = [];

    for (var i = 0; i < props.registro.length; i++) {
        let id = props.registro[i].id
        let razon_social = props.registro[i].razon_social
        let emisor = props.registro[i].emisor
        let titular = props.registro[i].titular
        let fecha_emision = props.registro[i].fecha_emision
        let fecha_vencimiento = props.registro[i].fecha_vencimiento

        let rows = {
            acciones: '',
            razon_social,
            emisor,
            titular,
            fecha_emision,
            fecha_vencimiento
        }

        data.push(rows)
    }

    return (
        <div>
            <MaterialTable data={data}></MaterialTable>
        </div>
    )

}

export default EmpresasListItem;
