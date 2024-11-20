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
            title: 'Nro. Lote',
            field: 'nro_lote',
            cellStyle: {
                textAlign: "left",
                //backgroundColor: '#039be5',
                //color: '#000',
                fontSize: 15,
                width: "10%"
            },
        },
        {
            title: '',
            field: 'nro_documento_search',
            hidden: true,
            searchable: true,
            cellStyle: {
                textAlign: "left",
                //backgroundColor: '#039be5',
                //color: '#000',
                fontSize: 15,
                width: "20%"
            },
        },
        {
            title: 'Nro. Factura',
            field: 'nro_documento',
            cellStyle: {
                textAlign: "left",
                //backgroundColor: '#039be5',
                //color: '#000',
                fontSize: 15,
                width: "20%"
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
                width: "15%"
            },
        },
       /*  {
            title: 'CDC',
            field: 'cdc',
            cellStyle: {
                textAlign: "left",
                //backgroundColor: '#039be5',
                //color: '#000',
                fontSize: 15,
                width: "5%"
            },
        }, */
        /* {
            title: 'Fecha Firma',
            field: 'fecha_firma',
            cellStyle: {
                textAlign: "left",
                //backgroundColor: '#039be5',
                //color: '#000',
                fontSize: 15,
                width: "15%"
            },
        }, */
        {
            title: 'RUC/CI',
            field: 'ruc',
            cellStyle: {
                textAlign: "left",
                //backgroundColor: '#039be5',
                //color: '#000',
                fontSize: 15,
                width: "10%"
            },
        },
        {
            title: 'Razon Social',
            field: 'razon_social',
            cellStyle: {
                textAlign: "left",
                //backgroundColor: '#039be5',
                color: '#000',
                fontSize: 15,
                width: "20%"
            },
        },

        {
            title: 'Monto',
            field: 'monto_total',
            cellStyle: {
                textAlign: "left",
                //backgroundColor: '#039be5',
                //color: '#000',
                fontSize: 15,
                width: "5%"
            },
        },
        {
            title: 'Estado',
            field: 'estado_documento',
            cellStyle: {
                textAlign: "left",
                //backgroundColor: '#039be5',
                //color: '#000',
                fontSize: 15,
                width: "25%"
            },
        },
       /*  {
            title: 'Eventos',
            field: 'eventos',
            cellStyle: {
                textAlign: "left",
                //backgroundColor: '#039be5',
                //color: '#000',
                fontSize: 15,
                width: "25%"
            },
        } */
    ]

    return (
        <MaterialTable
            columns={columns}
            data={data}
            title=""
            options={{
                padding: 'dense',
                //filtering: true,
                paging: true,
                grouping: true,
                pageSizeOptions: [10, 20, 30, 50, 100],
                pageSize: 10,
                //exportButton: true
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
                    searchTooltip: 'Buscar por todos los campos',
                    searchPlaceholder: 'Buscar por todos los campos'
                }
            }}
            detailPanel={rowData => {
                return (
                    <div style={{ padding: 16, backgroundColor: '#f4f4f4' }}>
                        <p><strong>CDC:</strong> {rowData.cdc}</p>
                        <p><strong>Fecha Firma:</strong> {rowData.fecha_firma}</p>
                    </div>
                );
            }}
            onRowClick={(event, rowData, togglePanel) => togglePanel()}
        />
    );
}