import { Header } from "components"
const AllUsers = () => {
    const user = {
        name: 'Sami'
    }
    return (
        <main className="dashboard wrapper">
            <Header
                title={'Trips page'}
                description={'Check out our current users in real time'}

            />
        </main>
    )
}

export default AllUsers