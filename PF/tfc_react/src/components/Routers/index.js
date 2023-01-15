import {BrowserRouter, Route, Routes} from "react-router-dom";
import Studios from "../Studios";
import StudioInfo from "../StudioInfo";
import SearchBar from "../SearchBar";
import Home from "../Home";
import AddCard from "../Accounts/AddCard"
import EditSub from "../Subscriptions/EditSub"
import CancelSub from "../Subscriptions/CancelSub"
import PayHist from "../Subscriptions/PayHist"
import FutPay from "../Subscriptions/FutPay"
import PayContext, {useAPIContext} from "../../Contexts/PayContext";
import Login from "../Accounts/Login";
import Register from "../Accounts/Register";
import Logout from "../Accounts/Logout";
import EditProfile from "../Accounts/EditProfile";
import ViewProfile from "../Accounts/ViewProfile";
import Subscribe from "../Subscriptions/Subscribe";
import AllPlans from "../Subscriptions/AllPlans";
const Router = () => {


        const data = (
            <PayContext.Provider value={useAPIContext()}>
                <PayHist/>
            </PayContext.Provider>
        )


    return (
        <BrowserRouter>
            <Routes>
                <Route path="/">
                    <Route index element={<Home />} />
                    <Route path="studios" element={<Studios />} />
                    <Route path="studio/:id/:location" element={<StudioInfo />} />
                    <Route path="accounts/">
                        <Route path="login/" element={<Login />} />
                        <Route path="card-info/" element={<AddCard />} />
                        <Route path="register/" element={<Register />} />
                        <Route path="logout/" element={<Logout />} />
                        <Route path="edit-profile/" element={<EditProfile />} />
                        <Route path="view-profile/" element={<ViewProfile />} />
                    </Route>
                    <Route path="subscriptions/">
                        <Route path="subscribe/" element={<Subscribe />} />
                        <Route path="edit-subscription/" element={<EditSub />} />
                        <Route path="cancel-subscription/" element={<CancelSub />} />
                        <Route path="view-all-plans/" element={<AllPlans />} />
                        <Route path="payment-history/" element={data} />
                        <Route path="future-payments/" element={<FutPay />} />
                    </Route>
                    <Route path="search" element={<SearchBar />} />

                </Route>

            </Routes>
        </BrowserRouter>
    )

}

export default Router;