
import { Col, Layout, Row, notification } from "antd";
import "./styles.scss"

import LogoImage from "../../assets/images/project/logo.svg"
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getDecorative, getDecorativeEditorMaterials } from "../../redux/decorativeEditorSlice";
import { EDITOR_MATERIAL_KEYS, MATERIAL_VALUE_TYPES } from "../../utils/constants";
import { Color, NoColorSpace } from "three";
import _ from "lodash";
import { updateProduct } from "../../api/product.api";
import { isShopifyAdminLocation } from "../../utils/util";
import routesConstant from "../../routes/routesConstant";

const { Header } = Layout;
const HeaderDecorativeAdmin = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const {id: decorativeId} = useParams()
    const decorativeEditorMaterials = useSelector(getDecorativeEditorMaterials)
    const decorative = useSelector(getDecorative)

    const onSaveMaterial = () => {
        if(decorativeId){
            const decorativeMaterial = createSavedMaterials()
            
            let attributes = _.get(decorative, ['attributes'], {})
            attributes = {
                ...attributes,
                decorativeMaterial: decorativeMaterial
            }

            updateProduct(decorativeId, { attributes: attributes }).then(rs => {
                notification.success({
                    message: "Save success!"
                })
            }).catch(err => {
                notification.error({
                    message: "Save fail!"
                })
            })
        }
    }

    const createSavedMaterials = () => {
        let saveMaterials = {}
        let materialsKeys = Object.keys(decorativeEditorMaterials)
        if(materialsKeys && materialsKeys.length > 0){
            materialsKeys.forEach(el => {
                let atrKeys = Object.keys(decorativeEditorMaterials[el])
                saveMaterials[el] = {}
                atrKeys.filter(k => EDITOR_MATERIAL_KEYS.find(o => o.key === k)).forEach(atrr => {
                    let atrInfo = EDITOR_MATERIAL_KEYS.find(o => o.key === atrr)
                    if(atrInfo.valueType === MATERIAL_VALUE_TYPES.COLOR){
                        saveMaterials[el][atrr] = {
                            type: atrInfo.valueType,
                            value: new Color(decorativeEditorMaterials[el][atrr].r / 255, decorativeEditorMaterials[el][atrr].g / 255, decorativeEditorMaterials[el][atrr].b / 255).getHex(NoColorSpace)    
                        }
                    } else if(atrInfo.valueType === MATERIAL_VALUE_TYPES.TEXTURE){
                        saveMaterials[el][atrr] = {
                            type: atrInfo.valueType,
                            value: null    
                        }
                    } else {
                        saveMaterials[el][atrr] = {
                            type: atrInfo.valueType,
                            value: decorativeEditorMaterials[el][atrr]
                        }
                    }
                })
            })  
        }
        
        return saveMaterials
    }

    return <>
    <Header className="header-decorative-admin-container">
        <Row gutter={[0, 24]} className='items-center'>
            <Col lg={12} md={12} sm={24} xs={24}>
                <img src={LogoImage} alt="Logo" className="cursor-pointer max-h-[32px]" onClick={() => {
                    if(isShopifyAdminLocation(location)) {
                        navigate(routesConstant.shopifyAdmin.path)
                    } else {
                        navigate(routesConstant.admin.path)
                    }
                }}/>
            </Col>
            <Col lg={12} md={12} sm={24} xs={24} className="flex justify-end gap-[26px]">
                <button className="btn-save" onClick={() => {onSaveMaterial()}}>
                    Save changes
                </button>
            </Col>
        </Row>
    </Header>
    </>
}
export default HeaderDecorativeAdmin