import { lazy } from 'react';

const CertificadosConfig = {
    settings: {
        layout: {
            config: {},
        },
    },
    auth: ['admin', 'soporte', 'cliente'],
    routes: [{
        path: '/certificados',
        component: lazy(() =>
            import ('./Certificados')),
    }, ],
};

export default CertificadosConfig;