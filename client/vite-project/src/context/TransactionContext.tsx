import React, {useEffect, useState} from "react";
import {ethers} from "ethers";
import {contractABI, contractAddress} from "../utils/constants";


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

    console.log({
    provider,
    signer,
    transactionContract
    });

}

export const TransactionProvider = ({children}: TransactionProviderProps) =>
{
    const checkIfWalletIsConnected = async () =>
    {
        if(!ethereum) return alert("Please install MetaMask.");

        const accounts = await ethereum.request({method: `eth_accounts`});

        console.log(accounts);
    }

    useEffect(() => {
        checkIfWalletIsConnected();
    });
    return (
        <TransactionContext.Provider value ={{value : `test`}}>
            {children}
        </TransactionContext.Provider>
    )
}
