import React, { useState } from "react";
import MaterialTable from 'material-table';

export default function DataTable(props) {

    const [data, setData] = useState(props.data);

    const columns = [
    /*     {
            title: 'Acciones',
            field: 'acciones',
            cellStyle: {
                textAlign: "left",
                //backgroundColor: '#039be5',
                //color: '#000',
                fontSize: 15,
                width: "5%"
            },
        }, */
        {
            title: 'Empresa',
            field: 'razon_social',
            cellStyle: {
                textAlign: "left",
                //backgroundColor: '#039be5',
                //color: '#000',
                fontSize: 15,
                width: "10%"
            },
        },
        {
            title: 'Emisor',
            field: 'emisor',
            cellStyle: {
                textAlign: "left",
                //backgroundColor: '#039be5',
                //color: '#000',
                fontSize: 15,
                width: "5%"
            },
        },
        {
            title: 'Titular',
            field: 'titular',
            cellStyle: {
                textAlign: "left",
                //backgroundColor: '#039be5',
                //color: '#000',
                fontSize: 15,
                width: "10%"
            },
        },
        {
            title: 'Fecha Emisión',
            field: 'fecha_emision',
            cellStyle: {
                textAlign: "left",
                //backgroundColor: '#039be5',
                //color: '#000',
                fontSize: 15,
                width: "10%"
            },
        },
        {
            title: 'Fecha Vencimiento',
            field: 'fecha_vencimiento',
            cellStyle: {
                textAlign: "left",
                //backgroundColor: '#039be5',
                //color: '#000',
                fontSize: 15,
                width: "10%"
            },
        },
    ]

    return (
        <MaterialTable
            columns={columns}
            data={data}
            title="Lista de Certificados"
            options={{
                padding: 'dense',
                //filtering: true,
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
                toolbar: {
                    searchTooltip: 'Buscar',
                    searchPlaceholder: 'Buscar'
                }
            }}
        />
    );
}