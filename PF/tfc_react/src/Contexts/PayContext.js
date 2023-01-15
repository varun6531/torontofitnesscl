import {createContext, useState} from "react";

export const useAPIContext = () => {
    const [data, setData] = useState([]);

    return {
        data,
        setData,
    }
}

const PayContext = createContext({
    data: null, setData: () => {},
})

export default PayContext;
