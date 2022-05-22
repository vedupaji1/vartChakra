import {
    ethers
} from "ethers";
const decoder = new ethers.utils.AbiCoder();
const getUserData = async (userAddress, provider) => {
    let tempAddress = "0x000000000000000000000000" + userAddress.substring(2, 63) // For Filtering Logs Data We Need Vales Of 64 Bytes And Here We Are Converting Users Address To 64 Bytes Or 0x+64 Characters Containing Address.
    let userData = {
        address: userAddress,
        activities: {
            created: [],
            joined: [],
            wins: []
        }
    }
    let logsData = [ // It Is Array Of Logs Data Of Event "ChakraCrated", "ChakraJoined", "EndChakra".
        await provider.getLogs({ // Here We Are Filtering Logs From Provider Node Using Filter Query Visit "https://www.bitdegree.org/learn/solidity-events#event-filtering" And "https://medium.com/linum-labs/everything-you-ever-wanted-to-know-about-events-and-logs-on-ethereum-fec84ea7d0a5" For More Info.
            fromBlock: 10695679,
            address: "0x48585eeFa3F9F09Aeab61A7b1755334cD60EE9DA", // This Is Address Of Our Contract And It Will Also Help In Filtering Data.
            topics: [ // This Is One Of The Important Part Of Log Data Filtering And Here We Has To Specify Values Of Event Logs, We Can Only Specify Value Of Index Parameter Of Event For Filtering.
                "0xfe5133a58bfdbf378a348cd21a520ae48b8ce706fe9001f759e7855d86848a0f", // This Is Hash Form Of Event Please Visit Given Second Link For More Info.
                tempAddress
            ]
        }),
        await provider.getLogs({
            fromBlock: 10695679,
            address: "0x48585eeFa3F9F09Aeab61A7b1755334cD60EE9DA",
            topics: [
                "0x807a257f74005839b8e5a55539e1007ed7c947a1f5fffd13a6cda97f46270e27",
                tempAddress
            ]
        }),
        await provider.getLogs({
            fromBlock: 10695679,
            address: "0x48585eeFa3F9F09Aeab61A7b1755334cD60EE9DA",
            topics: [
                "0x1bf16f69d7258eb2f6855905ad6d23fab266f941fefe07d9a5a3cf3d20c28f3e",
                tempAddress
            ]
        })
    ]

    console.log(await provider.getLogs({
        fromBlock: 10695679,
        address: "0x48585eeFa3F9F09Aeab61A7b1755334cD60EE9DA",
        topics: [
            null,
            tempAddress
        ]
    }))

    for (let i = 0; i < 3; i++) {
        let logData = logsData[i];
        for (let j = 0; j < logData.length; j++) {
            let tempData = {
                id: parseInt(logData[j].topics[2])
            };
            let filteredData = decoder.decode(["uint", "uint"], logData[j].data)
            tempData.amount = parseInt(filteredData[0]._hex);
            tempData.time = parseInt(filteredData[1]._hex) * 1000;
            if (i == 0) {
                userData.activities.created.push(tempData);
            } else if (i == 1) {
                userData.activities.joined.push(tempData);
            } else {
                userData.activities.wins.push(tempData);
            }
        }
    }
    return userData;
}

export default getUserData;