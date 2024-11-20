import { lazy } from 'react';

const DashboardConfig = {
    settings: {
        layout: {
            config: {},
        },
    },
    auth: ['admin', 'cliente'],
    routes: [{
        path: '/dashboard',
        component: lazy(() =>
            import ('./Dashboard')),
    }, ],
};

export default DashboardConfig;