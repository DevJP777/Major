const axios = require('axios');
const fs = require('fs');
const path = require('path');
const greenText = text => `\x1b[32m${text}\x1b[0m`;
const blueText = text => `\x1b[34m${text}\x1b[0m`;
// Fungsi untuk delay dengan Promise
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const RoulleteTask = async () => {
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

            const headers = {
                'Accept': 'application/json, text/plain, */*',
                'Authorization': `Bearer ${token}`,
                'Priority': 'u=1, i',
                'Referer': 'https://major.bot/games',
                'Sec-CH-UA': '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
                'Sec-CH-UA-Mobile': '?0',
                'Sec-CH-UA-Platform': '"Windows"',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
            };        

            try {
                const RoulleteTaskUrl = 'https://major.bot/api/roulette/';
                const response = await axios.get(RoulleteTaskUrl, { headers });
                const tasks = response.data;
                //console.log(`Tasks Roullete for user ${username}:`, tasks);
                if(tasks.success === true){
                    const doRouletteHeader = {
                        'Accept': 'application/json, text/plain, */*',
                        'Authorization': `Bearer ${token}`,
                        'Content-Length': '0',
                        'Origin': 'https://major.bot',
                        'Referer': 'https://major.bot/games/roulette',
                        'Sec-CH-UA': '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
                        'Sec-CH-UA-Mobile': '?0',
                        'Sec-CH-UA-Platform': '"Windows"',
                        'Sec-Fetch-Dest': 'empty',
                        'Sec-Fetch-Mode': 'cors',
                        'Sec-Fetch-Site': 'same-origin',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
                    };
                    try{
                        const RoulleteTaskUrl = 'https://major.bot/api/roulette/';
                        let doRoulette = await axios.post(RoulleteTaskUrl, {},{headers: doRouletteHeader});

                        if(doRoulette.data){
                            console.log(blueText(`${account.user.username}`),'mendapatkan ',greenText(`${doRoulette.data.rating_award}`,'MAJOR POINT dari roulette'))
                        }else{

                        }
                    }catch (postError) {
                        if (postError.response) {
                            if (postError.response.status === 400) {
                                console.warn(`Warning for user ${username}: Task failed with status 400.`);
                            } else if (postError.response.status === 401) {
                                console.error(`Error for user ${username}: Unauthorized - ${postError.response.data}`);
                            } else {
                                console.error(`Error for user ${username}:`, postError.response.status, postError.response.data);
                            }
                        } else {
                            console.error(`Error for user ${username}:`, postError.message);
                        }
                    }
                }else{

                }
            } catch (error) {
                if (error.response.status == '400') {
                    // Tangani kesalahan 400 Bad Request dengan pesan kesalahan
                    console.info(blueText(username),`task Roullete is`,greenText('Already COMPLETED...'));
                } else {
                    // Tangani kesalahan lainnya
                    console.error(`Unexpected error for user ${username} on roullete: ${error.message}`);
                }
                // Setelah menangani kesalahan, lanjutkan ke iterasi berikutnya
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

module.exports = RoulleteTask;
