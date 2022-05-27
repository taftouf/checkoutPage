import React, { useState } from "react";
import { ethers } from "ethers";
import { FaWallet } from "react-icons/fa";
import {GiConfirmed} from "react-icons/gi"
import { IconContext } from "react-icons/lib";
import {HiOutlineExternalLink} from "react-icons/hi";

const ModalConnect =(props)=>{
    const [showModalConnect, setShowModalConnect] = useState(false);
    const [showModalPay, setShowModalPay] = useState(false);
    const [showModalSuccess, setShowModalSuccess] = useState(false);
    const [pending, setPending] = useState(false);
    const [showModalFailed, setShowModalFailed] = useState(false);
    const [account, setAccount] = useState('');
    const [hash, setHash] = useState('');
    
    // const USDTOCrypto = async(_amount) => {
    //   console.log("test");
    // }

    const Metamaskconnect=async()=>{
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            setAccount(accounts[0]);
            setShowModalConnect(false);
        } catch (error) {
            console.log(error);
        }
    }

    const PayWithETH = async (_amount)=>{
        setPending(true);
        setHash('');
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            let abi = ["function PayWithETH(address _to)external payable"]
            let contract = new ethers.Contract(process.env.REACT_APP_CONTRACT_ADDRESS, abi, signer);
            let overrides = {
                value: ethers.utils.parseUnits(_amount,"ether"),
            };
            let tx = await contract.PayWithETH(process.env.REACT_APP_TO, overrides);
            setHash(tx.hash);
            let receipt = await tx.wait();
            console.log(receipt);
        } catch (error) {
            console.log(error);
            setPending(false);
            setShowModalPay(false);
            setShowModalFailed(true);
        }
    }

    const PayWithToken = async(_tokenIn, _amount)=>{
        setHash('');
        setPending(true);
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            let abi1 = ["function approve(address _spender, uint256 _value) public returns (bool success)"]
            let contract_ERC20 = new ethers.Contract(_tokenIn, abi1, signer);
            let tx = await contract_ERC20.approve(process.env.REACT_APP_CONTRACT_ADDRESS, _amount);
            let receipt = await tx.wait();
            let overrides = {
                gasLimit: 750000,
            };
            let abi2 = ["function SwapTokenForETH(uint tokenAmount, address token, address to) external"];
            let contract = new ethers.Contract(process.env.REACT_APP_CONTRACT_ADDRESS,abi2,signer);
            tx = await contract.SwapTokenForETH(_amount,_tokenIn,process.env.REACT_APP_TO,overrides);
            setHash(tx.hash);
            receipt = await tx.wait();
            if(receipt.status === 1){
                setShowModalPay(false);
                setShowModalSuccess(true);
            }
            
        } catch (error) {
            setPending(false);
            setShowModalPay(false);
            setShowModalFailed(true);
        }
    }
  return (
    <>
    {
    window.ethereum? 
        (account.length>0?
            (
                <button onClick={()=>{setShowModalPay(true)}} className="border border-transparent hover:border-gray-300 bg-gray-900 dark:bg-white dark:hover:bg-gray-900 dark:hover:border-gray-900 dark:text-gray-900 dark:hover:text-white hover:bg-white text-white hover:text-gray-900 flex flex-row justify-center items-center space-x-2 py-4 rounded w-full">
                    <div>
                        <FaWallet />
                    </div>
                    <div>
                        <p className="text-base leading-4">
                            Pay
                        </p>
                    </div>
                        </button>
            )
            :
            (
            <button onClick={() => setShowModalConnect(true)} className="border border-transparent hover:border-gray-300 bg-gray-900 dark:bg-white dark:hover:bg-gray-900 dark:hover:border-gray-900 dark:text-gray-900 dark:hover:text-white hover:bg-white text-white hover:text-gray-900 flex flex-row justify-center items-center space-x-2 py-4 rounded w-full">
                <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                <div>
                    <p className="text-base leading-4">
                        Connect Wallet
                    </p>
                </div>
            </button>
            )
        
        ):
            (
            <a className="border border-transparent hover:border-gray-300 bg-gray-900 dark:bg-white dark:hover:bg-gray-900 dark:hover:border-gray-900 dark:text-gray-900 dark:hover:text-white hover:bg-white text-white hover:text-gray-900 flex flex-row justify-center items-center space-x-2 py-4 rounded w-full" target="_blank" rel="noreferrer" href={`https://metamask.io/download.html`}>
                <div>
                    <FaWallet />
                </div>
                <div>
                    <p className="text-base leading-4">
                        Install Metamask
                    </p>
                </div>
            </a>
            )
    }
      {showModalConnect && (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative p-4 w-full max-w-md h-full md:h-auto">
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <button onClick={() => setShowModalConnect(false)} className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>  
                </button>
                <div className="py-4 px-6 rounded-t border-b dark:border-gray-600">
                    <h3 className="text-base font-semibold text-gray-900 lg:text-xl dark:text-white">
                        Connect wallet
                    </h3>
                </div>
                <div className="p-6">
                    <p className="text-sm font-normal text-gray-500 dark:text-gray-400">Connect with one of our available wallet providers or create a new one.</p>
                    <ul className="my-4 space-y-3">
                        <li>
                            <div onClick={()=>{Metamaskconnect()}} className="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                                <span className="flex-1 ml-3 whitespace-nowrap">MetaMask</span>
                                <span className="inline-flex items-center justify-center px-2 py-0.5 ml-3 text-xs font-medium text-gray-500 bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-400">Popular</span>
                            </div>
                        </li>
                        <li>
                            <div onClick={()=>{console.log("HAMZA")}} className="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                                <span className="flex-1 ml-3 whitespace-nowrap">WalletConnect</span>
                            </div>
                        </li>
                    </ul>
                    <div>
                        <div className="inline-flex items-center text-xs font-normal text-gray-500 hover:underline dark:text-gray-400">
                            <svg className="mr-2 w-3 h-3" aria-hidden="true" focusable="false" data-prefix="far" data-icon="question-circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 448c-110.532 0-200-89.431-200-200 0-110.495 89.472-200 200-200 110.491 0 200 89.471 200 200 0 110.53-89.431 200-200 200zm107.244-255.2c0 67.052-72.421 68.084-72.421 92.863V300c0 6.627-5.373 12-12 12h-45.647c-6.627 0-12-5.373-12-12v-8.659c0-35.745 27.1-50.034 47.579-61.516 17.561-9.845 28.324-16.541 28.324-29.579 0-17.246-21.999-28.693-39.784-28.693-23.189 0-33.894 10.977-48.942 29.969-4.057 5.12-11.46 6.071-16.666 2.124l-27.824-21.098c-5.107-3.872-6.251-11.066-2.644-16.363C184.846 131.491 214.94 112 261.794 112c49.071 0 101.45 38.304 101.45 88.8zM298 368c0 23.159-18.841 42-42 42s-42-18.841-42-42 18.841-42 42-42 42 18.841 42 42z"></path></svg>
                            Why do I need to connect with my wallet?</div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) }

        {showModalPay && (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative p-4 w-full max-w-md h-full md:h-auto">
                    {!pending ?
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <button onClick={() => setShowModalPay(false)} className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>  
                        </button>
                        <div className="py-4 px-6 rounded-t border-b dark:border-gray-600">
                            <h3 className="text-base font-semibold text-gray-900 lg:text-xl dark:text-white">
                                Payment
                            </h3>
                        </div>
                        <div className="p-6">
                        <p className="text-sm font-normal text-gray-500 dark:text-gray-400">Don't miss to disconnect from your wallet afterpay</p>
                        <ul className="my-4 space-y-3">
                            <li>
                                <div onClick={()=>{PayWithETH(props.eth)}} className="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                                    <span className="flex-1 ml-3 whitespace-nowrap">ETH</span>
                                    <span className="inline-flex items-center justify-center px-2 py-0.5 ml-3 text-xs font-medium text-gray-500 bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-400">0.01</span>
                                </div>
                            </li>
                            <li>
                                <div onClick={()=>{PayWithToken("0x3B00Ef435fA4FcFF5C209a37d1f3dcff37c705aD",props.usdt)}} className="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                                    <span className="flex-1 ml-3 whitespace-nowrap">USDT</span>
                                    <span className="inline-flex items-center justify-center px-2 py-0.5 ml-3 text-xs font-medium text-gray-500 bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-400">0.1</span>
                                </div>
                            </li>
                            <li>
                                <div onClick={()=>{PayWithToken("0x01BE23585060835E02B77ef475b0Cc51aA1e0709",props.link)}} className="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                                    <span className="flex-1 ml-3 whitespace-nowrap">Link</span>
                                    <span className="inline-flex items-center justify-center px-2 py-0.5 ml-3 text-xs font-medium text-gray-500 bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-400">10</span>
                                </div>
                            </li>
                            <li>
                                <div onClick={()=>{PayWithToken("0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", props.uni)}} className="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white">
                                    <span className="flex-1 ml-3 whitespace-nowrap">UNI</span>
                                    <span className="inline-flex items-center justify-center px-2 py-0.5 ml-3 text-xs font-medium text-gray-500 bg-gray-200 rounded dark:bg-gray-700 dark:text-gray-400">0.001</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                    :
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        
                        <div className="py-4 px-6 rounded-t border-b dark:border-gray-600">
                            <h3 className="text-base font-semibold text-gray-900 lg:text-base dark:text-white">
                                Please wait your payment is being processed
                            </h3>
                        </div>
                        <div className="p-6"></div>
                        <div className="text-center">
                            <svg role="status" className="inline w-10 h-10 mr-10 mb-20 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                            </svg>
                        </div>
                    </div>   
                    }
            </div>
          </div>
        </>
      ) }

      {showModalSuccess &&(
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative p-4 w-full max-w-md h-full md:h-auto">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <div className="p-6 text-center">
                    <IconContext.Provider
                        value={{ color: 'green', size: '50px' }}
                        >
                        <div className="justify-center items-center flex mb-5">
                            <GiConfirmed />
                        </div>
                    </IconContext.Provider>
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400"> Your payment has been processed successfully </h3>
                        <button onClick={()=> setShowModalSuccess(false) } className="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                            Ok
                        </button>
                    </div>
                </div>
            </div>
        </div>
        )
      }

        {showModalFailed &&(
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative p-4 w-full max-w-md h-full md:h-auto">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <div className="p-6 text-center">
                    <IconContext.Provider
                        value={{ color: 'red', size: '50px' }}
                        >
                        <div className="justify-center items-center flex mb-5">
                            <svg className="mx-auto mb-2 w-14 h-14 text-gray-400 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                    </IconContext.Provider>
                    <button onClick={() => setShowModalFailed(false)} className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>  
                    </button>
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400"> Transaction Failed </h3>
                        {hash.length > 0 && 
                            (
                                <a href={"https://rinkeby.etherscan.io/tx/"+ hash} target="_blank" rel="noopener noreferrer" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                                    <span className="mr-2">Etherscan</span>
                                    <HiOutlineExternalLink />
                                </a>  
                            )
                        }
                        
                    </div>
                </div>
            </div>
        </div>
        )
      }
    </>
  );
}

export default ModalConnect;