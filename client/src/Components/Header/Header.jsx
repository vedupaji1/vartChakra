import React, { useContext } from 'react';
import { requiredInfo } from "../../App";
import { FaSearch } from "react-icons/fa";
import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory } from "react-router-dom";
import Logo from "../../Logo.svg";
const Header = () => {

    const contextData = useContext(requiredInfo);
    const contractETH = contextData.contractETH;
    let mainUserData = useSelector(state => state.mainUserData.data);
    let isMetamask = useSelector(state => state.isMetamask.data);
    let dispatch = useDispatch();
    const history = useHistory();

    const searchUser = async () => {
        if (contractETH !== null) {
            let chakraId = document.getElementsByClassName("searchBarInp")[0].value.trim();
            if (chakraId !== "") {
                try {
                    let chakrasData = await contractETH.chakras(chakraId);
                    if (chakrasData.creator !== "0x0000000000000000000000000000000000000000") {
                        chakrasData = {
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
                        dispatch({ type: "setSearchedUserData", payload: chakrasData });
                        history.push("/" + chakraId);
                    } else {
                        alert("Chakra Not Exists");
                    }
                } catch (error) {
                    alert("Something Went Wrong");
                    window.location.reload();
                }
            } else {
                alert("Search Field Is Empty");
            }
        } else {
            alert("Something Went Wrong");
            window.location.reload();
        }
    }

    const checkIsEnter = async (e) => {
        if (e.key === "Enter") {
            await searchUser();
        }
    };

    return (
        <>
            <div className="headerMainDiv">
                <div className="subHeaderDiv">
                    {
                        window.innerWidth > 890 ?
                            <div className="headingText">
                                <Link to="/">
                                    <div className="subHeadingText">
                                        VARt <span style={{ color: "#61dafb" }}>Chakra</span>
                                    </div>
                                </Link>
                            </div>
                            : <Link to="/">
                                <img src={Logo} className="chakraLogoImg" alt="" />
                            </Link>
                    }
                    <div className="searchBar">
                        <FaSearch onClick={() => searchUser()} />
                        <input type="number" placeholder="Search By Chakra Id" className="searchBarInp" onKeyDown={(e) => checkIsEnter(e)} />
                    </div>
                    <div className="userAccount">
                        {
                            isMetamask === null ?
                                <></> :
                                isMetamask === true ?
                                    mainUserData === null ?
                                        <div onClick={() => {
                                            window.location.reload();
                                        }} className="subUserAccount">Wait..</div> :
                                        <Link to="/">
                                            <div className="subUserAccount">{mainUserData.address.substring(0, 5) + "..." + mainUserData.address.substring(39, 41)}</div>
                                        </Link> :
                                    <div onClick={() => {
                                        window.location.href = "https://metamask.io/"
                                    }} className="subUserAccount">Add Wallet</div>
                        }

                    </div>
                </div>
            </div>
        </>
    )
}

export default Header