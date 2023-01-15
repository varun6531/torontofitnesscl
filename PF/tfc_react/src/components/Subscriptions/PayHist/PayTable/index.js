import {useContext} from "react";
import PayContext from "../../../../Contexts/PayContext";
import '../style.css'

const PlayersTable = ({ perPage, params }) => {
    const { data } = useContext(PayContext);
    const email = JSON.parse(localStorage.getItem("user")).email

    return <div id="table-div"><table className="styled-table" style={{borderCollapse: 'collapse'}}>
        <thead>
        <tr style={{textAlign: 'center'}}>
            <th>#</th>
            <th>User</th>
            <th>Active Subscription (ID)</th>
            <th>Payment Date</th>
            <th>Payment Info</th>
            <th>Charge</th>
        </tr>
        </thead>
        <tbody>
        {data.map((dta, index) => (
                <tr key={dta.id} style={{textAlign: 'center'}}>
                    <td>{(params.page - 1) * (perPage + 1) + index + 1 }</td>
                    <td>{email}</td>
                    <td>{dta.active_subscription = dta.active_subscription ? dta.active_subscription : 'removed plan'}</td>
                    <td>{dta.payment_datetime}</td>
                    <td>{"Card_id:" + dta.payment_info}</td>
                    <td>{dta.cost}</td>
                </tr>
        ))}
        </tbody>
    </table>
    </div>
}

export default PlayersTable;