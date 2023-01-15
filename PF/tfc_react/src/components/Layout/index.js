import {Link} from "react-router-dom";
import "./style.css"
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownToggle from "react-bootstrap/DropdownToggle";
import DropdownMenu from "react-bootstrap/DropdownMenu";
import {DropdownButton} from "react-bootstrap";

const NavUnlisted = styled.ul`
  display: flex;

  a {
    text-decoration: none;
  }

  li {
    align-content: center;
    color: #002366;
    margin: 0 0.8rem;
    font-size: 1.3rem;
    position: relative;
    list-style: none;
  }

  .current {
    li {
      border-bottom: 5px solid white;
    }
  }
`;

const Layout = () => {
    return (<>
        <div className="topbar">
            <NavLink to="/" activeClassName="current" exact>
                <div className="name"><h1>Toronto Fitness Club</h1></div>
            </NavLink>

            <div className="menu">
                <NavUnlisted>
                    <NavLink to="/" activeClassName="current" exact>
                        <li>Home</li>
                    </NavLink>
                    <NavLink to="/studios" activeClassName="current" exact>
                        <li>Studio</li>
                    </NavLink>
                    <NavLink to="/" activeClassName="current" exact>
                        <li>Search</li>
                    </NavLink>
                    <div className="dropdown">
                        <li>Account</li>
                        <div className="dropdown-content">
                            <NavLink to="/accounts/login" activeClassName="current" exact>
                                <li>Login</li>
                            </NavLink>
                            <NavLink to="/accounts/register" activeClassName="current" exact>
                                <li>Sign Up</li>
                            </NavLink>
                            <NavLink to="/accounts/view-profile" activeClassName="current" exact>
                                <li>View Profile</li>
                            </NavLink>
                            <NavLink to="/accounts/edit-profile" activeClassName="current" exact>
                                <li>Edit Profile</li>
                            </NavLink>
                            <NavLink to="/accounts/card-info" activeClassName="current" exact>
                                <li>Add Card</li>
                            </NavLink>
                            <NavLink to="/accounts/logout" activeClassName="current" exact>
                                <li>Logout</li>
                            </NavLink>
                        </div>

                    </div>
                    <div className="dropdown">
                        <li>Subscriptions</li>
                        <div className="dropdown-content">
                            <NavLink to="/subscriptions/view-all-plans" activeClassName="current" exact>
                                <li>View Plans</li>
                            </NavLink>
                            <NavLink to="/subscriptions/subscribe" activeClassName="current" exact>
                                <li>Subscribe</li>
                            </NavLink>
                            <NavLink to="/subscriptions/edit-subscription" activeClassName="current" exact>
                                <li>Edit</li>
                            </NavLink>
                            <NavLink to="/subscriptions/cancel-subscription" activeClassName="current" exact>
                                <li>Cancel</li>
                            </NavLink>
                            <NavLink to="/subscriptions/payment-history" activeClassName="current" exact>
                                <li>Pay History</li>
                            </NavLink>
                            <NavLink to="/subscriptions/future-payments" activeClassName="current" exact>
                                <li>Next Billing</li>
                            </NavLink>
                        </div>

                    </div>


                    {/*<DropdownButton id="accounts" title="Accounts" className="dropdownbutton">*/}

                    {/*    <DropdownMenu>*/}
                    {/*        /!*TODO: add links*!/*/}
                    {/*        <Dropdown.Item href={"/studios"}><li>Login</li></Dropdown.Item>*/}
                    {/*    </DropdownMenu>*/}

                    {/*</DropdownButton>*/}


                </NavUnlisted>
            </div>

        </div>
    </>
    )
}

export default Layout