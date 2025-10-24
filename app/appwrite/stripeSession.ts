import { redirect } from "react-router";
import { functions } from "./client";


export const handleCheckout = async (trip: Trip, imageUrl: string, tripId: string, userId: string) => {
    console.log("Trip id is here ", tripId)
    try {
        const response = await functions.createExecution({
            functionId: "68ed0830002887de57b6",
            body: JSON.stringify({
                tripId: tripId,
                userId: userId,
                amount: trip.estimatedPrice,
                title: trip.name,
                image: imageUrl,
                //object: `${trip.duration}-Day ${trip.country} ${trip.travelStyle} Trip`,
                description: `${trip.budget}, ${trip.groupType} and ${trip.interests}`,
                currency: "usd"
            })
        });
        // ✅ Check before parsing
        if (!response?.responseBody) {
            console.error("Empty response from server:", response);
            return;
        }

        let parsed;
        try {
            parsed = JSON.parse(response.responseBody);
        } catch (err) {
            console.error("Failed to parse JSON:", response.responseBody);
            return;
        }

        const checkoutUrl = parsed?.url;
        if (checkoutUrl) {
            window.location.href = checkoutUrl;
        } else {
            console.error("No redirect URL found", response);
        }

    } catch (e) {
        console.error("error from handleCheckout function", e)
    }

}
