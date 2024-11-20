import { lazy } from 'react';

const ConsultasConfig = {
    settings: {
        layout: {
            config: {},
        },
    },
    auth: ['admin', 'consulta'],
    routes: [{
        path: '/consultas',
        component: lazy(() =>
            import('./Consultas')),
    },],
};

export default ConsultasConfig;