import { lazy } from 'react';

const EmpresasConfig = {
    settings: {
        layout: {
            config: {},
        },
    },
    auth: ['admin', 'soporte', 'contabilidad'],
    routes: [{
        path: '/empresas',
        component: lazy(() =>
            import ('./Empresas.js')),
    }, ],
};

export default EmpresasConfig;