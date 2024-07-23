import { Modal, Spin, notification } from "antd"
import "./styles.scss"
import ModalExitIcon from "../../assets/images/project/modal-exit.svg"
import { useSelector } from "react-redux"
import { getUser, setUser } from "../../redux/appSlice"
import { useEffect, useRef, useState } from "react"
import _ from "lodash"
import { getAssetsUrl, getBase64 } from "../../utils/util"
import { uploadFile } from "../../api/upload.api"
import { userApi } from "../../api/user.api"
import { setStorageRefreshToken, setStorageToken, setStorageUserDetail } from "../../utils/storage"
import { useAppDispatch } from "../../redux"
import { DEFAULT_AVATAR, UPLOADS_FOLDER } from "../../utils/constants"

const ModalEditAvatar = ({
    open,
    onClose = () => {},
    onBack = () => {},
    onSuccess = () => {},
}) => {
    const dispatch = useAppDispatch()
    const user = useSelector(getUser)
    const [formData, setFormData] = useState({})
    const [loading, setLoading] = useState(false)
    const uploadRef = useRef()
    const [file, setFile] = useState()

    useEffect(() => {
        const newData = _.pick(user, 'avatar', 'name', 'socialAvatar')
        setFormData(newData)
    }, [user])

    const onChangeAvatar = () => {
        uploadRef.current.click()
    }

    const onChangeAvatarFile = async (e) => {
        if(e.target.files.length > 0){
            const previewUrl = await getBase64(e.target.files[0]);
            handleFormDataChange('avatar', previewUrl)

            setFile(e.target.files[0])
        }
    }

    const handleFormDataChange = (path, value) => {
        const clone = _.cloneDeep(formData)
        _.set(clone, path, value)
        setFormData(clone)
    }

    const onSave = async () => {
        if(!formData.name){
            notification.warning({
                message: "Full name can't be null!"
            })
            return
        }

        const bodyData = {
            ...formData,
            isCompleteEnterProfile: true
        }

        setLoading(true)
        if(file){
            const formImageData = new FormData();
            formImageData.append("file", file);
            const modelImageResult = await uploadFile(formImageData, 0, UPLOADS_FOLDER.AVATAR)
            if(modelImageResult.status && modelImageResult.status !== 200){
                notification.error({
                    message: modelImageResult.data.message
                })
                return
            }
            bodyData.avatar = modelImageResult.results
        }

        userApi.updateLoggedInUser(bodyData).then(data => {
            setStorageUserDetail(data.user)
            dispatch(setUser(data.user))
            setStorageToken(data.tokens.access.token)
            setStorageRefreshToken(data.tokens.refresh.token)
            notification.success({
                message: "Update successfully!"
            })
            setLoading(false)
            onSuccess()
        }).catch(err => {
            notification.error({
                message: _.get(err, ['response', 'data', 'message'], `Update fail!`)
            })
            setLoading(false)
        })
    }

    return <>
        <Modal
            open={open}
            width={450}
            footer={null}
            closeIcon={<img src={ModalExitIcon} alt="" />}
            destroyOnClose={true}
            closable={true}
            centered
            className="modal-edit-avatar"
            onCancel={() => {onClose()}}
        >
            <div className="profile-top-content">
                <div className="flex justify-center avatar-container">
                    <img 
                        src={formData?.avatar ? getAssetsUrl(formData.avatar) : formData?.socialAvatar ? formData.socialAvatar : getAssetsUrl(DEFAULT_AVATAR)} 
                        alt="" 
                        className="w-[150px] h-[150px] rounded-[50%]"
                    />
                    <div className="text-change w-[150px] h-[150px] rounded-[50%]" onClick={() => {onChangeAvatar()}}>
                        Change
                    </div>
                    <input type="file" accept="image/*" ref={uploadRef} hidden onChange={(e) => {onChangeAvatarFile(e)}}/>
                </div>
                <input className="content-input mt-[24px] w-[100%]" value={formData?.name} onChange={(e) => {handleFormDataChange(['name'], e.target.value)}}/>
            </div>
            <div className="flex justify-center">
                <Spin spinning={loading}>
                    <button className="btn-update" onClick={() => {onSave()}}>
                        Save
                    </button>
                </Spin>
            </div>
        </Modal>
    </>
}

export default ModalEditAvatar