import type { LoaderFunctionArgs } from "react-router"
import { getAllTrips, getTripById } from "~/appwrite/trips"
import type { Route } from "./+types/trips-detail"
import { cn, getFirstWord, parseTripData } from "~/lib/utils"
import { Header, InfoPill, TripCard } from "components"
import { ChipDirective, ChipListComponent, ChipsDirective } from "@syncfusion/ej2-react-buttons"


export const loader = async ({ params }: LoaderFunctionArgs) => {
    const { id } = params
    if (!id) throw new Error("Empty id")
    const [trip, trips] = await Promise.all([
        getTripById(id),
        getAllTrips(4, 0)
    ])

    return {
        trip,
        allTrips: trips?.rows?.map(({ $id, tripDetail, imageUrls, }) => (
            {
                id: $id,
                ...parseTripData(tripDetail),
                imageUrls: imageUrls ?? []
            }
        )) as Trip[]
    }
}

const TripsDetail = ({ loaderData }: Route.ComponentProps) => {
    console.log("lodaer trip details", loaderData)
    const imageUrls = loaderData?.trip?.imageUrls
    const tripDetailData = parseTripData(loaderData?.trip?.tripDetail)
    const { name, duration, itinerary, travelStyle, interests, groupType, budget, description, weatherInfo, bestTimeToVisit, country, estimatedPrice } = tripDetailData || {}
    const pillItems = [
        { text: travelStyle, bg: '!bg-pink-50 !text-pink-500' },
        { text: interests, bg: '!bg-navy-50 !text-navy-500' },
        { text: groupType, bg: '!bg-primary-50 !text-primary-500' },
        { text: budget, bg: '!bg-success-50 !text-success-500' },
    ]
    const allTrips = loaderData.allTrips
    const visitTimeAndWeatherInfo = [
        { title: 'Best Time to Visit:', items: bestTimeToVisit },
        { title: 'Weather:', items: weatherInfo }
    ]
    return (
        <main className="travel-detail wrapper">
            <Header title='Trip Details' description='View and edit AI-generated travel plans' />
            <section className="container wrapper-md">
                <header>
                    <h1 className="p-40-semibold text-dark-100">{name}</h1>
                    <div className="flex items-center gap-5">
                        <InfoPill image='/assets/icons/calendar.svg' text={`${duration} day plan`} />
                        <InfoPill image='/assets/icons/location-mark.svg' text={itinerary?.map((item) => item.location).join(', ') || ''} />
                    </div>
                </header>
                <section className="gallery">
                    {imageUrls.map((url: string, i: number) => (
                        <img src={url} key={i} alt="" className={cn('w-full rounded-xl object-cover', i === 0 ? 'md:col-span-2 md:row-span-2 h-[330px]' : 'md:row-span-1 h-[150px]')} />
                    ))}
                </section>
                <section className="flex gap-3 md:gap-5 items-center flex-wrap">
                    <ChipListComponent id='travel-chip'>
                        <ChipsDirective>
                            {pillItems.map((item, i: number) => (
                                <ChipDirective cssClass={`${item.bg} !font-medium px-4 !text-base`} key={i} text={getFirstWord(item.text)} />
                            ))}
                        </ChipsDirective>
                    </ChipListComponent>
                    <ul className="flex gap-1 items-center">
                        {Array(5).fill(null).map((_, i: number) => (
                            <li key={i}>
                                <img src="/assets/icons/star.svg" alt="star" className="size-[18px]" />
                            </li>

                        ))}
                        <li className="ml-1">
                            <ChipListComponent>
                                <ChipsDirective>
                                    <ChipDirective cssClass='!bg-yellow-50 !text-yellow-700' text='4,9/5' />
                                </ChipsDirective>
                            </ChipListComponent>
                        </li>
                    </ul>
                </section>
                <section className="title">
                    <article >
                        <h3 className="">{duration}-Day {country} {travelStyle} Trip</h3>
                        <p>{budget}, {groupType} and {interests}</p>
                        <h2>{estimatedPrice}</h2>
                    </article>
                </section>
                <p className="text-sm md:text-lg font-normal text-dark-400">{description}</p>
                <ul className="itinerary">
                    {itinerary?.map((dayPlan: DayPlan, index: number) => (
                        <li key={index}>
                            <h3>Day {dayPlan.day}: {dayPlan.location}</h3>
                            <ul>
                                {dayPlan.activities.map((activity, i: number) => (
                                    <li key={i}>
                                        <span className="flex-shrink-0 p-18-semibold">{activity.time}</span>
                                        <p className="flex-grow">{activity.description}</p>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
                {visitTimeAndWeatherInfo.map((section, i: number) => (
                    <section className="visit" key={i}>
                        <div>
                            <h3>{section.title}</h3>
                            <ul>
                                {section.items?.map((item, i: number) => (
                                    <li key={i}>
                                        <p className="flex-grow">
                                            {item}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>
                ))}

            </section>
            <section className="flex flex-col gap-6">
                <h2 className="p-24-semibold text-dark-100">Popular Trips</h2>
                <div className="trip-grid">
                    {allTrips?.map((trip) => (
                        <TripCard id={trip?.id} price={trip?.estimatedPrice} tags={[trip?.interests, trip?.travelStyle]} imageUrl={trip.imageUrls[0]} name={trip?.name} key={trip?.id} location={trip.itinerary?.[0].location} />
                    ))}
                </div>
            </section>
        </main>
    )
}

export default TripsDetail