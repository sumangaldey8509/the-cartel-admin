// Replace with your own Helius API key
const API_KEY = "de1c1cee-30ab-4093-9e88-8320066618eb";
const WALLET = "4Y8Pt5gTgm5GtGEYTjLk5QoSqMLr3xpDgckD5vrrQ762";

const url = `https://mainnet.helius-rpc.com/?api-key=${API_KEY}`;

async function getTransactions() {
    const body = {
        jsonrpc: "2.0",
        id: "my-request",
        method: "getSignaturesForAddress",
        params: [WALLET, { limit: 5 }] // get last 5 txns
    };

    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    const data = await res.json();
    console.log("Recent Transactions:", data.result);
}

// getTransactions();



async function getDecodedTransactions() {
    const decodeUrl = `https://api.helius.xyz/v0/addresses/${WALLET}/transactions?api-key=${API_KEY}`;

    const res = await fetch(decodeUrl);
    const decoded = await res.json();

    console.log("Decoded Transactions:");
    console.log(decoded);
}

getDecodedTransactions();
