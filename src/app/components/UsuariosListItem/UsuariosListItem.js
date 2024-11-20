import React from 'react';
import MaterialTable from './MaterialTable';
import { IconButton, Icon } from '@material-ui/core';

function UsuariosListItem(props) {

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
        empresas: item.empresas
            ? item.empresas.map((element) =>
                <p style={{ fontSize: '13px' }}><li>{element.razon_social}</li></p>
            ) : '',
        nombres: item.nombres,
        apellidos: item.apellidos,
        username: item.username,
        email: item.email,
        perfiles: item.perfiles.map((element) =>
            <p style={{ fontSize: '13px' }}><li>{element.perfil}</li></p>
        ),
        estado: item.active ? 'Activo' : 'Inactivo'
    }));

    return (
        <div>
            <MaterialTable data={data}></MaterialTable>
        </div>
    )

}

export default UsuariosListItem;
