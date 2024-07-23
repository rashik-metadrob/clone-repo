import "./styles.scss"

import MetamaskIcon from "../../assets/images/home/metamask.svg"
import AvatarImg from "../../assets/images/home/avatar.png"
import ArrowBottomIcon from "../../assets/images/home/arrow.svg"
import ThreeDotIcon from "../../assets/images/home/three-dot.svg"
import ETHIcon from "../../assets/images/home/eth.svg"

import { useDispatch, useSelector } from "react-redux"
import { getWeb3Account, setWeb3AccountAddress, setWeb3AccountBalance } from "../../redux/dashboardSlice"

import { hooks as metaMaskHooks, metaMask } from '../../connectors/meta-mask'
import { MetaMask } from "@web3-react/metamask";
import { useWeb3React } from '@web3-react/core'

import { Select, Tabs, notification } from "antd"
import { useEffect } from "react"

const WalletCard = () => {
    const dispatch = useDispatch()
    const { account, chainId, isActive, connector, provider } = useWeb3React();

    const web3Account = useSelector(getWeb3Account)
    const items = [
        {
          key: '1',
          label: `Assets`,
          children: ``,
        },
        {
          key: '2',
          label: `Activity`,
          children: ``,
        }
    ];

    const onChange = (key) => {
        console.log(key);
    };

    useEffect(() => {
        dispatch(setWeb3AccountAddress(account))
        if(account && provider){
            provider.getBalance(account).then(balance => {
                dispatch(setWeb3AccountBalance(balance.toNumber()))
            }).catch(err => {
            })
            
            provider.getAvatar(account).then(avatar => {
            }).catch(err => {
            })
        }
    },[account, chainId, provider])

    const handleConnectMetamask = async () => {
        if(isActive && !(connector instanceof MetaMask)){
          if (connector?.deactivate) {
            void connector.deactivate()
          } else {
            void connector.resetState()
          }
        }
        metaMask.activate().then(() => {
          notification.success({
            message: "Connect success!"
          })
        }).catch(err => {
        })
    }

    return <div  className="wallet-card">
    <span id="ethRef">
        <div className="wallet-card-header">
            <img src={MetamaskIcon} alt="" />
            <Select
                showSearch
                className="select-mainnet"
                optionFilterProp="children"
                filterOption={(input, option) =>
                    (option?.value ?? '').toLowerCase().includes(input.toLowerCase())
                }
                labelInValue={true}
                value={'Etherium Mainnet'}
                options={[
                    {
                        value: 'Etherium Mainnet',
                        label: <span className="mainnet-item">
                            <div className="mainnet-status">
                            </div>
                            Etherium Mainnet
                        </span>,
                    }
                ]}
                suffixIcon={<img src={ArrowBottomIcon} alt="" />}
            />
            <div className="avatar-container">
                <img src={AvatarImg} alt="" />
            </div>
        </div>
        <div className="wallet-card-account">
            <div className="account-info">
                {!web3Account.address && <div className="account-name">
                    No account
                </div>}
                <div className="account-address mt-[3px]">
                    <div className="address-container">
                        {web3Account.address}
                    </div>
                </div>
            </div>
            <img src={ThreeDotIcon} alt="" className="cursor-pointer"/>
        </div>
        <div  className="wallet-card-content">
            { web3Account.address &&
                <>
                    <div className="flex justify-center w-full">
                        <img src={ETHIcon} alt="" />
                    </div>
                    <div className="text-total-coin mt-[6px]">
                        {web3Account.balance} ETH
                    </div>
                    <div className="text-total-budget mt-[4px]">
                        $ {web3Account.balance}
                    </div>
                </>
            }
            { !web3Account.address && <div className="flex justify-center mt-[8px]">
                <button onClick={() => {handleConnectMetamask()}} className="btn-login-metamask">
                    <img src={MetamaskIcon} alt="" />
                    Metamask
                </button>
            </div>}
            <Tabs
                defaultActiveKey="1"
                className="wallet-tabs mt-[50px]"
                items={items}
                onChange={onChange}
            />
        </div>
        <div className="wallet-card-footer">

        </div>
</span>
    </div>
}
export default WalletCard;
