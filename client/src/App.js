import React, { useState, useEffect, createContext } from 'react'
import { ethers } from "ethers";
import { useSelector, useDispatch } from "react-redux";
import ChakraABI from "./Contract/chakraABI.json";
import Header from './Components/Header/Header';
import Dashboard from "./Components/Dashboard/Dashboard";
import Loading from "./Components/Loading";
import Error404 from "./Components/Error404";
import getUserData from "./Functions/getUserData.js";
import { Switch, Route } from "react-router-dom"

const requiredInfo = createContext();

const App = () => {

  const [contractETH, setContractETH] = useState(null);
  const dispatch = useDispatch();
  let isLoading = useSelector(state => state.isLoading.data);

  const reloadPage = () => {
    window.location.reload();
  }

  if (window.ethereum) { // This Statement Will Caught When Account Will Changed In Metamask.
    window.ethereum.on('accountsChanged', () => reloadPage());
  }

  useEffect(() => {
    const init = async () => {
      if ((window.ethereum !== undefined)) { // This Statement Checks That Whether User Have Metamask Or Not,  
        dispatch({ type: "setIsMetamask", payload: true });
        const provider = new ethers.providers.Web3Provider(
          window.ethereum
        );
        await provider.send("eth_requestAccounts", []); // It Will Send Request For Connecting To Metamask.
        const signer = provider.getSigner();
        const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
        let contract = new ethers.Contract(contractAddress, ChakraABI, signer);
        setContractETH(contract);
        try {
          dispatch({ type: "setMainUserData", payload: await getUserData(await signer.getAddress(), provider) });
          dispatch({ type: "setIsLoading", payload: false })
        } catch (error) {
          console.log(error);
        }
      } else {
        dispatch({ type: "setIsLoading", payload: false })
        dispatch({ type: "setIsMetamask", payload: false })
        let provider = ethers.getDefaultProvider("rinkeby");
        // let provider = new InfuraProvider("ropsten");
        let wallet = new ethers.Wallet(process.env.REACT_APP_WALLET_KEY);
        let signer = wallet.connect(provider)
        const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
        let contract = new ethers.Contract(contractAddress, ChakraABI, signer);
        setContractETH(contract)
      }
    }
    init();
  }, [])

  return (
    <>
      <requiredInfo.Provider value={{
        contractETH: contractETH
      }}>
        <Header />
        <Switch>
          <Route exact path='/:chakraId?'>
            <Dashboard />
          </Route>
          <Route>
            <Error404 />
          </Route>
        </Switch>
      </requiredInfo.Provider>
      <div className="subBackground"></div>
      {
        isLoading === true ? <Loading /> : <></>
      }
    </>
  )
}

export default App
export { requiredInfo };
