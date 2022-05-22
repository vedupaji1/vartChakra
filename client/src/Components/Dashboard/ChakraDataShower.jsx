import React, { useEffect, useContext } from 'react';
import { requiredInfo } from "../../App";
import { useSelector, useDispatch } from 'react-redux';
import { ethers } from 'ethers';
import Error404 from "../Error404";
import Loading from '../Loading';

const ChakraDataShower = () => {
    const contextData = useContext(requiredInfo);
    const contractETH = contextData.contractETH;
    let searchedUserData = useSelector(state => state.searchedUserData.data);
    let chakraId = useSelector(state => state.chakraId.data);
    let dispatch = useDispatch();
    useEffect(() => {
        const init = async () => {
            if (searchedUserData === null && chakraId !== null && chakraId !== undefined && contractETH !== null) {
                try {
                    let chakrasData = await contractETH.chakras(chakraId);
                    if (chakrasData.creator !== "0x0000000000000000000000000000000000000000") {
                        let chakraData = {
                            id: chakraId,
                            creator: chakrasData.creator,
                            startTime: chakrasData.startTime._hex * 1000,
                            endTime: chakrasData.endTime._hex * 1000,
                            baseValue: chakrasData.baseValue._hex,
                            creatorShare: chakrasData.creatorShare._hex,
                            isTrulyRandom: chakrasData.isTrulyRandom,
                            winner: chakrasData.winner._hex,
                            participants: await contractETH.showParticipants(chakraId)
                        }
                        dispatch({ type: "setSearchedUserData", payload: chakraData });
                    } else {
                        dispatch({ type: "setSearchedUserData", payload: { creator: "0x0000000000000000000000000000000000000000" } });
                    }
                } catch (error) {
                    alert("Something Went Wrong");
                    window.location.reload();
                }
            }
        }
        init();
    })

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

    return (
        <>
            {
                searchedUserData !== null ?
                    searchedUserData.creator !== "0x0000000000000000000000000000000000000000" ?
                        <>
                            <div className="mainDataShowerDiv">
                                <div className="subDataShowerDiv">
                                    <div className="chakraIdShower">{searchedUserData.id}</div>
                                    <div className="chakraDataShower">
                                        <div className="chakraData"><span>Creator</span> <span className="mainChakarData">{searchedUserData.creator}</span></div>
                                        <div className="chakraData"><span>Start Time</span> <span className="mainChakarData">{getProperDate(searchedUserData.startTime)}</span></div>
                                        <div className="chakraData"><span>End Time</span> <span className="mainChakarData">{parseInt(searchedUserData.endTime) === 0 ? "-" : getProperDate(searchedUserData.endTime)}</span></div>
                                        <div className="chakraData"><span>Base Value</span> <span className="mainChakarData">{ethers.utils.formatEther(searchedUserData.baseValue)} ETH</span></div>
                                        <div className="chakraData"><span>Creator Share</span> <span className="mainChakarData">{parseInt(searchedUserData.creatorShare)}%</span></div>
                                        <div className="chakraData"><span>Truly Random</span> <span className="mainChakarData">{searchedUserData.isTrulyRandom === true ? "Yes" : "No"}</span></div>
                                        <div className="chakraData"><span>Winner</span> <span className="mainChakarData">{parseInt(searchedUserData.winner) === 0 ? "-" : parseInt(searchedUserData.winner)}</span></div>
                                        <div className="chakraData">
                                            <span>Participants</span>
                                            <div className="participantsAddress">
                                                {
                                                    searchedUserData.participants.map((data, i) => (
                                                        <span key={i} className="mainChakarData">{data}</span>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </> : <Error404 />
                    : <Loading />
            }

        </>
    )
}

export default ChakraDataShower;