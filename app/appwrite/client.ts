import { Client, Account, Databases, Storage, TablesDB } from 'appwrite';
export const appwriteConfig = {
    endpointUrl: import.meta.env.VITE_APPWRITE_API_ENDPOINT,
    projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
    apiKey: import.meta.env.VITE_APPWRITE_API_KEY,
    databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
    userCollectionId: import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
    tripcollectionId: import.meta.env.VITE_APPWRITE_TRIPS_COLLECTION_ID,
}

export const client = new Client();

client
    .setEndpoint(appwriteConfig.endpointUrl)
    .setProject(appwriteConfig.projectId); // Replace with your project ID

export const account = new Account(client);
export const database = new Databases(client);
export const storage = new Storage(client);
export const tablesDB = new TablesDB(client);

export { ID } from 'appwrite';
