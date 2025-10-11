import { parseTripData } from "~/lib/utils"
import { Header, TripCard } from "components"
import type { Route } from "./+types/trips"
import { getAllTrips } from "~/appwrite/trips"
import { useSearchParams, type LoaderFunctionArgs } from "react-router"
import { useState } from "react"
import { PagerComponent } from "@syncfusion/ej2-react-grids"


export const loader = async ({ request }: LoaderFunctionArgs) => {
    const limit = 8;
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1', 10)
    const offset = (page - 1) * limit
    const { rows: trips, total } = await getAllTrips(limit, offset)

    return {
        allTrips: trips?.map(({ $id, tripDetail, imageUrls, }) => (
            {
                id: $id,
                ...parseTripData(tripDetail),
                imageUrls: imageUrls ?? []
            }
        )) as Trip[],
        total
    }
}

const Trips = ({ loaderData }: Route.ComponentProps) => {
    const allTrips = loaderData.allTrips
    const [searchParams] = useSearchParams()
    const initialPage = Number(searchParams.get('page') || '1')

    const [currentPage, setCurrentPage] = useState(initialPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.location.search = `?page=${page}`
    }

    return (
        <main className="all-users wrapper">
            <Header
                title='Trips'
                description='View and Edit AI-generated Travel Plans'
                ctaText='Create a Trip'
                cta='/trips/create'
            />
            <section >
                <h1 className="p-24-semibold mb-5 text-dark-100">
                    Manage Created Trips
                </h1>
                <div className="trip-grid">
                    {allTrips?.map((trip) => (
                        <TripCard id={trip?.id} price={trip?.estimatedPrice} tags={[trip?.interests, trip?.travelStyle]} imageUrl={trip.imageUrls[0]} name={trip?.name} key={trip?.id} location={trip.itinerary?.[0].location} />
                    ))}
                </div>
            </section>

            <PagerComponent cssClass="!mb-4" totalRecordsCount={loaderData.total} pageSize={8} click={(args) => handlePageChange(args.currentPage)} currentPage={currentPage} />
        </main>
    )
}

export default Trips