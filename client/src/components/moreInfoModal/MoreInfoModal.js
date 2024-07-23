import _ from 'lodash';
import CloseModalIcon from '../../assets/icons/CloseModalIcon';
import ReviewStarIcon from '../../assets/icons/ReviewStarIcon';
import VirtualIcon from '../../assets/icons/VirtualIcon';
import './styles.scss'
import { Col, Modal, Row, Switch } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react';
import ArrowLeftBack from '../../assets/icons/ArrowLeftBack';
import Icon3D from '../../assets/icons/Icon3D';
import Product3DInfoView from '../product3DInfoView/Product3DInfoView';
import { getAssetsUrl, htmlDecode, is3DFile } from '../../utils/util';
import { CART_TYPES, CURRENCY_LIST, MODAL_INFO_TABS } from '../../utils/constants';
import global from '../../redux/global';

function MoreInfoModal({
  open,
  onClose = () => {},
  productDetail,
  onAddToCart = () => {}
}) {
  const [isAutoRotate, setIsAutoRotate] = useState(false)
  const [firstLoad, setFirstLoad] = useState(true)
  const [leftBackgroundSelected, setLeftBackgroundSelected] = useState("3D")
  const [realWidth, setRealWidth] = useState(0)
  const [xShow, setXShow] = useState({
    min: 0,
    max: 0
  })

  const [addingNumThresshold, setAddingNumThresshold] = useState({
    min: 0,
    max: 0
  })

  const [addingNum, setAddingNum] = useState(0)
  const [isHideCarouselBtn, setIsHideCarouselBtn] = useState(false)
  const [activeTab, setActiveTab] = useState(MODAL_INFO_TABS.OVERVIEW)

  const itemWidth = 79;

  const galleryItems = useMemo(() => {
    let list = [
      {
        image: "3D",
        icon: <Icon3D />,
        isDefault: true
      }
    ]

    if(productDetail?.gallery && productDetail?.gallery.length > 0){
      list = [...list, ..._.cloneDeep(_.filter(productDetail.gallery, gal => _.get(gal, ['id'], '') !== _.get(productDetail, ['selectedGalleryId'], '')))]
    }

    return list
  }, [productDetail])

  const handleCarousel = useCallback(() => {
    setTimeout(() => {
      const parent = document.getElementById('carouselParentId');
      if(parent && galleryItems.length > 0) {
        const w = parent.clientWidth;
        const noOfItem = Math.round(w / (itemWidth + 10));
        const realItemWidth = w / noOfItem;

        setAddingNum(0)
        setRealWidth(realItemWidth);
        setXShow({
          min: 0,
          max: w
        })
        setAddingNumThresshold({
          min: - (galleryItems.length - noOfItem),
          max: 0
        })

        if(galleryItems.length * realItemWidth < w) {
          setIsHideCarouselBtn(true)
        }

      }
    }, 200);
  }, [productDetail])

  useEffect(() => {
    if(!open) {
      setFirstLoad(true)
      setAddingNum(0)
      setIsHideCarouselBtn(false)
      setLeftBackgroundSelected("3D")
    }
  }, [open])

  return <Modal
      title={null}
      open={open}
      centered
      footer={null}
      closable={false}
      onCancel={onClose}
      className='more-info-modal__container'
      destroyOnClose
      width={1000}
    >
    <Row gutter={[0, 0]} className='body-container'>
      <Col xs={24} sm={24} md={9} lg={9} className='left-side h-[100%] min-h-[500px]'>
        {
          leftBackgroundSelected && leftBackgroundSelected !== "3D" && !is3DFile(leftBackgroundSelected) && <div className='img-showall'>
            <img src={getAssetsUrl(leftBackgroundSelected)} alt='bg'/>
          </div>
        }
        {
          (leftBackgroundSelected === "3D" || is3DFile(leftBackgroundSelected)) && <>
            <div className='auto-rotate !z-[3]'>
              <span className='text-[#000]'>Auto-Rotate</span>
              <Switch size="default" checked={isAutoRotate} onChange={(value) => {setIsAutoRotate(value)}} />
            </div>
            <div className='img-showall'>
              <Product3DInfoView product={productDetail} selectedBackground={leftBackgroundSelected} isAutoRotate={isAutoRotate}/>
            </div>
          </>
        }
        <div ref={() => {
            if (firstLoad) {
              setFirstLoad(false)
              handleCarousel()
            }
          }}
          id='carouselParentId' className='bottom-carousel' style={{ height: itemWidth }}
        >
            {
              galleryItems.map(({ image: imageName, object: objectName, isDefault, icon }, idx) => {
                return <div key={idx}
                  className='item-carousel'
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: realWidth * idx + addingNum * realWidth,
                    width: realWidth,
                    height: itemWidth,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    visibility: (realWidth * idx + addingNum * realWidth < xShow.min || realWidth * idx + addingNum * realWidth + realWidth > xShow.max) ? 'hidden' : 'visible'
                  }}>
                  <div
                    onClick={() => {
                      if(imageName){
                        setLeftBackgroundSelected(imageName)
                      } else if(objectName){
                        setLeftBackgroundSelected(objectName)
                      }
                    }}
                    className={`image-detail-item ${(imageName ? leftBackgroundSelected === imageName : leftBackgroundSelected === objectName)  ? 'selected' : ''}`}
                    style={{
                      height: '100%',
                      width: itemWidth,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                    {(!isDefault && imageName) && <img src={getAssetsUrl(imageName)} alt="" className="object-fit" />}
                    {(isDefault || objectName) && <Icon3D />}
                  </div>
                </div>
              })
            }
            {
              addingNum !== addingNumThresshold.max && !isHideCarouselBtn && <div className='left-back-btn' onClick={() => {
                if (addingNum + 1 > addingNumThresshold.max) {
                  return
                }
                setAddingNum(addingNum + 1)
              }}>
                <ArrowLeftBack />
              </div>
            }

            {
              addingNum !== addingNumThresshold.min && !isHideCarouselBtn && <div className='right-next-btn' onClick={() => {
                if (addingNum - 1 < addingNumThresshold.min) {
                  return
                }
                setAddingNum(addingNum - 1)
              }}>
                <ArrowLeftBack />
              </div>
            }
          </div>
      </Col>
      <Col xs={24} sm={24} md={15} lg={15} className='right-side'>
          <div className='header__right-side'>
            <div className='grow'></div>
            <div className='close-area' onClick={onClose}>
              <div className='close-btn__right-side'>
                <CloseModalIcon/> <span style={{ marginLeft: 8 }}>Close</span> 
              </div>
            </div>
          </div>
          <div className='body__right-side'>
            <div className='body-title'>
              {_.get(productDetail, "name", "")}
            </div>
            <div className='overview'>
              <div className={`tab-name ${activeTab === MODAL_INFO_TABS.OVERVIEW ? 'active' : ''}`} onClick={() => {setActiveTab(MODAL_INFO_TABS.OVERVIEW)}}>
                <span>Overview</span>
              </div>
              {_.get(productDetail, "specification", "") && <div className={`tab-name ${activeTab === MODAL_INFO_TABS.SPECIFICATION ? 'active' : ''}`}  onClick={() => {setActiveTab(MODAL_INFO_TABS.SPECIFICATION)}}>Specification</div>}
            </div>
            <div className='details-item'>
              <div className='scroll__details-item'>
                {activeTab === MODAL_INFO_TABS.OVERVIEW && <div className='desc' dangerouslySetInnerHTML={{__html: htmlDecode(_.get(productDetail, "description", ""))}}>
                </div>}
                {activeTab === MODAL_INFO_TABS.SPECIFICATION && <div className='desc' dangerouslySetInnerHTML={{__html: htmlDecode(_.get(productDetail, "specification", ""))}}>
                </div>}
              </div>
            </div>
          </div>
          <div className='footer__right-side'>
            <div className='divide-line'></div>
            <div className='footer-details'>
              <div className='price-container'>
                <div className='large-price'>
                  {_.get(CURRENCY_LIST.find(el => el.code === productDetail?.displayCurrency), ['symbol'], CURRENCY_LIST[0].symbol)}{_.get(productDetail, "lastPrice", 0).toFixed(2)}
                </div>
                {_.get(productDetail, "lastPrice", 0) !== _.get(productDetail, "price", 0) && 
                <div className='small-price'>
                  {_.get(CURRENCY_LIST.find(el => el.code === productDetail?.displayCurrency), ['symbol'], CURRENCY_LIST[0].symbol)}{_.get(productDetail, "price", 0).toFixed(2)}
                <div className='x-line'></div>
                </div>}
              </div>
              <div className='buttons-container'>
                {!global.IS_DROB_A && _.get(productDetail, ['cartType'], CART_TYPES.METADROB_CART) !== CART_TYPES.WEB_LINK && <div className='add-cart__btn' onClick={() => {
                  onAddToCart(productDetail)
                  onClose()
                }}>Add to cart</div>}
                <div 
                  className='buy-now__btn'
                  onClick={() => {
                    onAddToCart(productDetail, true)
                    onClose()
                  }}
                >
                  Buy Now
                </div>
              </div>
            </div>
          </div>
      </Col>
    </Row>
  </Modal>
}

export default MoreInfoModal;
