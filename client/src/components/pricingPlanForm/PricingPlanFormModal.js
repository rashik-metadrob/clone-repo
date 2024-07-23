import { Checkbox, Col, Form, Input, InputNumber, Modal, Row, Select, Space, Spin, Switch } from 'antd';
import './styles.scss';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useReducer, useState } from 'react';
import * as sampleData from './pricePlan.json'
import { LoadingOutlined } from '@ant-design/icons';

const FIELD_FORM_TYPE = {
  NUMBER: 1,
  TEXT: 0,
  SWITCH: 2 
}

const defaultFields = [
  {
    key: 'name',
    displayText: 'Name',
  },
  {
    key: 'display',
    displayText: 'Display',
  },
  {
    key: 'monthPrice',
    displayText: 'Month price',
  },
  {
    key: 'yearPrice',
    displayText: 'Year price',
  },
  {
    key: 'description',
    displayText: 'Description',
  }
]

const PricingPlanFormModal = forwardRef(({
  visible = false,
  onSubmit = () => {},
  onClose = () => {},
  updateData = null,
}, ref) => {

  const [isShowModal, setIsShowModal] = useState(visible);
  const [featureFields, setFeatureFields] = useState([]);
  const [isShowLoading, setIsShowLoading] = useState(false);
  const [update, forceUpdate] = useReducer(x => {
    if(x === 100) {
      return 0;
    }
    return x + 1;
  }, 0);

  const [form] = Form.useForm();

  const onVisibleChange = useCallback((visible) => {
    if(visible !== isShowModal) {
      setIsShowModal(visible) 
    }
  }, [isShowModal])
  useEffect(() => {
    onVisibleChange(visible);
  }, [visible, onVisibleChange])

  const resetFormField = useCallback(() => {
    form.resetFields();

    if(updateData) {
      form.setFieldValue(defaultFields[0].key, updateData.name)
      form.setFieldValue(defaultFields[1].key, updateData.display)
      form.setFieldValue(defaultFields[2].key, updateData.pricing?.monthly)
      form.setFieldValue(defaultFields[3].key, updateData.pricing?.yearly)
      form.setFieldValue(defaultFields[4].key, updateData.description)

      const featureKeys = Object.keys(updateData.features);
      for(const key of featureKeys) {
        const value = updateData.features[key].value;
        const isShowValue = updateData.features[key].isShow;

        form.setFieldValue(key, value)
        form.setFieldValue(`isShow${key}`, isShowValue)
      }
    }

    setIsShowLoading(false);
    forceUpdate()
  }, [form, updateData])

  useEffect(() => {
    if(visible) {
      resetFormField()
    }
  }, [visible, resetFormField])

  function getDefaultValue(type) {
    switch(type) {
      case FIELD_FORM_TYPE.NUMBER: {
        return 0;
      }
      case FIELD_FORM_TYPE.SWITCH: {
        return false;
      }
      default: {
        return ''
      }
    }
  }

  function getDetailFormData() {

    const features = {};
    featureFields.map(item => {
      return {
        [item.key]: {
          description: '',
          displayText: item.displayText,
          value: (typeof form.getFieldValue(item.key) === "undefined") ? getDefaultValue(item.type) : form.getFieldValue(item.key),
          isShow: !!form.getFieldValue(`isShow${item.key}`)
        }
      }
    }).forEach(f => {
      Object.assign(features,f)
    })

    const data = {
      name: form.getFieldValue(defaultFields[0].key),
      display: form.getFieldValue(defaultFields[1].key),
      isRecommended: false,
      pricing: {
        monthly: form.getFieldValue(defaultFields[2].key),
        yearly: form.getFieldValue(defaultFields[3].key)
      },
      description: form.getFieldValue(defaultFields[4].key),
      features
    }

    return data;
  }

  async function onOk() {
    await form.validateFields();

    const data = getDetailFormData();

    if(onSubmit) {
      onSubmit(data)
    }

    setIsShowLoading(true)
  }

  function onCancel() {

    if(isShowLoading) return;

    if(onClose) {
      onClose()
    }

    setIsShowModal(false);
  }

  function getTypeOfValue(value) {
    switch(typeof value) {
      case 'number': {
        return FIELD_FORM_TYPE.NUMBER;
      }
      case 'boolean': {
        return FIELD_FORM_TYPE.SWITCH;
      }
      default: {
        return FIELD_FORM_TYPE.TEXT
      }
    }
  }

  const handleSampleData = useCallback(() => {
    const resultHandle = Object.entries(sampleData)
    .filter(([key]) => key !== 'default')
    .map(([key, item]) => {
      return {
        ...item,
        key,
        type: getTypeOfValue(item.value),
        isShow: false
      }
    }).sort((a, b) => a.type - b.type)

    setFeatureFields(resultHandle)

    const moreFields = resultHandle.map(item => {
      return {
        name: item.key,
        value: item.value,
      }
    })

    const isShowFields = resultHandle.map(item => {
      return {
        name: `isShow${item.key}`,
        value:  item.isShow,
      }
    })

    form.setFields(moreFields)
    form.setFields(isShowFields)

  }, [form])

  useEffect(() => {
    handleSampleData();
  }, [handleSampleData])

  useImperativeHandle(ref, () => ({
    closeLoading: () => {
      setIsShowLoading(false);
    },
  }));

  return <Modal
    title={
      <div className='modal-title'>
        Pricing plan
      </div>
    }
    centered
    okButtonProps={{
      className: "text-neutral-50 bg-blue-500",
    }}
    cancelButtonProps={{
      className: "cancel-btn-class"
    }}
    maskClosable={!isShowLoading}
    open={isShowModal}
    onOk={() => onOk()}
    onCancel={() => onCancel()}
    width={"80%"}
    className='modal-wrapper'
  >
    <Form form={form} name="validateOnly" layout="vertical" autoComplete="off" className='body-main'>
      <Row gutter={[20, 0]}>
        <Col lg={9} sm={24} xs={24} className='mb-[10px]'>
          <Form.Item className='form-custom' name={defaultFields[0].key} label={defaultFields[0].displayText} rules={[{ required: true, message: `${defaultFields[0].displayText} is required` }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col lg={9} sm={24} xs={24} className='mb-[10px]'>
          <Form.Item className='form-custom' name={defaultFields[1].key} label={defaultFields[1].displayText} initialValue={'none'} rules={[{ required: true, message: `${defaultFields[1].displayText} is required` }]}>
            <Select
              options={[
                { value: 'none', label: 'None' },
                { value: 'first', label: 'First pricing plan' },
                { value: 'second', label: 'Second pricing plan' },
                { value: 'third', label: 'Third pricing plan' },
              ]}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[20, 0]}>
        <Col lg={9} sm={24} xs={24} className='mb-[10px]'>
          <Form.Item className='form-custom' name={defaultFields[2].key} label={defaultFields[2].displayText} rules={[{ required: true, message: `${defaultFields[2].displayText} is required` }]}>
            <InputNumber />
          </Form.Item>
        </Col>
        <Col lg={9} sm={24} xs={24} className='mb-[10px]'>
          <Form.Item className='form-custom' name={defaultFields[3].key} label={defaultFields[3].displayText} rules={[{ required: true, message: `${defaultFields[3].displayText} is required` }]}>
            <InputNumber />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[20, 0]}>
        <Col lg={24} sm={24} xs={24} className='mb-[10px]'>
          <Form.Item className='form-custom' name={defaultFields[4].key} label={defaultFields[4].displayText} rules={[{ required: true, message: `${defaultFields[4].displayText} is required` }]}>
            <Input.TextArea rows={5} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[20, 0]}>
        <Col lg={24} sm={24} xs={24} className='mb-[10px]'>
          <div className='form-custom'>
            <label>Features</label>
          </div>
        </Col>
      </Row>
      <Row gutter={[20, 0]}>
        {
          featureFields.map(({ displayText, key, type }, idx) => {

            const defaulIsShowChecked = form.getFieldValue(`isShow${key}`)
            const defaulValue = form.getFieldValue(`${key}`)

            return <Col key={`${idx}_${update}`} lg={6} sm={12} xs={24} className='mb-[10px] flex'>
              <Form.Item className='checkbox-custom-form' name={`isShow${key}`} label="">
                <Checkbox defaultChecked={defaulIsShowChecked} onChange={(e) => {
                  form.setFieldValue(`isShow${key}`, e.target.checked)
                }} />
              </Form.Item>
              <Form.Item className='form-custom grow' name={key} label={displayText}>
                {
                  type === FIELD_FORM_TYPE.TEXT && <Input />
                }
                {
                  type === FIELD_FORM_TYPE.NUMBER && <InputNumber />
                }
                {
                  type === FIELD_FORM_TYPE.SWITCH && <Switch className='custom-theme__switch' defaultChecked={defaulValue} />
                }
              </Form.Item>
            </Col>
          })
        }
      </Row>
    </Form>
    {
      isShowLoading && <Space className='loading-space'> 
        <Spin indicator={
           <LoadingOutlined
           style={{
             fontSize: 44,
           }}
           spin
         />
        } />
      </Space> 
    }
  </Modal>
})

export default PricingPlanFormModal;