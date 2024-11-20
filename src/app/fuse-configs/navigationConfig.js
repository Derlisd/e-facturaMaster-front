
const navigationConfig = [{
    id: 'applications',
    title: 'Menu Principal',
    translate: 'MENU PRINCIPAL',
    type: 'group',
    icon: 'apps',
    children: [
        {
            id: 'documentos_electronicos',
            title: 'Documentos Electrónicos',
            type: 'item',
            icon: 'description',
            url: '/documentos_electronicos',
            auth: ['admin', 'cliente', 'contabilidad']
        },
        {
            id: 'facturacion',
            title: 'Facturación',
            type: 'collapse',
            icon: 'request_quote',
            auth: ['admin', 'contabilidad'],
            children: [
                {
                    id: 'factura',
                    title: 'Factura',
                    type: 'item',
                    icon: 'text_snippet',
                    auth: ['admin', 'contabilidad'],
                    url: '/facturacion/factura',
                }
            ]
        },
        {
            id: 'consultas',
            title: 'Consultas',
            type: 'item',
            icon: 'description',
            url: '/consultas',
            auth: ['admin', 'consulta']
        },
        {
            id: 'empresas',
            title: 'Empresas',
            type: 'item',
            icon: 'business',
            url: '/empresas',
            auth: ['admin', 'soporte', 'contabilidad']
        },
        {
            id: 'usuarios',
            title: 'Usuarios',
            type: 'item',
            icon: 'group',
            url: '/usuario',
            auth: ['admin', 'soporte']
        },
        {
            id: 'usuarios_funcionales',
            title: 'Usuarios Funcionales',
            type: 'item',
            icon: 'group',
            url: '/usuario_funcional',
            auth: ['admin', 'soporte']
        },
        {
            id: 'certificado',
            title: 'Certificado',
            type: 'item',
            icon: 'card_membership',
            url: '/certificados',
            auth: ['admin', 'cliente', 'soporte']
        },
        /* {
            id: 'eventos',
            title: 'Eventos',
            type: 'item',
            icon: 'dynamic_feed',
            url: '/eventos',
            auth: ['admin', 'cliente', 'contabilidad']
        }, 
        {
            id: 'monitoreo',
            title: 'Monitoreo',
            type: 'item',
            icon: 'find_in_page',
            url: '/monitoreo',
            auth: ['admin']
        },
        {
            id: 'logs',
            title: 'Logs',
            type: 'item',
            icon: 'find_in_page',
            url: '/logs',
            auth: ['admin']
        }*/
    ],
}];

export default navigationConfig;