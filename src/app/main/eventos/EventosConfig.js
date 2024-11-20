import { lazy } from 'react';

const EventosConfig = {
    settings: {
        layout: {
            config: {},
        },
    },
    auth: ['admin', 'cliente', 'soporte', 'contabilidad'],
    routes: [{
        path: '/eventos',
        component: lazy(() =>
            import ('./Eventos')),
    }, ],
};

export default EventosConfig;