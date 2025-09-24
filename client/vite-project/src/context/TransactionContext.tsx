import React, {useEffect, useState} from "react";
import {ethers} from "ethers";
import {contractABI, contractAddress} from "../utils/constants";
import { IoAlarmOutline } from "react-icons/io5";
import { AiOutlineMuted } from "react-icons/ai";


type TransactionContextType = string|undefined|{}|any;

type TransactionProviderProps ={
    children: React.ReactNode;
}

export const TransactionContext = React.createContext("" as TransactionContextType);

// const { ethereum } = (typeof window !== "undefined") ? (window as any).ethereum : undefined;

const { ethereum } = window as any;

const getEthereumContract = async () => {
    // const provider = new ethers.providers.Web3Provider(ethereum);
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const transactionContract = 
    new ethers.Contract(contractAddress, contractABI, signer);

    console.log("provider, signer, transactionContract");

    console.log({
    provider,
    signer,
    transactionContract
    });

    return transactionContract;

}

export const TransactionProvider = ({children}: TransactionProviderProps) =>
{
    const[currentAccount, setCurrentAccount] = useState(``);
    const [formData, setFormData] = useState({ addressTo:``, amount: ``, keyword: ``, message:``});
    const [isLoading, setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem(`transactionCount`));


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) =>
    {
        setFormData((prevState) => ({...prevState, [name]: e.target.value}));
    }

    const checkIfWalletIsConnected = async () =>
    {
        try{
            if(!ethereum) return alert("Please install MetaMask.");

            const accounts = await ethereum.request({method: `eth_accounts`});

            if(accounts.length)
            {
                setCurrentAccount(accounts[0]);

                // getAllTransactions();
            }
            else
            {
                console.log("No accounts found");
            }

            console.log(accounts);
        } 
        catch(error)
        {
            console.log(error);
            throw new Error("No ethereum object.");
        }

        
    }

    const connectWallet = async () =>
    {
        try{
            if(!ethereum) return alert("Please install MetaMask.");

            const accounts = await ethereum.request({method: `eth_requestAccounts`});
        
            setCurrentAccount(accounts[0]);
        
        }
        catch(error)
        {
            console.log(error);

            throw new Error("No ethereum object.");
        }
    }

    const sendTransaction = async () =>
    {
        try
        {
            if(!ethereum) return alert("Please install MetaMask.");
        
            const { addressTo, amount, keyword, message } = formData;

            const transactionContract = await getEthereumContract();

            const parsedAmount:bigint = ethers.parseEther(amount);
            // get data from the form

            await ethereum.request({
                method: `eth_sendTransaction`,
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas:`0x5208`, // 21000 Gwei
                    value: `0x` + parsedAmount.toString(16),
                }]
            });

            const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword);
            setIsLoading(true);
            console.log(`Loading - ${transactionHash.hash}`);
            await transactionHash.wait();
            setIsLoading(false);
            console.log(`Success - ${transactionHash.hash}`);

            const transactionCount = await transactionContract.getTransactionCount();
            setTransactionCount(transactionCount.toNumber());


        }
        catch (error)
        {

        }
    }

    useEffect(() => {
        checkIfWalletIsConnected();
    },[]);
    return (
        <TransactionContext.Provider value ={{ connectWallet, currentAccount, formData, setFormData,handleChange,sendTransaction }}>
            {children}
        </TransactionContext.Provider>
    )
}
