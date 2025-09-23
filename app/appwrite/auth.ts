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
        if (!user) return redirect('/sign-in')
        const { rows } = await tablesDB.listRows({
            databaseId: appwriteConfig.databaseId, tableId: appwriteConfig.userCollectionId, queries: [Query.equal('id', user.$id), Query.select(['name', 'email', 'imageUrl', 'joinedAt', '$id'])]
        })
        return rows.length > 0 ? rows[0] : redirect("/sign-in");

    } catch (e) {
        console.error(e)
        return null
    }
}

export const getExistingUser = async (id: string) => {
    try {
        const { rows, total } = await tablesDB.listRows({
            databaseId: appwriteConfig.databaseId, tableId: appwriteConfig.userCollectionId, queries:
                [Query.equal("id", id)]
        });
        return total > 0 ? rows[0] : null;
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
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
                joinedAt: new Date().toISOString(),
            }
        });

        if (!createdUser.$id) redirect("/sign-in");
    } catch (error) {
        console.error("Error storing user data:", error);
    }
};

const getGooglePicture = async (accessToken: string) => {
    try {
        const response = await fetch(
            "https://people.googleapis.com/v1/people/me?personFields=photos",
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        if (!response.ok) throw new Error("Failed to fetch Google profile picture");

        const { photos } = await response.json();
        return photos?.[0]?.url || null;
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