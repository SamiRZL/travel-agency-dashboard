import { Header, TripCard } from "components"
import { StatsCard } from "components"
import { useLoaderData, useNavigate } from "react-router"
import { getAllUsers, getUser } from "~/appwrite/auth"
import { allTrips, dashboardStats, interests, tripXAxis, tripyAxis, userXAxis, useryAxis } from "~/constants"
import type { Route } from "./+types/dashboard"
import { getTripsByTravelStyle, getUserGrowthPerDay, getUsersAndTripsStats } from "~/appwrite/dashboard"
import { getAllTrips } from "~/appwrite/trips"
import { parseTripData } from "~/lib/utils"
import { Category, ChartComponent, ColumnSeries, DataLabel, Inject, SeriesCollectionDirective, SeriesDirective, SplineAreaSeries, Tooltip } from "@syncfusion/ej2-react-charts"
import { GridComponent, ColumnsDirective, ColumnDirective } from "@syncfusion/ej2-react-grids"


export const clientLoader = async () => {
    const [user, usersAndTripsStats, trips, userGrowth, tripsByTravelStyle, allUsers] = await Promise.all([
        getUser(),
        getUsersAndTripsStats(),
        getAllTrips(4, 0),
        getUserGrowthPerDay(),
        getTripsByTravelStyle(),
        getAllUsers(4, 0)
    ])

    const allTrips = trips?.rows.map(({ $id, tripDetail, imageUrls, }) => (
        {
            id: $id,
            ...parseTripData(tripDetail),
            imageUrls: imageUrls ?? []
        }
    ))

    const mappedUsers: UsersItineraryCount[] = allUsers.rows.map((user) => ({
        imageUrl: user.imageUrl,
        name: user.name,
        count: user.itineraryCount ?? Math.floor(Math.random() * 10)
    }))
    return {
        user,
        usersAndTripsStats,
        allTrips, userGrowth, tripsByTravelStyle, allUsers: mappedUsers

    }
}
const Dashboard = ({ loaderData }: Route.ComponentProps) => {
    const { user, usersAndTripsStats, allTrips, userGrowth, allUsers, tripsByTravelStyle } = loaderData;
    console.log("user info", user)
    console.log("trips by travel style", tripsByTravelStyle)

    const trips = allTrips.map((trip) => ({
        imageUrl: trip.imageUrls[0],
        name: trip.name,
        interests: trip.interests
    }))

    const usersAndTrips = [
        {
            title: 'Latest User Signups',
            dataSource: allUsers,
            field: 'count',
            headerText: 'Trips Created'
        },
        {
            title: 'Trips Based On Interests',
            dataSource: trips,
            field: 'interests',
            headerText: 'Interests'
        }
    ]

    return (
        <main className="dashboard wrapper">
            <Header
                title={`Welcome ${user?.name || 'Guest'} 👋`}
                description={'Track activity, trends and popular destinations in real time'}
            />

            <section className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatsCard
                        headerTitle='Total Users'
                        total={usersAndTripsStats.totalUsers}
                        currentMonthCount={usersAndTripsStats.usersJoined.currentMonth}
                        lastMonthCount={usersAndTripsStats.usersJoined.lastMonth}
                    />
                    <StatsCard
                        headerTitle='Total Trips'
                        total={usersAndTripsStats.totalTrips}
                        currentMonthCount={usersAndTripsStats.tripsCreated.currentMonth}
                        lastMonthCount={usersAndTripsStats.tripsCreated.lastMonth}
                    />
                    <StatsCard
                        headerTitle='Active Users'
                        total={usersAndTripsStats.userRole.total}
                        currentMonthCount={usersAndTripsStats.userRole.currentMonth}
                        lastMonthCount={usersAndTripsStats.userRole.lastMonth}
                    />
                </div>
            </section>
            <section className="container">
                <h1 className="text-xl font-semibold text-dark-100">Created trips</h1>
                <div className="trip-grid">
                    {allTrips.slice(0, 4).map((trip) => (
                        <TripCard key={trip.id} id={trip.id.toString()} name={trip.name!} imageUrl={trip.imageUrls[0]} location={trip.itinerary?.[0]?.location ?? ''} tags={[trip.interests!, trip.travelStyle!]} price={trip.estimatedPrice!} />
                    ))}
                </div>
            </section>
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <ChartComponent
                    id="chart-1"
                    primaryXAxis={userXAxis}
                    primaryYAxis={useryAxis}
                    title="User Growth"
                    tooltip={{ enable: true }}
                >
                    <Inject services={[ColumnSeries, SplineAreaSeries, Category, DataLabel, Tooltip]} />
                    <SeriesCollectionDirective>
                        <SeriesDirective
                            dataSource={userGrowth}
                            xName="day"
                            yName="count"
                            type="Column"
                            name="Column"
                            columnWidth={0.3}
                            cornerRadius={{ topLeft: 10, topRight: 10 }}
                        />
                        <SeriesDirective
                            dataSource={userGrowth}
                            xName="day"
                            yName="count"
                            type="SplineArea"
                            name="Wave"
                            fill="rgba(71,132,238,0.3)"
                            border={{ width: 2, color: '#4784EE' }}

                        />
                    </SeriesCollectionDirective>
                </ChartComponent>
                <ChartComponent
                    id="chart-2"
                    primaryXAxis={tripXAxis}
                    primaryYAxis={tripyAxis}
                    title="Trip Trends"
                    tooltip={{ enable: true }}
                >
                    <Inject services={[ColumnSeries, SplineAreaSeries, Category, DataLabel, Tooltip]} />
                    <SeriesCollectionDirective>
                        <SeriesDirective
                            dataSource={tripsByTravelStyle}
                            xName="travelStyle"
                            yName="count"
                            type="Column"
                            name="day"
                            columnWidth={0.3}
                            cornerRadius={{ topLeft: 10, topRight: 10 }}
                        />

                    </SeriesCollectionDirective>
                </ChartComponent>
            </section>
            <section className="user-trip wrapper">
                {
                    usersAndTrips.map(({ title, dataSource, field, headerText }, i) => (
                        <div key={i} className="flex flex-col gap-5">
                            <h3 className="p-20-semibold text-dark-100">{title}</h3>
                            <GridComponent gridLines="None" dataSource={dataSource}>
                                <ColumnsDirective>
                                    <ColumnDirective template={(props: UserData) => (
                                        <div className="flex items-center gap-1.5 px-4">
                                            <img referrerPolicy="no-referrer" src={props?.imageUrl ? props.imageUrl : '/assets/images/david.webp'} alt="user" className="rounded-full size-8 aspect-ratio" />
                                            <span className="">{props.name}</span>
                                        </div>
                                    )} field="name" headerText="Name" width="200" textAlign="Left" />
                                    <ColumnDirective field={field} headerText={headerText} width="150" textAlign="Left" />
                                </ColumnsDirective>
                            </GridComponent>
                        </div>
                    ))
                }
            </section>
        </main>
    )
}

export default Dashboard