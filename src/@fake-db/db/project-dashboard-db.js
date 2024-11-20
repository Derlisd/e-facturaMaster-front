import mock from '../mock';

const projectDashboardAppDB = {
    widgets: [{
            id: 'widget1',
            ranges: {
                DY: 'Yesterday',
                DT: 'Today',
                DTM: 'Tomorrow'
            },
            currentRange: 'DT',
            data: {
                name: 'Due Tasks',
                count: {
                    DY: 21,
                    DT: 25,
                    DTM: 19
                },
                extra: {
                    name: 'Completed',
                    count: {
                        DY: 6,
                        DT: 7,
                        DTM: '-'
                    }
                }
            },
            detail: 'You can show some detailed information about this widget in here.'
        },
        {
            id: 'widget2',
            title: 'Overdue',
            data: {
                name: 'Tasks',
                count: 4,
                extra: {
                    name: "Yesterday's overdue",
                    count: 2
                }
            },
            detail: 'You can show some detailed information about this widget in here.'
        },
        {
            id: 'widget3',
            title: 'Issues',
            data: {
                name: 'Open',
                count: 32,
                extra: {
                    name: 'Closed today',
                    count: 0
                }
            },
            detail: 'You can show some detailed information about this widget in here.'
        },
        {
            id: 'widget4',
            title: 'Features',
            data: {
                name: 'Proposals',
                count: 42,
                extra: {
                    name: 'Implemented',
                    count: 8
                }
            },
            detail: 'You can show some detailed information about this widget in here.'
        }
    ],
};

mock.onGet('/api/project-dashboard-app/widgets').reply(config => {
    return [200, projectDashboardAppDB.widgets];
});