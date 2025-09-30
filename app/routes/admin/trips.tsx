import { Header } from "components"
const Trips = () => {
    return (
        <main className="all-users wrapper">
            <Header
                title='Trips'
                description='View and Edit AI-generated Travel Plans'
                ctaText='Create a Trip'
                cta='/trips/create'
            />
        </main>
    )
}

export default Trips