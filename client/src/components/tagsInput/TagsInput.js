import { useMemo } from "react";
import "./styles.scss"
import { WithContext as ReactTags } from 'react-tag-input';
import { notification } from "antd";

const KeyCodes = {
    command: 188,
    enter: 13
};
const delimiters = [KeyCodes.command, KeyCodes.enter];

const TagsInput = ({
    value,
    onChange = () => {},
    suggestions = [],
    className
}) => {
    const shownTags = useMemo(() => {
        if(value && value.length > 0){
            return value.map(el => {
                return {
                    id: el,
                    text: el
                }
            })
        } else {
            return []
        }
    }, [value])

    const handleDelete = i => {
        onChange(
            shownTags.filter((tag, index) => index !== i).map(el => el.text)
        )
    };
    
    const handleAddition = tag => {
        if(!tag){
            notification.warning({
                message: "Tag can not be null!"
            })
        }
        onChange(
            [...shownTags, tag].map(el => el.text.replace(/ /g, ""))
        )
    };
    
    const handleDrag = (tag, currPos, newPos) => {
        const newTags = shownTags.slice();

        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);

        onChange(
            newTags.map(el => el.text)
        )
    };
    
    const handleTagClick = index => {
        
    };

    return <>
        <ReactTags
            tags={shownTags}
            suggestions={suggestions}
            delimiters={delimiters}
            handleDelete={handleDelete}
            handleAddition={handleAddition}
            handleDrag={handleDrag}
            handleTagClick={handleTagClick}
            inputFieldPosition="bottom"
            autocomplete
            placeholder="Add tag"
            classNames= {{
                tags: className ? className : "meta-tags"
            }}
        />
    </>
}
export default TagsInput;