import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";


export default [
    route('sign-in', 'routes/root/sign-in.tsx'),
    route('api/create-trip', 'routes/api/create-trip.ts'),
    layout('routes/admin/admin-layout.tsx', [
        route('all-users', 'routes/admin/all-users.tsx'),
        route('trips/:id', 'routes/admin/trips-detail.tsx'),
        route('dashboard', 'routes/admin/dashboard.tsx'),
        route('trips', 'routes/admin/trips.tsx'),
        route('trips/create', 'routes/admin/create-trips.tsx'),
    ])
] satisfies RouteConfig;