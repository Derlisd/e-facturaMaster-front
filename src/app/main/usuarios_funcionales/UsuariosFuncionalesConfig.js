import { lazy } from 'react';

const UsuariosFuncionalesConfig = {
    settings: {
        layout: {
            config: {},
        },
    },
    auth: ['admin', 'soporte', 'cliente'],
    routes: [{
        path: '/usuario_funcional',
        component: lazy(() =>
            import('./UsuariosFuncionales')),
    },],
};

export default UsuariosFuncionalesConfig;