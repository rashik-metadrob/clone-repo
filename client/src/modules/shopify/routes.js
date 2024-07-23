import { lazy } from 'react';
import routesConstant from '../../routes/routesConstant';

const ExitIframe = lazy(() => import('./pages/ExitIframe'));
const TestPage = lazy(() => import('./pages/Test'));
const Product = lazy(() => import('./pages/Product'));
const SessionPage = lazy(() => import('./pages/SessionPage'));

export default [
    {
        path: "/exitiframe",
        name: "ExitIframe",
        component: <ExitIframe/>
    },
    {
        path: "/test-page",
        name: "TestPage",
        component: <TestPage/>
    },
    {
        path: routesConstant.shopify.path,
        name: "Session",
        component: <SessionPage/>
    },
]