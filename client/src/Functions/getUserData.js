import {
    ethers
} from "ethers";
const decoder = new ethers.utils.AbiCoder();
const getUserData = async (userAddress, provider) => {

    let tempAddress = "0x000000000000000000000000" + userAddress.substring(2, 63) // For Filtering Logs Data We Need Vales Of 64 Bytes And Here We Are Converting Users Address To 64 Bytes Or 0x+64 Characters Containing Address.
    let userData = {
        address: userAddress,
        activities: []
    }

    let logsData = await provider.getLogs({ // Getting Users Data From Logs By Filtering Through Users Address And Smart Contract Address And This Filter Query Will Return All Event Data Or Logs Data That Have Users Address In Second Positions Or Satisfies Filter Query For More Info Check "getUserDataInOrganizedManner.js" File.
        fromBlock: 10695679,
        address: "0x48585eeFa3F9F09Aeab61A7b1755334cD60EE9DA",
        topics: [
            null,
            tempAddress
        ]
    })

    for (let j = 0; j < logsData.length; j++) {
        let tempData = {
            id: parseInt(logsData[j].topics[2])
        };
        let filteredData = decoder.decode(["uint", "uint"], logsData[j].data)
        tempData.amount = filteredData[0]._hex;
        tempData.time = filteredData[1]._hex * 1000;
        if (logsData[j].topics[0] === "0xfe5133a58bfdbf378a348cd21a520ae48b8ce706fe9001f759e7855d86848a0f") {
            tempData.event = "Created";
        } else if (logsData[j].topics[0] === "0x807a257f74005839b8e5a55539e1007ed7c947a1f5fffd13a6cda97f46270e27") {
            tempData.event = "Joined";
        } else {
            tempData.event = "Wins";
        }
        userData.activities.push(tempData);
    }

    return userData;
}

export default getUserData;