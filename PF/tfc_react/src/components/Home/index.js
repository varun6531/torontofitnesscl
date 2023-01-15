import Layout from "../Layout";
import SearchBar from "../SearchBar";
import {Link} from "react-router-dom";
import "./style.css"
const Home = () => {
    return (
        <>
            <div><Layout /></div>

            <div className="home">
                <div className="mainpage">
                    <Link to={"/studios"}><h1>Studios</h1></Link>
                    <p>Explore our vast number of facilities and find one near you!</p>
                    <h1>Classes</h1>
                    <p>Check out the classes we offer at each of our studios, choose a studio and get started!</p>
                </div>
                <div className="search"><SearchBar /></div>
            </div>

        </>
    )


}

export default Home