import { lazy } from 'react';
import { authRoles } from 'app/auth';

const DocumentosElectronicosConfig = {
    settings: {
        layout: {
            config: {},
        },
    },
    auth: ['admin', 'cliente', 'contabilidad'],
    routes: [{
        path: '/documentos_electronicos',
        component: lazy(() =>
            import ('./DocumentosElectronicos')),
    }, ],
};

export default DocumentosElectronicosConfig;