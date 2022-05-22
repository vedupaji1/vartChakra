import React, { useEffect, useContext } from 'react';
import { requiredInfo } from "../../App";
import { FiMoreVertical } from "react-icons/fi";
import { HiBadgeCheck } from "react-icons/hi";
import { useSelector, useDispatch } from 'react-redux';
import { ethers } from 'ethers';
import { useHistory, useParams } from 'react-router-dom';
import ChakraDataShower from './ChakraDataShower';

const Dashboard = () => {

    const contextData = useContext(requiredInfo);
    const contractETH = contextData.contractETH;
    let operationsData = useSelector(state => state.operationsData.data);
    let isActivitiesShower = useSelector(state => state.isActivitiesShower.data);
    let mainUserData = useSelector(state => state.mainUserData.data);
    let isMetamask = useSelector(state => state.isMetamask.data);
    let chakraIdData = useSelector(state => state.chakraId.data);
    let dispatch = useDispatch();
    let history = useHistory()
    useEffect(() => {
        const init = async () => {
            if (chakraIdData === null || chakraIdData !== chakraId) {
                dispatch({ type: "setChakraId", payload: chakraId });
            }
        }
        init();
    })

    let { chakraId } = useParams();

    const hideGuidelines = () => {
        if (document.getElementsByClassName("responseShower")[0] !== undefined) {
            if (document.getElementsByClassName("responseShower")[0].classList.contains("showWarning") === true) {
                document.getElementsByClassName("responseShower")[0].classList.remove("showWarning")
            } else if (document.getElementsByClassName("responseShower")[0].classList.contains("showDone") === true) {
                document.getElementsByClassName("responseShower")[0].classList.remove("showDone")
            }
            document.getElementsByClassName("responseText")[0].style.opacity = "0"
        }
    }

    const changeOperation = (operationIndex) => {
        dispatch({ type: "setIsActivitiesShower", payload: false });
        document.getElementsByClassName("joinOrCreateBTN")[0].classList.add("currentOptionShower");
        document.getElementsByClassName("activitiesBTN")[0].classList.remove("currentOptionShower");
        hideGuidelines();
        let tempOperationData = JSON.parse(JSON.stringify(operationsData));
        tempOperationData.selectedOperation = operationsData.unSelectedOperations[operationIndex];
        tempOperationData.unSelectedOperations[operationIndex] = operationsData.selectedOperation;
        dispatch({ type: "setOperationsData", payload: tempOperationData })
    }

    const showResponse = (message, isValid) => {
        let responseShower = document.getElementsByClassName("responseShower")[0];
        document.getElementsByClassName("responseText")[0].style.opacity = "1";
        document.getElementsByClassName("responseText")[0].innerText = message;
        if (isValid === true) {
            if (responseShower.classList.contains("showWarning") === true) {
                responseShower.classList.replace("showWarning", "showDone");
            } else if (responseShower.classList.contains("showDone") !== true) {
                responseShower.classList.add("showDone")
            }
        }
        else {
            if (responseShower.classList.contains("showDone") === true) {
                responseShower.classList.replace("showDone", "showWarning");
            } else if (responseShower.classList.contains("showWarning") !== true) {
                responseShower.classList.add("showWarning")
            }
        }
    }

    const selectIsTrulyRandom = () => {
        if (document.getElementsByClassName("isTrulyRandomInp")[0].clicked === true) {
            document.getElementsByClassName("showCheckIcon")[0].style.display = "none";
            document.getElementsByClassName("isTrulyRandomInp")[0].clicked = false;
        } else {
            document.getElementsByClassName("showCheckIcon")[0].style.display = "block";
            document.getElementsByClassName("isTrulyRandomInp")[0].clicked = true;
        }
    }

    const performOperation = async (operationNum) => {
        if (contractETH !== null && isMetamask !== false) {
            let chakraId = document.getElementById("chakraIdInp").value.trim();
            if (chakraId !== "") {
                if (operationNum === 0) {
                    let baseAmount = document.getElementById("amountInp").value.trim();
                    let creatorShares = document.getElementById("creatorShare").value.trim()
                    if (baseAmount === "" || creatorShares === "") {
                        showResponse("Fill All Details", false);
                    } else {
                        if (creatorShares >= 100) {
                            showResponse("Creators Share Should Less Than 100%", false);
                        } else if (creatorShares % 1 !== 0) {
                            showResponse("Share Amount Should Not In Float", false);
                        } else {
                            let baseAmountETH;
                            try {
                                baseAmountETH = ethers.utils.parseEther(baseAmount);
                            } catch (error) {
                                showResponse("Base Value Is Too Small", false);
                            }
                            try {
                                if (window.confirm("Are You Sure") === true) {
                                    dispatch({ type: "setIsLoading", payload: true });
                                    let isTrulyRandom = false;
                                    if (document.getElementsByClassName("isTrulyRandomInp")[0].clicked === true) {
                                        isTrulyRandom = true;
                                    }
                                    let res = await contractETH.createChakra(chakraId, baseAmountETH._hex, creatorShares, isTrulyRandom, { value: baseAmountETH._hex });
                                    console.log(res);
                                    console.log(await res.wait());
                                    showResponse("Done", true);
                                    window.location.reload();
                                }
                            } catch (error) {
                                console.log(error)
                                showResponse(error.reason, false);
                                dispatch({ type: "setIsLoading", payload: false });
                            }
                        }
                    }
                } else if (operationNum === 1) {
                    let baseAmount = document.getElementById("amountInp").value.trim();
                    if (baseAmount === "") {
                        showResponse("Fill All Details", false);
                    } else {
                        let baseAmountETH;
                        try {
                            baseAmountETH = ethers.utils.parseEther(baseAmount);
                        } catch (error) {
                            showResponse("Base Value Is Too Small", false);
                        }
                        try {
                            if (window.confirm("Are You Sure") === true) {
                                dispatch({ type: "setIsLoading", payload: true });
                                let res = await contractETH.joinChakra(chakraId, { value: baseAmountETH._hex });
                                console.log(res);
                                console.log(await res.wait());
                                showResponse("Done", true);
                                window.location.reload();
                            }
                        } catch (error) {
                            console.log(error)
                            showResponse(error.reason, false);
                            dispatch({ type: "setIsLoading", payload: false });
                        }
                    }
                } else if (operationNum === 2) {
                    try {
                        if (window.confirm("Are You Sure") === true) {
                            dispatch({ type: "setIsLoading", payload: true });
                            let res = await contractETH.endChakra(chakraId);
                            console.log(res);
                            console.log(await res.wait());
                            showResponse("Done", true);
                            window.location.reload();
                        }
                    } catch (error) {
                        console.log(error)
                        showResponse(error.reason, false);
                        dispatch({ type: "setIsLoading", payload: false });
                    }
                } else if (operationNum === 3) {
                    try {
                        if (window.confirm("Are You Sure") === true) {
                            dispatch({ type: "setIsLoading", payload: true });
                            let res = await contractETH.distributeFunds(chakraId);
                            console.log(res);
                            console.log(await res.wait());
                            showResponse("Done", true);
                            window.location.reload();
                        }
                    } catch (error) {
                        console.log(error)
                        showResponse(error.reason, false);
                        dispatch({ type: "setIsLoading", payload: false });
                    }
                }
            } else {
                showResponse("Fill All Details", false);
            }
        } else {
            showResponse("Something Went Wrong", false);
            window.location.reload();
        }
    }

    const getProperDate = (unfilteredDate) => {
        let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let tempDate = new Date(unfilteredDate);
        let curDate = new Date();
        if (curDate.getFullYear() > tempDate.getFullYear()) {
            return tempDate.getDate() + "th " + months[tempDate.getMonth()] + " " + tempDate.getFullYear();
        } else if (curDate.getMonth() > tempDate.getMonth() || curDate.getDate() > tempDate.getDate()) {
            return tempDate.getDate() + "th " + months[tempDate.getMonth()];
        } else {
            return tempDate.getHours() + ":" + tempDate.getMinutes();
        }
    }

    const changeCurOperationShower = () => {
        if (document.getElementsByClassName("joinOrCreateBTN")[0] !== undefined) {
            document.getElementsByClassName("joinOrCreateBTN")[0].classList.remove("currentOptionShower")
            document.getElementsByClassName("activitiesBTN")[0].classList.add("currentOptionShower")
        }
    }

    return (
        <>
            {
                chakraId === undefined ?
                    isMetamask === true ?
                        <div className="mainDashboardDiv">
                            <div className="subDashboardDiv">
                                <div className="optionShower">
                                    <div onClick={() => {
                                        document.getElementsByClassName("moreOptionShowerDiv")[0].style.display === "block" ?
                                            document.getElementsByClassName("moreOptionShowerDiv")[0].style.display = "none" :
                                            document.getElementsByClassName("moreOptionShowerDiv")[0].style.display = "block"
                                    }} className="moreOptionShowerIcon"><FiMoreVertical /></div>
                                    <div onClick={() => {
                                        dispatch({ type: "setIsActivitiesShower", payload: false })
                                        document.getElementsByClassName("joinOrCreateBTN")[0].classList.add("currentOptionShower")
                                        document.getElementsByClassName("activitiesBTN")[0].classList.remove("currentOptionShower")

                                    }} className="joinOrCreateBTN optionHeader currentOptionShower">{operationsData.selectedOperation.text}</div>
                                    <div onClick={() => {
                                        dispatch({ type: "setIsActivitiesShower", payload: true })
                                    }} className="activitiesBTN optionHeader">Activities</div>
                                </div>
                                <div className="moreOptionShowerDiv">
                                    <div onClick={() => changeOperation(0)} className="moreOptions">{operationsData.unSelectedOperations[0].text}</div>
                                    <div onClick={() => changeOperation(1)} className="moreOptions">{operationsData.unSelectedOperations[1].text}</div>
                                    <div onClick={() => changeOperation(2)} className="moreOptions">{operationsData.unSelectedOperations[2].text}</div>
                                </div>
                                <div className="joinInpTaker">
                                    {
                                        isActivitiesShower === true ?
                                            <>
                                                {changeCurOperationShower()}
                                                {
                                                    mainUserData === null || mainUserData.activities.length < 1 ?
                                                        <>
                                                            <div className="noActivityShower">
                                                                <span style={{ color: "white" }}>No</span> Activities
                                                            </div>
                                                        </> :
                                                        mainUserData.activities.slice(0).reverse().map((data, i) => (
                                                            <div key={i} onClick={() => {
                                                                history.push(`/${data.id}`)
                                                            }} className="activityShower" style={
                                                                i === mainUserData.activities.length - 1 ?
                                                                    { marginBottom: "2rem" } : null}>
                                                                <span className="idShowerInAc" style={{ color: "#61dafb" }}>#{data.id} {data.event}</span>
                                                                <span className="baseValueShowerInAc" style={{ color: "#b2b9d2" }}>{ethers.utils.formatEther(data.amount)} ETH</span>
                                                                <span >{getProperDate(data.time)}</span>
                                                            </div>
                                                        ))
                                                }
                                            </> :
                                            <>
                                                <div onClick={() => {
                                                    hideGuidelines()
                                                }} className="responseShower"><span className="responseText" >Something Went Wrong</span></div>
                                                {
                                                    operationsData.selectedOperation.num === 0 ?
                                                        <>
                                                            <input type="number" name="chakraIdInp" id="chakraIdInp" placeholder="New Chakra Id" />
                                                            <input type="number" name="amountInp" id="amountInp" placeholder="Base Amount In ETH" />
                                                            <input type="number" name="creatorShare" id="creatorShare" placeholder="Your Share In %" />
                                                            <button onClick={() => selectIsTrulyRandom()} className="isTrulyRandomInp">Is Truly Random <HiBadgeCheck className="showCheckIcon" /></button>
                                                        </> :
                                                        operationsData.selectedOperation.num === 1 ?
                                                            <>
                                                                <input type="number" name="chakraIdInp" id="chakraIdInp" placeholder="Chakra Id" />
                                                                <input type="number" name="amountInp" id="amountInp" placeholder="Entrance Amount" />
                                                            </>
                                                            : <> <input type="number" name="chakraIdInp" id="chakraIdInp" placeholder="Chakra Id" /></>
                                                }

                                                <div onClick={() => performOperation(operationsData.selectedOperation.num)} className="joinSubmitBTN">
                                                    {operationsData.selectedOperation.text}
                                                </div>
                                            </>
                                    }

                                </div>
                            </div>
                        </div> :
                        <>
                            <div className="installMetamaskShower">
                                <div className="showMetamaskIMGAndLink">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/800px-MetaMask_Fox.svg.png" alt="" />
                                    <span onClick={() => {
                                        window.location.href = "https://metamask.io/"
                                    }}>Install Metamask</span>
                                </div>
                            </div>
                        </>
                    : <ChakraDataShower />
            }
        </>
    )
}

export default Dashboard