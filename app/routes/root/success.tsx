import { Link, useParams, type LoaderFunctionArgs } from "react-router"
import type { Route } from "./+types/success"
import { ButtonComponent } from "@syncfusion/ej2-react-buttons"

export const loader = ({ params }: LoaderFunctionArgs) => {
    console.log("param success", params)
    return params
}

const success = ({ loaderData }: Route.ComponentProps) => {
    console.log("param success", loaderData)

    const param = loaderData.id

    return (
        <main className="h-screen flex items-center justify-center">
            <article className="flex w-100 flex-col text-center items-center gap-4">
                <img src="/assets/icons/check.svg" alt="" className="size-24" />
                <h1 className="text-2xl text-dark-100 font-semibold">Thank You & Welcome Aboard!</h1>
                <p>Your trip’s booked — can’t wait to have you on this adventure! 🌍️ Get ready to explore & make memories.✨</p>
                <Link className="w-full " to={`/travel/${param}`}>
                    <ButtonComponent className="button-class !h-11 !w-full">
                        <span className="p-16-semibold text-white"> View trip details</span>
                    </ButtonComponent>
                </Link>
                <Link className="w-full " to={`/`}>
                    <ButtonComponent className="button-class-secondary !h-11 !w-full">
                        <img
                            src="/assets/icons/arrow-left.svg"
                            className="size-5"
                        />

                        <span className="p-16-semibold">Return to homepage</span>
                    </ButtonComponent>
                </Link>
            </article>
        </main>
    )
}

export default success