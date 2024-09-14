const axios = require('axios');
const fs = require('fs');
const path = require('path');
const greenText = text => `\x1b[32m${text}\x1b[0m`;
const blueText = text => `\x1b[34m${text}\x1b[0m`;

// Fungsi untuk delay dengan Promise
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Fungsi untuk menghasilkan angka acak dalam rentang tertentu
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const HoldCoinTask = async () => {
    try {
        const accountListPath = path.join(__dirname, '../AccountList.json');
        const accountList = JSON.parse(fs.readFileSync(accountListPath, 'utf-8'));

        if (accountList.length === 0) {
            console.log('No accounts found in AccountList.json');
            return;
        }

        for (const [index, account] of accountList.entries()) {
            const token = account.access_token;
            const username = account.user && account.user.username ? account.user.username : 'Unknown User';

            const HoldGetHeader = {
                'Accept': 'application/json, text/plain, */*',
                'Authorization': `Bearer ${token}`,
                'Accept-Encoding': 'gzip, deflate, br, zstd',
                'Accept-Language': 'en-US,en;q=0.9,id;q=0.8',
                'Priority': 'u=1, i',
                'Referer': 'https://major.bot/games/hold-coin',
                'Sec-CH-UA': '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
                'Sec-CH-UA-Mobile': '?0',
                'Sec-CH-UA-Platform': '"Windows"',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
            };
            

            const postHeaders = {
                'Accept': 'application/json, text/plain, */*',
                'Accept-Encoding': 'gzip, deflate, br, zstd',
                'Accept-Language': 'en-US,en;q=0.9,id;q=0.8',
                'Authorization': `Bearer ${token}`,
                //'Content-Length': 13,
                'Content-Type': 'application/json',
                'Origin': 'https://major.bot',
                'Priority': 'u=1, i',
                'Referer': 'https://major.bot/games/hold-coin',
                'Sec-CH-UA': '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
                'Sec-CH-UA-Mobile': '?0',
                'Sec-CH-UA-Platform': '"Windows"',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
            };

            try {
                const HoldCoinTaskUrl = 'https://major.bot/api/bonuses/coins/';
                
                // Mengambil data dengan GET request
                const response = await axios.get(HoldCoinTaskUrl, { headers: HoldGetHeader });
                const tasks = response.data;
                console.log(`Hold Coin tasks for user ${username}:`, tasks);

                if (tasks.success === true) {
                    // Generate random coins between 2000 and 2500
                    const randomCoins = getRandomInt(2000, 2500);

                    // Payload untuk POST request
                    const doHoldCoinPayload = {
                        coins: 885
                    };

                    // Update content length dengan panjang payload yang sebenarnya
                    //postHeaders['Content-Length'] = Buffer.byteLength(JSON.stringify(doHoldCoinPayload));

                    try {
                        // Mengirimkan POST request dengan payload
                        const doHoldCoinResponse = await axios.post(HoldCoinTaskUrl, doHoldCoinPayload, { headers: postHeaders });

                        if (doHoldCoinResponse.data) {
                            console.log(blueText(`${username}`), 'mendapatkan', greenText(`MAJOR POINT dari TASK Hold Coin Sejumlah  ${doHoldCoinPayload.coins? doHoldCoinPayload.coins:'885'} coins`));
                        } else {
                            console.log(blueText(`${username}`), 'tidak mendapatkan poin dari  Holdcoin');
                        }
                    } catch (postError) {
                        if (postError.response) {
                            if (postError.response.status === 400) {
                                console.warn(`Warning for user ${username}: Hold coin task failed with status 400.`);
                            } else if (postError.response.status === 401) {
                                console.error(`Error for user ${username}: Unauthorized - ${postError.response.message}`);
                            } else {
                                console.error(`Error for user ${username}:`, postError.response.status, postError.response.data);
                            }
                        } else {
                            console.error(`Error for user ${username}:`, postError.message);
                        }
                    }
                } else {
                    console.log(blueText(`${username}`), 'tidak berhasil mendapatkan data swipe coin');
                }
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    console.info(blueText(username), 'HoldCoin task is', greenText('Already COMPLETED...'));
                } else {
                    console.error(`Unexpected error for user ${username} on swipe coin task: ${error.message}`);
                }
            }

            // Delay 500ms antara proses akun
            if (index < accountList.length - 1) { // Tidak perlu delay setelah akun terakhir
                await delay(500);
            }
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
};

module.exports = HoldCoinTask;
