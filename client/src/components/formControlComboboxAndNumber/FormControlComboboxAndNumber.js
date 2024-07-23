import { Divider, Input, Select, Space } from "antd"
import "./styles.scss"
import { useEffect, useState } from "react";
import DownArrowIcon from "../../assets/icons/DownArrowIcon";

const FormControlComboboxAndNumber = ({
    value,
    options,
    isSaveOption = false,
    onChange = () => {},
    placeholder="Please enter"
}) => {

    const [optionsList, setOptionsList] = useState(options)

    const [name, setName] = useState('');
    const onNameChange = (event) => {
        setName(event.target.value);
    };
    const addItem = () => {
        if(name === '') {
            return;
        }

        const isExist = optionsList.find((item) => item.value == name);

        if(!isExist) {
            if(isSaveOption) {
                setOptionsList([
                    ...optionsList,
                    {
                        label: `${name}`,
                        value: `${name}`,   
                    }
                ])
            }
            setTimeout(() => {
                onChange(`${name}`)
            }, 100);
        }
        else {
            setTimeout(() => {
                onChange(`${name}`)
            }, 100);
        }
        setName('');
    };

    function onKeyDown(e) {
        if(e.keyCode === 13) {
            addItem();
        }
    }

    // useEffect(() => {
    //     const isExist = optionsList.find((item) => item.value == value);

    //     if(!isExist) {
    //         setOptionsList([
    //             ...optionsList,
    //             {
    //                 label: `${value}`,
    //                 value: `${value}`,   
    //             }
    //         ])
    //     }
    // }, [])

    return <>
        <Select
            className="custom-combobox"
            popupClassName="custom-combobox__popup-render"
            suffixIcon={<DownArrowIcon/>}
            dropdownRender={(menu) => (
                <>
                    {menu}
                    <Divider
                        style={{
                            margin: '8px 0',
                            background: 'white'
                        }}
                    />
                    <Space
                        style={{
                            padding: '0 8px 4px',
                        }}
                        className="custom-input__select"
                        onBlur={() => setName("")}
                    >
                        <Input
                            className="number-input__combobox"
                            placeholder={placeholder}
                            value={name}
                            onChange={onNameChange}
                            onKeyDown={onKeyDown}
                            type="number"
                            controls={false}
                        />
                    </Space>
                </>
            )}
            options={optionsList}
            value={value}
            onChange={(e) => onChange(e)}
        />
    </>
}

export default FormControlComboboxAndNumber