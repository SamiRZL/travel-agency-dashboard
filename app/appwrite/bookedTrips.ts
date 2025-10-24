import { tablesDB, appwriteConfig } from "~/appwrite/client";
import { Query } from "appwrite";



export const getBookedTripById = async (userId: string, tripId: string) => {
    const { rows, total } = await tablesDB.listRows({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.bookedTripsCollectionId,
        queries: [Query.and([Query.equal("users", [userId]), Query.equal("trips", [tripId])])]

    });
    if (total == 0) {
        console.log('Booked Trip not found')
        return false
    }
    console.log('Booked trip', rows[0])

    return true

};