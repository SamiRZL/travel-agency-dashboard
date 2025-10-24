import { ID, OAuthProvider, Query } from "appwrite"
import { account, appwriteConfig, database, tablesDB } from "./client"
import { redirect } from "react-router"


export const loginWithGoogle = async () => {
    try {
        account.createOAuth2Session({
            provider: OAuthProvider.Google, success: `${window.location.origin}/`,
            failure: `${window.location.origin}/404`,
        })
    } catch (e) {
        console.error(e)
    }
}
export const getUser = async () => {
    try {
        const user = await account.get()
        if (!user) throw redirect('/sign-in')
        const { rows } = await tablesDB.listRows({
            databaseId: appwriteConfig.databaseId, tableId: appwriteConfig.userCollectionId, queries: [Query.equal('accountId', user.$id), Query.select(['name', 'email', 'imageUrl', '$createdAt', 'accountId'])]
        })
        if (rows.length === 0) throw redirect('/sign-in') // User data not found

        return rows[0] as unknown as User
    } catch (e) {
        console.error(e)
        throw redirect('/sign-in') // Any error -> redirect
    }
}

export const getExistingUser = async (id: string) => {
    console.log("id param : ", id)
    try {
        const { rows, total } = await tablesDB.listRows({
            databaseId: appwriteConfig.databaseId, tableId: appwriteConfig.userCollectionId, queries:
                [Query.equal("accountId", id)]
        });
        console.log("rows : ", rows)
        return total > 0 ? rows[0] : null;
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
};
export const getAllUsers = async (limit: number, offset: number) => {
    try {
        const { rows, total } = await tablesDB.listRows({
            databaseId: appwriteConfig.databaseId, tableId: appwriteConfig.userCollectionId,
            queries: [Query.limit(limit), Query.offset(offset)]
        });
        return total > 0 ? { rows, total } : { rows: [], total: 0 };
    } catch (error) {
        console.error("Error fetching user:", error);
        return { rows: [], total: 0 }
    }
};

export const storeUserData = async () => {
    try {
        const user = await account.get();
        if (!user) throw new Error("User not found");

        const { providerAccessToken } = (await account.getSession({ sessionId: "current" })) || {};
        const profilePicture = providerAccessToken
            ? await getGooglePicture(providerAccessToken)
            : null;

        const createdUser = await tablesDB.createRow({

            databaseId: appwriteConfig.databaseId,
            tableId: appwriteConfig.userCollectionId,
            rowId: ID.unique(),
            data: {
                accountId: user.$id,
                email: user.email,
                name: user.name,
                imageUrl: profilePicture,
            }
        });
        if (!createdUser.accountId) redirect("/sign-in");
    } catch (error) {
        console.error("Error storing user data:", error);
    }
};

export const getGooglePicture = async (accessToken: string) => {
    try {
        console.log("access token",)
        const response = await fetch(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        if (!response.ok) throw new Error("Failed to fetch Google profile picture");

        const { picture } = await response.json();
        console.log("here is the picture ", picture)
        return picture || null;
    } catch (error) {
        console.error("Error fetching Google picture:", error);
        return null;
    }
};

export const logoutUser = async () => {
    try {
        await account.deleteSession({ sessionId: "current" });
    } catch (error) {
        console.error("Error during logout:", error);
    }
};