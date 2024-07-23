import { Drawer } from "antd"
import { forwardRef } from "react"
import "./styles.scss"
import ExitIcon from "../../assets/images/project/exit.svg"
import ThemeIcon from "../../assets/images/project/theme.svg"

import ThemeCollapseContainer from "./components/themeCollapseContainer/ThemeCollapseContainer"
import PreviewLoadingScreen from "./components/previewLoadingScreen/PreviewLoadingScreen"
import { DRAWER_THEME_WIDTH } from "../../utils/constants"

const DrawerTheme = forwardRef(({
    open,
    onClose = () => {},
    container,
}, ref) => {
    return <>
        <Drawer
            title={null}
            placement="left"
            closable={false}
            onClose={() => {onClose()}}
            open={open}
            getContainer={() => container}
            destroyOnClose={true}
            className="drawer-shared drawer-theme"
            width={DRAWER_THEME_WIDTH}
            mask={false}
        >
            <div className="drawer-theme-container">
                <div className="drawer-title-container">
                    <div className="title-container">
                        <div className="title">
                            <img src={ThemeIcon} alt="" />
                            Theme
                        </div>
                        <div className="close-container flex items-center gap-[5px]" onClick={() => {onClose()}}>
                            <img src={ExitIcon} alt="" />
                            <div className="text-close">Close</div>
                        </div>
                    </div>
                </div>
                <div className="drawer-theme-content">
                    <div className="">
                        <ThemeCollapseContainer />
                    </div>
                </div>
            </div>
        </Drawer>

        {open && <PreviewLoadingScreen />}
    </>
})

export default DrawerTheme;