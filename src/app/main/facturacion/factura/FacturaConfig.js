import { lazy } from 'react';

const FacturaConfig = {
    settings: {
        layout: {
            config: {},
        },
    },
    auth: ['admin', 'contabilidad'],
    routes: [{
        path: '/facturacion/factura',
        component: lazy(() =>
            import ('./Factura')),
    }, ],
};

export default FacturaConfig;