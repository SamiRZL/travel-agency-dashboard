import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";


export default [
    layout('./routes/admin/admin-layout', [
        route('all-users', './routes/admin/all-users'),
        route('dashboard', './routes/admin/dashboard'),
    ])
] satisfies RouteConfig;