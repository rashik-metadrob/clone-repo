import { useState } from "react"
import "./styles.scss"
import global from "../../redux/global"

const steps = [
    {
        name: "Explore the Area",
        content: 'Press <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> to move around in the virtual space.'
    },
    {
        name: "Navigate",
        content: 'Click on navigate to explore different areas and highlights of the virtual space.'
    },
    // {
    //     name: "Invite your friends",
    //     content: 'Invite your friends in virtual store and shop as one. Explore the collection together for a delightful shopping experience.'
    // },
    {
        name: "Add to cart",
        content: 'Add & manage your cart in new and more exciting way.'
    },
    {
        name: "View Products",
        content: 'Step into the Future of Shopping: Explore Products in Your Home, Just Like at Local Stores'
    },
    {
        name: "Mic & Audio",
        content: 'Chat, Shop, Repeat: Hangout with Friends in Virtual Stores, Where Every Aisle is an Audio Adventure!'
    },
    {
        name: "Choose an avatar",
        content: 'Pick Your Alter Ego and Embark on an Adventure: Select an Avatar and Dive into a World Waiting to be Explored!'
    }
]

const drobASteps = [
    {
        name: "Explore the Area",
        content: 'Press <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> to move around in the virtual space.'
    },
    {
        name: "Navigate",
        content: 'Click on navigate to explore different areas and highlights of the virtual space.'
    },
    // {
    //     name: "Invite your friends",
    //     content: 'Invite your friends in virtual store and shop as one. Explore the collection together for a delightful shopping experience.'
    // },
    // {
    //     name: "Add to cart",
    //     content: 'Add & manage your cart in new and more exciting way.'
    // },
    {
        name: "View Products",
        content: 'Step into the Future of Shopping: Explore Products in Your Home, Just Like at Local Stores'
    },
    // {
    //     name: "Mic & Audio",
    //     content: 'Chat, Shop, Repeat: Hangout with Friends in Virtual Stores, Where Every Aisle is an Audio Adventure!'
    // },
    {
        name: "Choose an avatar",
        content: 'Pick Your Alter Ego and Embark on an Adventure: Select an Avatar and Dive into a World Waiting to be Explored!'
    }
]

const CustomerGuide = ({
    onSkip = () => {},
    showSkip = false
}) => {
    const [listStep, setListStep] = useState(global.IS_DROB_A ? drobASteps : steps)
    const [step, setStep] = useState(1)

    const onNext = () => {
        if(step < listStep.length){
            setStep(step + 1)
        } else if(showSkip){
            onSkip()
        }
    }

    return <>
        <div className="step-board max-w-[clamp(500px,100vh,100%)]">
            <div className="board-tittle px-[28px] pt-[clamp(5px,3vh,14px)] xl:pt-[clamp(10px,6vh,58px)] pb-[clamp(5px,3vh,14px)]">
                <div className="step-container">
                    {
                        listStep.map((el, index) => (
                            <div key={el.name} className={`step-item ${step === index + 1 ? 'active' : ''}`} onClick={() => {setStep(index + 1)}}>
                                {`${index + 1}. ${el.name}`}
                            </div>
                        ))
                    }
                </div>
                {showSkip && <div className="text-skip" onClick={() => {onSkip()}}>
                    Skip
                </div>}
            </div>
            <div className="board-content">
                <div className="board-image">

                </div>
                <div className="board-text">
                    <div className="content" dangerouslySetInnerHTML={{__html: listStep.find((el, index) => index === step - 1).content}}>
                    </div>
                    <div className="text-next" onClick={() => {onNext()}}>
                        {step < 7 ? 'Next' : 'Complete'}
                    </div>
                </div>
            </div>
        </div>
    </>
}
export default CustomerGuide;