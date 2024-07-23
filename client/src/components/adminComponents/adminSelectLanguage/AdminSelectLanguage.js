import { Dropdown, Select } from "antd"
import ArrowIcon from "../../../assets/images/products/arrow.svg"
import i18n from "../../../languages/i18n";
import { useEffect, useState } from "react";
import EnglandIcon from "../../../assets/images/countries/england.png"
import IndiaIcon from "../../../assets/images/countries/india.png"
import { useDispatch, useSelector } from 'react-redux';
import { getLanguage, setLanguage } from "../../../redux/appSlice";
import { useAppDispatch } from "../../../redux";
import _ from "lodash";

const AdminSelectLanguage = () => {
    const dispatch = useAppDispatch()
    const [listLanguages] = useState([
        {
            value: "en",
            label: "English",
            image: EnglandIcon
        },
        {
            value: "in",
            label: "India",
            image: IndiaIcon
        }
    ])
    const language = useSelector(getLanguage)

    return <>
        <Dropdown
            dropdownRender={() => (
                <>
                <div className="admin-form-select-popup-with-image">
                    <div className="popup-content w-[120px]">
                        {
                            listLanguages.map(el => (
                                <div className="item !grid-cols-[32px,1fr] !gap-[8px]" onClick={(e) => {dispatch(setLanguage(el.value))}}>
                                    <div className="image-container w-[32px]">
                                        <img src={el.image} alt="" className="w-[32px] h-[32px]"/>
                                    </div>
                                    <span>
                                        {el.label}
                                    </span>
                                </div>
                            ))
                        }
                    </div>
                </div>
                </>
            )}
            suffixIcon={<img src={ArrowIcon} alt="" />}
            options={listLanguages}
            trigger={'click'}
        >
            <div className="w-[32px] h-[32px] cursor-pointer">
                <img src={_.get(_.find(listLanguages, el => el.value === (language || 'en')), ['image'])} alt="" className="w-[32px] h-[32px]"/>
            </div>
        </Dropdown>
    </>
}
export default AdminSelectLanguage