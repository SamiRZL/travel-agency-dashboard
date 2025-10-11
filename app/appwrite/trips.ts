import { tablesDB, appwriteConfig } from "./client";
import { Query } from "appwrite";

export interface TripByIdResponse {
    $id: string,
    imageUrls: string[],
    paymentLink: string,
    tripDetail: string,
    $createdAt: Date,
    $updatedAt: Date,
}


export const getAllTrips = async (limit: number, offset: number) => {
    try {
        const { rows, total } = await tablesDB.listRows({
            databaseId: appwriteConfig.databaseId, tableId: appwriteConfig.tripcollectionId,
            queries: [Query.limit(limit), Query.offset(offset)]
        });
        return total > 0 ? { rows, total } : { rows: [], total: 0 };
    } catch (error) {
        console.error("Error fetching user:", error);
        return { rows: [], total: 0 }
    }
};

export const getTripById = async (id: string) => {
    const trip = await tablesDB.getRow({
        databaseId: appwriteConfig.databaseId, tableId: appwriteConfig.tripcollectionId, rowId: id
    });
    if (!trip.$id) {
        console.log('Trip not found')
        return null
    }
    console.log('Trip by id returned', trip)

    return trip

};

