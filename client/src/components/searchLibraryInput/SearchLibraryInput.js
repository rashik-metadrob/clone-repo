import { Input } from "antd"
import SearchIcon from "../../assets/images/project/search.svg"
import ExitIcon from "../../assets/images/drob-a/exit.svg"
import './styles.scss'
import { useState } from "react"

const SearchLibraryInput = ({
    onSearch
}) => {
    const [searchValue, setSearchValue] = useState("")

    return <>
        <Input
            placeholder="Search Library"
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
                            src={SearchIcon}
                            alt="Search"
                        />
                    }
                </>
            }
            className="search-library-input"
            value={searchValue}
            onChange={(e) => {setSearchValue(e.target.value)}}
            onPressEnter={() => {onSearch(searchValue)}}
        />
    </>
}
export default SearchLibraryInput