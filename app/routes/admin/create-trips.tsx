import { ComboBoxComponent } from "@syncfusion/ej2-react-dropdowns"
import { Header } from "components"
import { useState } from "react"
import { Query } from '@syncfusion/ej2-data';
import type { Route } from "./+types/create-trips"
import { comboBoxItems, selectItems } from "~/constants"
import { formatKey, cn } from "~/lib/utils"
import { LayerDirective, LayersDirective, MapsComponent } from "@syncfusion/ej2-react-maps"
import { world_map } from "~/constants/world_map"
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { account } from "~/appwrite/client";
import { useNavigate } from "react-router";


export const loader = async () => {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,latnlg,flag,maps')
        const data = await response.json()
        console.log("here are the countries ", data)
        return data?.map((country: any) => ({
            name: country.flag + country.name.common,
            coordinates: country.latnlg,
            value: country.name.common,
            openStreetMap: country.maps?.openStreetMap,
        }))
    } catch (e) {
        console.log(e)
        return null
    }

}
const CreateTrips = ({ loaderData }: Route.ComponentProps) => {
    const navigate = useNavigate()
    const countries = loaderData as Country[]
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    // Filtering function for countries
    const onCountryFiltering = (args: any) => {
        let query = new Query();
        query = (args.text !== "")
            ? query.where("value", "startswith", args.text, true)
            : query;

        args.updateData(countriesData, query);
    }

    // Filtering function for other comboBox items
    const onItemFiltering = (args: any, item: keyof TripFormData) => {
        let query = new Query();
        query = (args.text !== "")
            ? query.where("text", "startswith", args.text, true)
            : query;

        const filteredData = comboBoxItems[item].map((boxItem) => ({
            text: boxItem,
            value: boxItem
        }));

        args.updateData(filteredData, query);
    }
    const [formData, setFormData] = useState<TripFormData>({
        country: countries[0]?.name || '',
        travelStyle: '',
        interest: '',
        budget: '',
        duration: 0,
        groupType: ''

    });
    const handleChange = (key: keyof TripFormData, value: string | number) => {
        setFormData({ ...formData, [key]: value })
    }
    const mapData = [
        {
            country: formData.country,
            color: '#EA382E',
            coordinates: countries.find((c: Country) => c.name === formData.country)?.coordinates || []
        }
    ]
    const countriesData = countries.map((country) => ({
        text: country.name,
        value: country.value
    }))
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        if (!formData.budget || !formData.country || !formData.duration || !formData.groupType || !formData.interest || !formData.travelStyle) {
            setError("All fields are required.")
            setLoading(false)
            return;
        }
        if (formData.duration < 1 || formData.duration > 10) {
            setError("Duration must be between 1 and 10")
            setLoading(false)
            return;
        }
        const user = await account.get()
        if (!user.$id) {
            setError("User not authentication")
            setLoading(false)
            return;
        }
        try {
            const response = await fetch('/api/create-trip', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    country: formData.country,
                    travelStyle: formData.travelStyle,
                    budget: formData.budget,
                    numberOfDays: formData.duration,
                    groupType: formData.groupType,
                    interests: formData.interest,
                    userId: user.$id
                })
            })
            const result: CreateTripResponse = await response.json()
            if (result.id) {
                navigate(`/trips/${result.id}`)
            } else {
                console.error("Result id is empty")
            }
        } catch (e: any) {
            setError(`${e.message}`)
            console.error("Error generating trip", e)
        } finally {
            setLoading(false)
        }
    }
    return (
        <main className="flex flex-col gap-10 pb-20 wrapper">
            <Header
                title='Add a New Trip'
                description='View and Edit AI-generated Travel Plans'
            />
            <section className="mt-2.5 wrapper-md">
                <form onSubmit={handleSubmit} className="trip-form">
                    <div>
                        <label htmlFor="country">
                            Country
                        </label>
                        <ComboBoxComponent
                            id="country"
                            dataSource={countriesData}
                            fields={{ text: 'text', value: 'value' }}
                            placeholder="Select a Country"
                            className='combo-box'
                            allowFiltering
                            change={(e: { value: string | undefined }) => {
                                if (e.value) {
                                    handleChange('country', e.value)
                                }
                            }}
                            filtering={onCountryFiltering}
                        />
                    </div>
                    <div>
                        <label htmlFor="duration">Duration</label>
                        <input onChange={(e) => handleChange('duration', Number(e.target.value))} id="duration" name="duration" placeholder="Enter a number of days" className="form-input placeholder:text-gray-500" />
                    </div>
                    {selectItems.map((item) => (
                        <div key={item}>
                            <label htmlFor={item}>{formatKey(item)}</label>
                            <ComboBoxComponent
                                id={item}
                                dataSource={comboBoxItems[item].map((boxItem) => (
                                    {
                                        text: boxItem,
                                        value: boxItem,
                                    }
                                ))}
                                fields={{ text: 'text', value: 'value' }}
                                placeholder={`Select ${formatKey(item)}`}
                                className='combo-box'
                                allowFiltering
                                change={(e: { value: string | undefined }) => {
                                    if (e.value) {
                                        handleChange(item, e.value)
                                    }
                                }}
                                filtering={(args) => onItemFiltering(args, item)}
                            />
                        </div>
                    ))}
                    <div>
                        <label htmlFor="location">Location on the World Map</label>
                        <MapsComponent>
                            <LayersDirective>
                                <LayerDirective shapePropertyPath="name" shapeDataPath="country" shapeSettings={{ colorValuePath: "color", fill: "#E5E5E5" }} shapeData={world_map} dataSource={mapData} />
                            </LayersDirective>
                        </MapsComponent>
                    </div>
                    <div className="bg-gray-200 h-px w-full" />
                    {error && (
                        <div className="error">
                            <p>{error}</p>
                        </div>
                    )}
                    <footer className="px-6 w-full">
                        <ButtonComponent type="submit" disabled={loading} className="button-class !h-12 !w-full">
                            <img src={`/assets/icons/${loading ? 'loader.svg' : 'magic-star.svg'}`} alt="" className={cn('size-5', { 'animate-spin': loading })} />
                            <span className="p-16-semibold text-white">
                                {loading ? 'Generating...' : 'Generate Trip'}
                            </span>
                        </ButtonComponent>
                    </footer>
                </form>
            </section>
        </main>
    )
}

export default CreateTrips