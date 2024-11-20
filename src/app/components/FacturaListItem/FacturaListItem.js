import React from 'react';
import MaterialTable from 'material-table';

function FacturaListItem(props) {

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
            title: 'Fecha Emision',
            field: 'fecha_emision',
            cellStyle: {
                textAlign: "left",
                //backgroundColor: '#039be5',
                //color: '#000',
                fontSize: 15,
                width: "15%"
            },
        },

        {
            title: 'Nro. Factura',
            field: 'nro_factura',
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
                //color: '#000',
                fontSize: 15,
                width: "15%"
            },
        },
        {
            title: 'Nro. Documento',
            field: 'nro_documento',
            cellStyle: {
                textAlign: "left",
                //backgroundColor: '#039be5',
                //color: '#000',
                fontSize: 15,
                width: "15%"
            },
        },
        {
            title: 'Moneda',
            field: 'moneda',
            cellStyle: {
                textAlign: "left",
                //backgroundColor: '#039be5',
                //color: '#000',
                fontSize: 15,
                width: "5%"
            },
        },
        {
            title: 'Condicion',
            field: 'condicion_operacion',
            cellStyle: {
                textAlign: "left",
                //backgroundColor: '#039be5',
                //color: '#000',
                fontSize: 15,
                width: "5%"
            },
        },
        {
            title: 'Total',
            field: 'total',
            cellStyle: {
                textAlign: "left",
                //backgroundColor: '#039be5',
                //color: '#000',
                fontSize: 15,
                width: "10%"
            },
        },
        {
            title: 'Fecha Creacion',
            field: 'fecha_creacion',
            cellStyle: {
                textAlign: "left",
                //backgroundColor: '#039be5',
                //color: '#000',
                fontSize: 15,
                width: "15%"
            },
        },
    ]

    return (
        <MaterialTable
            columns={columns}
            data={props.data}
            title="Lista de Facturas"
            onSelectionChange={props.onSelectionChange}
            options={{
                headerStyle: {
                    color: "#000",
                    textAlign: "left",
                    whiteSpace: "nowrap",
                    backgroundColor: '#f6f7f9',
                    fontSize: 20
                },
                showSelectAllCheckbox: true,
                showTextRowsSelected: true,
                selection: true,
                padding: 'dense',
                //filtering: true,
                //grouping: true,
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
                    searchPlaceholder: 'Buscar',
                    nRowsSelected: '{0} item(s) seleccionado(s)'
                }
            }}
        />
    );

}

export default FacturaListItem;
