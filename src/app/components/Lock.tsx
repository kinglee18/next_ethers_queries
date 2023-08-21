
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Lock } from '../../../contract/typechain-types/Lock';
import LockJson from '../../../contract/artifacts/contracts/Lock.sol/Lock.json'
import CountdownTimer from './CountDownTimer';

declare global {
  interface Window {
    ethereum?: any
  }
}

const LockComponent: React.FC = () => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [lockContract, setLockContract] = useState<Lock | null>(null);
  const [unlockTime, setUnlockTime] = useState<number | null>(null);
  const [balance, setBalance] = useState<ethers.BigNumberish | null>(null);
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const ethProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(ethProvider);
    }
  }, []);

  useEffect(() => {
    if (!provider) return;

    const initContract = async () => {
      const signer = await provider.getSigner();
      const contract = new ethers.Contract('0x0dcd1bf9a1b36ce34237eeafef220932846bcd82', LockJson.abi, signer)

      const unlockTime = await contract.unlockTime();
      const contractBalance = await provider.getBalance(await contract.getAddress());

      setAccount(await signer.getAddress());
      setLockContract(contract);
      contract.on('Withdrawal', (a,b)=> {
        console.log(a, b)
      })
      setUnlockTime(unlockTime);
      setBalance(contractBalance);
    };

    initContract();
  }, [provider]);

  const withdrawFunds = async () => {
    if (!lockContract || !account) return;

    try {
      const signer = await provider?.getSigner()
      if (signer && provider) {
        const tx = await lockContract.connect(signer).withdraw();
        await tx.wait();

        const updatedBalance = await provider.getBalance(lockContract.getAddress());
        setBalance(updatedBalance);
      }

    } catch (error) {
      console.error('Error withdrawing funds:', error);
    }
  };

  return (
    <div className="p-4 border-blue-500 border border-solid rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-center">Lock Contract</h2>
      {unlockTime !== null && (
        <p>Unlock time: {new Date(Number(unlockTime) * 1000).toString()}
          <CountdownTimer targetDate={new Date(Number(unlockTime) * 1000)} />
        </p>
      )}
      {balance !== null && (
        <p>Contract balance: {ethers.formatEther(balance)} ETH</p>
      )}
      <div className='flex-row flex justify-center'>
        {unlockTime !== null && balance !== null && account !== null && (
            <button
              className="mt-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              onClick={withdrawFunds}
            >
              Withdraw Funds
            </button>
          )}
      </div>

    </div>
  );
};

export default LockComponent;