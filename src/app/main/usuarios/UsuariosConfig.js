import { lazy } from 'react';

const UsuariosConfig = {
    settings: {
        layout: {
            config: {},
        },
    },
    auth: ['admin', 'soporte', 'cliente'],
    routes: [{
        path: '/usuario',
        component: lazy(() =>
            import('./Usuarios')),
    },],
};

export default UsuariosConfig;