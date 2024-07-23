import "./styles.scss";
import { Col, Form, Input, Modal, Row, notification } from "antd";
import SelectAddress from "../selectAddress/SelectAddress";
import ModalExitIcon from "../../assets/images/project/modal-exit.svg";
import addressApi from "../../api/address.api";
import { useEffect } from "react";

const ModalAddAddress = ({
  open,
  type,
  onClose,
  onSuccess,
  isEditMode,
  addressId
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if(open){
      form.resetFields()
      if(isEditMode && addressId){
        addressApi.getAddressById(addressId).then(rs => {
          form.setFieldsValue(rs)
        })
      }
    }
  }, [form, open, isEditMode, addressId])

  const onSave = () => {
    form.validateFields().then(rs => {
      if(!isEditMode){
        let data = {
          ...rs,
          type: type
        }
        addressApi.createAddress(data).then(rs => {
          notification.success({
            message: "Add address success!"
          })
          onSuccess()
        })
      } else {
        let data = {
          ...rs
        }
        addressApi.updateAddress(addressId, data).then(rs => {
          notification.success({
            message: "Update address success!"
          })
          onSuccess()
        })
      }
    }).catch(err => {
      notification.error({
        message: "Please check invalid fields!"
      })
    })
  }

  return (
    <>
      <Modal
        open={open}
        width={700}
        className="modal-add-address"
        footer={null}
        centered
        closeIcon={<img src={ModalExitIcon} alt="" />}
        closable={true}
        destroyOnClose={true}
        onCancel={() => {onClose()}}
        zIndex={10000}
      >
        <div className="add-address-modal-content">
          <div className="text-title">
            {isEditMode ? 'Edit address' : 'Add address'}
          </div>
          <Form form={form} className="mt-[24px]" name="trigger" layout="vertical" autoComplete="off">
            <Form.Item
              label="Alias"
              name="alias"
              validateTrigger="onBlur"
              extra={
                <div className="form-description">
                  E.g.: Work, Home,...
                </div>
              }
              rules={[
                {
                  required: true,
                  message: "Alias is required.",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Row gutter={[24, 24]}>
              <Col lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  label="Contact name"
                  name="contactName"
                  validateTrigger="onBlur"
                  rules={[
                    {
                      required: true,
                      message: "Contact name is required.",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  hasFeedback
                  label="Contact phone"
                  name="contactPhone"
                  validateTrigger="onBlur"
                  rules={[
                    {
                      required: true,
                      message: "Contact phone is required.",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[24, 24]}>
              <Col lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  hasFeedback
                  label="Contact email"
                  name="contactEmail"
                  validateTrigger="onBlur"
                  rules={[
                    {
                      required: true,
                      message: "Contact email is required.",
                    }
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  label="Company name"
                  name="companyMame"
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              hasFeedback
              label="Address line 1"
              name="line1"
              validateTrigger="onBlur"
              rules={[
                {
                  required: true,
                  message: "Address line 1 is required.",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              hasFeedback
              label="Address line 2"
              name="line2"
              rules={[]}
            >
              <Input />
            </Form.Item>
            <Row gutter={[24, 0]}>
              <Col lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  hasFeedback
                  label="State"
                  name="state"
                  validateTrigger="onBlur"
                  rules={[
                    {
                      required: true,
                      message: "State is required.",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  hasFeedback
                  label="City"
                  name="city"
                  validateTrigger="onBlur"
                  rules={[
                    {
                      required: true,
                      message: "City is required.",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  hasFeedback
                  label="Postal code"
                  name="postalCode"
                  validateTrigger="onBlur"
                  rules={[
                    {
                      required: true,
                      message: "Postal code is required.",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  hasFeedback
                  label="Country code"
                  name="countryAlpha2"
                  validateTrigger="onBlur"
                  extra={
                    <div className="form-description">
                      E.g.: US, UK, IN,...
                    </div>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Country code is required.",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            {/* <Row className="mb-[24px]">
                <Col span={24}>
                    <div className="label-title mb-[8px]">
                        Select address
                    </div>
                    <SelectAddress />
                </Col>
            </Row> */}
          </Form>
          <div className="mt-[24px] flex justify-center">
            <button className="btn-save" onClick={() => {onSave()}}>
              Save
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
export default ModalAddAddress;
