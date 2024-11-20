import { useSelector } from 'react-redux';
import FuseUtils from '@fuse/utils';
import appsConfigs from 'app/main/apps/appsConfigs';
import DashboardConfig from 'app/main/dashboard/DashboardConfig';
import LoginConfig from 'app/main/login/LoginConfig';
import LogoutConfig from 'app/main/logout/LogoutConfig';
import { Redirect } from 'react-router-dom';
import FuseLoading from '@fuse/core/FuseLoading';
import DocumentosElectronicosConfig from 'app/main/documentos_electronicos/DocumentosElectronicosConfig';
import EmpresasConfig from 'app/main/empresas/EmpresasConfig';
import CertificadosConfig from 'app/main/certificados/CertificadosConfig';
import UsuariosConfig from 'app/main/usuarios/UsuariosConfig';
import EventosConfig from 'app/main/eventos/EventosConfig';
import UsuariosFuncionalesConfig from 'app/main/usuarios_funcionales/UsuariosFuncionalesConfig';
import ConsultasConfig from 'app/main/consultas/ConsultasConfig';
import FacturaConfig from 'app/main/facturacion/factura/FacturaConfig';

const routeConfigs = [
    DashboardConfig,
    ...appsConfigs,
    LogoutConfig,
    LoginConfig,
    EmpresasConfig,
    DocumentosElectronicosConfig,
    ConsultasConfig,
    CertificadosConfig,
    UsuariosConfig,
    UsuariosFuncionalesConfig,
    LogoutConfig,
    EventosConfig,
    FacturaConfig
];

const routes = [
    // if you want to make whole app auth protected by default change defaultAuth for example:
    // ...FuseUtils.generateRoutesFromConfigs(routeConfigs, ['admin','staff','user']),
    // The individual route configs which has auth option won't be overridden.
    ...FuseUtils.generateRoutesFromConfigs(routeConfigs, null),
    {
        path: '/loading',
        exact: true,
        component: () => < FuseLoading />,
    },
    {
        path: '/',
        exact: true,
        component: () => {
            const user = useSelector(({ auth }) => auth.user);
            const userRole = user.role[0]
            console.log("user: ", user)

            if (userRole === 'consulta') {
                return <Redirect to="/consultas" />;
            } else {
                return <Redirect to="/documentos_electronicos" />;
            }
        }
    },
    {
        component: () => <Redirect to="/documentos_electronicos" />,
    },
];

export default routes;