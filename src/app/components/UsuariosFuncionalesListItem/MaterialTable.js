import React, { useState } from "react";
import MaterialTable from 'material-table';

export default function DataTable(props) {

    const [data, setData] = useState(props.data);

    const columns = [
        {
            title: 'Acciones',
            field: 'acciones',
            cellStyle: {
                textAlign: "left",
                //backgroundColor: '#039be5',
                //color: '#000',
                fontSize: 15,
                width: "5%"
            },
        },
        {
            title: 'Empresa',
            field: 'empresa',
            cellStyle: {
                textAlign: "left",
                //backgroundColor: '#039be5',
                //color: '#000',
                fontSize: 15,
                width: "10%"
            },
        },
        {
            title: 'Username',
            field: 'username',
            cellStyle: {
                textAlign: "left",
                //backgroundColor: '#039be5',
                //color: '#000',
                fontSize: 15,
                width: "5%"
            },
        },
        {
            title: 'Email',
            field: 'email',
            cellStyle: {
                textAlign: "left",
                //backgroundColor: '#039be5',
                //color: '#000',
                fontSize: 15,
                width: "10%"
            },
        },
        {
            title: 'Estado',
            field: 'estado',
            cellStyle: {
                textAlign: "left",
                //backgroundColor: '#039be5',
                //color: '#000',
                fontSize: 15,
                width: "10%"
            },
        }
    ]

    return (
        <MaterialTable
            columns={columns}
            data={data}
            title="Lista de Usuarios"
            options={{
                padding: 'dense',
                //filtering: true,
                grouping: true,
                paging: true,
                pageSizeOptions: [10, 20, 30, 50, 100],
                pageSize: 10
            }}
            localization={{
                pagination: {
                    labelDisplayedRows: '{from}-{to} de {count} registros',
                    labelRowsSelect: 'filas',
                    firstTooltip: 'Primera página',
                    previousTooltip: 'Página anterior',
                    nextTooltip: 'Próxima página',
                    lastTooltip: 'Última página'
                },
                header: {
                    actions: 'Acciones'
                },
                body: {
                    emptyDataSourceMessage: 'No se encontraron resultados',
                    filterRow: {
                        filterTooltip: 'Buscar'
                    }
                },
                grouping: {
                    placeholder: 'Arrastra los encabezados aquí para agruparlos por',
                    groupedBy: 'Agrupado por:'
                },
                toolbar: {
                    searchTooltip: 'Buscar',
                    searchPlaceholder: 'Buscar'
                }
            }}
        />
    );
}