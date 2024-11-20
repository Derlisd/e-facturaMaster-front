import React from 'react';
import MaterialTable from './MaterialTable';
import { IconButton, Icon } from '@material-ui/core';

function UsuariosFuncionalesListItem(props) {

    const data = props.registro.map((item, index) => ({
        acciones:
            <>
                {props.hasEditar && (<IconButton
                    size="small"
                    title='Editar'
                    onClick={() => { props.editar(item) }}
                >
                    <Icon style={{ color: 'blue' }}>edit</Icon>
                </IconButton>)}

                {props.hasEliminar && (<IconButton
                    size="small"
                    title='Eliminar'
                    onClick={() => { props.eliminar(item.id) }}
                >
                    <Icon style={{ color: 'red' }}>delete</Icon>
                </IconButton>)}

                <IconButton
                    size="small"
                    title={item.active ? 'Activo' : 'Inactivo'}
                    onClick={() => { props.estado(item.id, item.active ? false : true) }}
                >
                    {item.active ?
                        <Icon style={{ color: 'green' }}>toggle_on</Icon>
                        :
                        <Icon style={{ color: 'red' }}>toggle_off</Icon>
                    }

                </IconButton>
            </>
        ,
        empresa: item.razon_social,
        username: item.username,
        email: item.email,
        estado: item.active ? 'Activo' : 'Inactivo'
    }));

    return (
        <div>
            <MaterialTable data={data}></MaterialTable>
        </div>
    )

}

export default UsuariosFuncionalesListItem;
