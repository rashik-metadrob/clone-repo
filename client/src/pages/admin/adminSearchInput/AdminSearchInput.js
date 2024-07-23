import { Input } from "antd"
import SearchIcon from "../../../assets/images/layout/admin/search.svg"
import ExitIcon from "../../../assets/images/drob-a/exit.svg"
import SearchSuffixIcon from "../../../assets/images/layout/admin/search-suffix.svg"
import { useState } from "react"

const AdminSearchInput = ({
    onSearch = () => {}
}) => {
    const [searchValue, setSearchValue] = useState("")

    return <>
        <Input
            placeholder="Search"
            className='admin-shared-search'
            prefix={<img src={SearchIcon} alt="" />}
            value={searchValue}
            onChange={(e) => {
                setSearchValue(e.target.value)
            }}
            suffix={
                <>
                    {
                        searchValue && <img 
                            src={ExitIcon} 
                            alt="Clear" 
                            className="w-[24px] h-[24px] opacity-30 hover:opacity-100 cursor-pointer transition-all"
                            onClick={() => {
                                setSearchValue("")
                                onSearch("")
                            }}
                        />
                    }
                    {
                        !searchValue && <img 
                            src={SearchSuffixIcon}
                            alt=""
                        />
                    }
                </>
            }
            onPressEnter={() => {onSearch(searchValue)}}
        />
    </>
}

export default AdminSearchInput