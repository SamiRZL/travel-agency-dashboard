import { Outlet, redirect } from "react-router"
import { RootNavbar, RootMobileSidebar } from "components"

import { account } from "~/appwrite/client"
import type { Route } from "./+types/page-layout"
import { getExistingUser, storeUserData } from "~/appwrite/auth"


export async function clientLoader() {
    try {

        const user = await account.get()
        if (!user.$id) return redirect('/sign-in')
        const existingUser = await getExistingUser(user.$id)

        return existingUser?.accountId ? existingUser : await storeUserData()
    } catch (e) {
        console.error(e)
        return redirect('/sign-in')
    }
}
const PageLayout = () => {
    return (
        <div className="flex flex-col w-full" >
            <RootMobileSidebar />
            <RootNavbar />
            <Outlet />
        </div>
    )
}

export default PageLayout