import { InputNumber, Table } from "antd";
import "./styles.scss"
import TrashIcon from "../../assets/images/products/trash.svg"
import { useDispatch, useSelector } from "react-redux";
import { deleteProductInCart, getCart, setCart } from "../../redux/orderSlice";
import _ from "lodash"
import { getAssetsUrl } from "../../utils/util";
import { CURRENCY_LIST } from "../../utils/constants";

const CartTable = ({
    hasAction = true
}) => {
    const dispatch = useDispatch()
    const cart = useSelector(getCart)
    const columns = [
        {
            title: '',
            dataIndex: 'image',
            key: 'image',
            render: (text) => <div className="w-[80px]">
                <img src={getAssetsUrl(text)} alt="" className="rounded-[12px] w-[80px]" />
            </div>,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            align: 'center'
        },
        {
          title: 'Price',
          dataIndex: 'lastPrice',
          key: 'lastPrice',
          align: 'center',
          render: (text, record) => <span>{`${_.get(CURRENCY_LIST.find(el => el.code === record?.displayCurrency), ['symbol'], '')}${text}`}</span>,
        },
        {
            title: 'Quantity',
            key: 'quantity',
            dataIndex: 'quantity',
            align: 'center',
            render: (text, record) => <InputNumber value={record.quantity} min={1} className="w-[100px] shared-input-number" onChange={(e) => {changeItemQuantity(record.id, e)}}/>
        },
        {
            title: 'Total',
            key: 'total',
            align: 'center',
            render: (text, record) => <span>{`${_.get(CURRENCY_LIST.find(el => el.code === record?.displayCurrency), ['symbol'], '')}${record.quantity * record.lastPrice}`}</span>
        },
        {
          title: 'Actions',
          key: 'action',
          align: 'center',
          render: (text, record, index) => <>
            <div className="flex flex-col items-center gap-[7px]">
                <button className="btn-action">
                    <img src={TrashIcon} alt="" className="w-[24px]" onClick={() => {deleteItemInCart(record.id)}}/>
                </button>
            </div>
          </>,
        },
    ];
    const columnsNotAction = [
        {
            title: '',
            dataIndex: 'image',
            key: 'image',
            render: (text) => <div className="w-[80px]">
                <img src={getAssetsUrl(text)} alt="" className="rounded-[12px] w-[80px]" />
            </div>,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            align: 'center'
        },
        {
          title: 'Price',
          dataIndex: 'lastPrice',
          key: 'lastPrice',
          align: 'center',
          render: (text, record) => <span>{`${_.get(CURRENCY_LIST.find(el => el.code === record?.displayCurrency), ['symbol'], '')}${text}`}</span>,
        },
        {
            title: 'Quantity',
            key: 'quantity',
            dataIndex: 'quantity',
            align: 'center',
            render: (text) => <span>{`${text}`}</span>,
        },
        {
            title: 'Total',
            key: 'total',
            align: 'center',
            render: (text, record) => <span>{`${_.get(CURRENCY_LIST.find(el => el.code === record?.displayCurrency), ['symbol'], '')}${record.quantity * record.lastPrice}`}</span>
        }
    ];

    const deleteItemInCart = (id) => {
        dispatch(deleteProductInCart(id))
    }

    const changeItemQuantity = (id, quantity) => {
        dispatch(setCart([
            ..._.cloneDeep(cart).map(el => {
                if(el.id === id){
                    el.quantity = quantity
                }

                return el
            })
        ]))
    }

    return <>
        <Table 
            columns={hasAction ? columns : columnsNotAction} 
            dataSource={cart}
            pagination={false}
            title={null}
            locale={{
                emptyText: (
                    <div className="empty-container">
                        No data can be found.
                    </div>
                ),
            }}
            className="carts-table"
      />
    </>
}
export default CartTable;