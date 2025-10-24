import { cn } from '~/lib/utils';
import { parseTripData } from "~/lib/utils"
import { Header, TripCard } from "components"
import type { Route } from "./+types/travel-page"
import { getAllTrips } from "~/appwrite/trips"
import { Link, useSearchParams, type LoaderFunctionArgs } from "react-router"
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


const FeaturedDestination = ({ containerClass = '', bigCard = false, rating, title, activityCount, bgImage }: DestinationProps) => (
    <section className={cn('rounded-[14px] overflow-hidden bg-cover bg-center size-full min-w-[280px]', containerClass, bgImage)}>
        <div className="bg-linear200 h-full">
            <article className="featured-card">
                <div className={cn('bg-white rounded-20 font-bold text-red-100 w-fit py-px px-3 text-sm')}>
                    {rating}
                </div>

                <article className="flex flex-col gap-3.5">
                    <h2 className={cn('text-lg font-semibold text-white', { 'p-30-bold': bigCard })}>{title}</h2>

                    <figure className="flex gap-2 items-center">
                        <img
                            src="/assets/images/david.webp"
                            alt="user"
                            className={cn('size-4 rounded-full aspect-square', { 'size-11': bigCard })}
                        />
                        <p className={cn('text-xs font-normal text-white', { 'text-lg': bigCard })}>{activityCount} activities</p>
                    </figure>
                </article>
            </article>
        </div>
    </section>
)
const TravelPage = ({ loaderData }: Route.ComponentProps) => {
    const allTrips = loaderData.allTrips
    const [searchParams] = useSearchParams()
    const initialPage = Number(searchParams.get('page') || '1')

    const [currentPage, setCurrentPage] = useState(initialPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.location.search = `?page=${page}`
    }
    return (
        <main className="text-dark-100">
            <section id="hero-section"
                className="h-[90vh] relative px-[2rem] md:px-[5rem] bg-[url('/assets/images/hero-img.png')] bg-cover bg-left flex items-center md:items-center justify-start"
            >
                <div className="absolute z-5 inset-0 bg-black opacity-30"></div>

                <header className="flex flex-col z-10 text-white items-center md:items-start gap-6 w-full lg:w-[40%]">
                    <h1 className="text-6xl text-center md:text-start font-bold">Plan Your <br /> Trip with Ease</h1>
                    <p className="text-md text-center md:text-start">Customize your travel itinerary in minutes—pick your destination, set your preferences, and explore with confidence.</p>
                    <button onClick={() => {
                        const tripsSection = document.querySelector("#trips-section");
                        if (tripsSection) {
                            tripsSection.scrollIntoView({ behavior: "smooth" });
                        }
                    }} className="w-2/4 cursor-pointer hover:opacity-90 bg-[#256FF1] rounded text-white py-3 font-semibold">Get Started</button>
                </header>
            </section>
            <section className="pt-20 wrapper flex flex-col gap-10 h-full">
                <Header title="Featured Travel Destinations" description="Check out some of the best places you visit around the world" />
                <div className="featured">
                    <article>
                        <FeaturedDestination
                            bgImage="bg-card-1"
                            containerClass="h-1/3 lg:h-1/2"
                            bigCard
                            title="Barcelona Tour"
                            rating={4.2}
                            activityCount={196}
                        />

                        <div className="travel-featured">
                            <FeaturedDestination
                                bgImage="bg-card-2"
                                bigCard
                                title="London"
                                rating={4.5}
                                activityCount={512}
                            />
                            <FeaturedDestination
                                bgImage="bg-card-3"
                                bigCard
                                title="Australia Tour"
                                rating={3.5}
                                activityCount={250}
                            />
                        </div>
                    </article>

                    <div className="flex flex-col gap-[30px]">
                        <FeaturedDestination
                            containerClass="w-full h-[240px]"
                            bgImage="bg-card-4"
                            title="Spain Tour"
                            rating={3.8}
                            activityCount={150}
                        />
                        <FeaturedDestination
                            containerClass="w-full h-[240px]"
                            bgImage="bg-card-5"
                            title="Japan"
                            rating={5}
                            activityCount={150}
                        />
                        <FeaturedDestination
                            containerClass="w-full h-[240px]"
                            bgImage="bg-card-6"
                            title="Italy Tour"
                            rating={4.2}
                            activityCount={500}
                        />
                    </div>
                </div>
            </section>
            <section id="trips-section" className="pt-20 wrapper flex flex-col gap-10 h-full">
                <Header title="Handpicked Trips" description="Browse well-planned trips designed for different travel styles and interests" />
                <div className="trip-grid">
                    {allTrips?.map((trip) => (
                        <TripCard id={trip?.id} price={trip?.estimatedPrice} tags={[trip?.interests, trip?.travelStyle]} imageUrl={trip.imageUrls[0]} name={trip?.name} key={trip?.id} location={trip.itinerary?.[0].location} />
                    ))}
                </div>
                <PagerComponent cssClass="!mx-auto !mt-4 !mb-4" totalRecordsCount={loaderData.total} pageSize={8} click={(args) => handlePageChange(args.currentPage)} currentPage={currentPage} />
            </section>
            <footer className="h-28 bg-white">
                <div className="wrapper footer-container">
                    <Link to="/">
                        <img
                            src="/assets/icons/logo.svg"
                            alt="logo"
                            className="size-[30px]"
                        />
                        <h1>Tourvisto</h1>
                    </Link>

                    <div>
                        {['Terms & Conditions', "Privacy Policy"].map((item) => (
                            <Link to="/" key={item}>{item}</Link>
                        ))}
                    </div>
                </div>
            </footer>

        </main>
    )
}

export default TravelPage