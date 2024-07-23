import { Select } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import debounce from 'lodash/debounce';

const SelectAddress = ({onSelect = () => {}}) => {
    const {
        placesService,
        placePredictions,
        getPlacePredictions,
        isPlacePredictionsLoading
    } = usePlacesService({
        apiKey: "AIzaSyBgIG9ULIh-4u_2VtKEH_YmBhiYP2wT4JA",
    });

    const [selectedAddress, setSelectedAddress] = useState()
     // const [options, setOptions] = useState([
        // {
        //     value: "Yuma, Arizona, Hoa Kỳ",
        //     label: "Yuma, Arizona, Hoa Kỳ",
        //     city: "Yuma",
        //     countryCode: "US",
        //     postalCode: "85364",
        //     state: "Arizona",
        // },
        // {
        //     value: "Texas, Hoa Kỳ",
        //     label: "Texas, Hoa Kỳ",
        //     city: "Texas",
        //     countryCode: "US",
        //     postalCode: "79567",
        //     state: "Texas",
        // },
    // ])

    useEffect(() => {
        // onSelect(selectedAddress)
        if(selectedAddress?.place_id){
            placesService?.getDetails(
                {
                    placeId: selectedAddress.place_id,
                },
                async (placeDetails) => {
                    let postalCode = ""
                    placeDetails?.address_components?.forEach(entry => {
                        if (entry.types?.[0] === "postal_code") {
                            postalCode = entry.long_name
                        }
                    })

                    let city = ""
                    placeDetails?.address_components?.forEach(entry => {
                        if (entry.types?.[0] === "locality") {
                            city = entry.long_name
                        }
                    })

                    let countryCode = ""
                    placeDetails?.address_components?.forEach(entry => {
                        if (entry.types?.[0] === "country") {
                            countryCode = entry.short_name
                        }
                    })

                    let state = ""
                    placeDetails?.address_components?.forEach(entry => {
                        if (entry.types?.[0] === "administrative_area_level_1") {
                            state = entry.long_name
                        }
                    })

                    const lat = placeDetails?.geometry.location.lat();
                    const lng = placeDetails?.geometry.location.lng();
                    if(!postalCode && lng && lat){
                        postalCode = await getPostcode(lat, lng)
                    }

                    onSelect({
                        label: placeDetails.formatted_address,
                        value: placeDetails.formatted_address,
                        postalCode,
                        city,
                        countryCode,
                        state
                    })
                }
            );
        }
    }, [selectedAddress])

    const fetchRef = useRef(0);

    const debounceFetcher = useMemo(() => {
    const loadOptions = (value) => {
            fetchRef.current += 1;
            
            getPlacePredictions({ input: value });
        };
        return debounce(loadOptions, 500);
    }, []);

    const getPostcode = async (lat, lng) => {
        try {
          return getPostcodeByLatLng(lat, lng)
        } catch (e) {
          console.error(e)
          return null
        }
    }

    const getPostcodeByLatLng = async (lat, lng) => {
        if (!lat || !lng) return null 
        const res = await fetch(`https://api.postcodes.io/postcodes?lon=${lng}&lat=${lat}`)
        return res?.result?.[0]?.postcode || null
    }

    return <>
        <Select
            showSearch
            optionFilterProp="children"
            onChange={(val, option) => {
                setSelectedAddress(option);
            }}
            onSearch={debounceFetcher}
            value={selectedAddress?.value}
            className="w-full"
            popupClassName=""
            filterOption={false}
            options={
                placePredictions.map(el => {
                    return {
                        value: el.description,
                        label: el.description,
                        place_id: el.place_id
                    }
                })
            }
        />
    </>
}
export default SelectAddress