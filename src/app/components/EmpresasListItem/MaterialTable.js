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
            title: 'Ruc',
            field: 'ruc',
            cellStyle: {
                textAlign: "left",
                //backgroundColor: '#039be5',
                //color: '#000',
                fontSize: 15,
                width: "5%"
            },
        },
        {
            title: 'Dv',
            field: 'dv',
            cellStyle: {
                textAlign: "left",
                //backgroundColor: '#039be5',
                //color: '#000',
                fontSize: 15,
                width: "5%"
            },
        },
        {
            title: 'Razon Social',
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
            title: 'Nombre Fantasía',
            field: 'nombre_fantasia',
            cellStyle: {
                textAlign: "left",
                //backgroundColor: '#039be5',
                //color: '#000',
                fontSize: 15,
                width: "10%"
            },
        },
        {
            title: 'Tipo contribuyente',
            field: 'tipo_contribuyente',
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
        },
        {
            title: 'Ambiente',
            field: 'ambiente',
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
            title="Lista de Empresas"
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