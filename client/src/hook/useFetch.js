import { useEffect, useState } from "react"
import axios from '../api/base.api';
import _ from "lodash";

const useFetch = (url) => {
    const [apiData, setApiData] = useState()
    const [isSuccess, setIsSuccess] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [errorText, setErrorText] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        axios.get(url).then(rs => {
            setApiData(rs.data)
            setIsSuccess(true)
            setIsLoading(false)
            setErrorText("")
        }).catch(err => {
            setApiData(null)
            setIsSuccess(false)
            setIsLoading(false)
            setErrorText(_.get(err, ['response', 'data', 'message'], `Error!`))
        }) 
    }, [url])

    return {
        apiData,
        isSuccess,
        isLoading,
        errorText
    }
}

export default useFetch