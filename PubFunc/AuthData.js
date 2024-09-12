const fs = require('fs');
const path = require('path');
const axios = require('axios');
const ApiPath = require('../ApiPath');

// URL endpoint
const auth = ApiPath.auth;

// Header request
const headers = {
  'Accept': 'application/json, text/plain, */*',
  'Accept-Encoding': 'gzip, deflate, br, zstd',
  'Accept-Language': 'en-US,en;q=0.9,id;q=0.8',
  'Content-Type': 'application/json',
  'Origin': 'https://major.bot',
  'Referer': 'https://major.bot/',
  'Sec-CH-UA': '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
  'Sec-CH-UA-Mobile': '?1',
  'Sec-CH-UA-Platform': '"Android"',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'same-origin',
  'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36',
};

// Fungsi untuk membaca file majorlist.txt dan menyimpan respons tanpa duplikasi atau memperbarui data
const authData = async () => {
  const { default: chalk } = await import('chalk');
  
  try {
    const filePath = path.join(__dirname, '../majorlist.txt');
    const data = fs.readFileSync(filePath, 'utf-8');
    
    // Menghapus karakter carriage return dan memisahkan payload
    const payloads = data.replace(/\r/g, '').split('\n').filter(line => line.trim() !== '');

    //console.log('Payloads:', payloads);

    if (payloads.length === 0) {
      console.log('Tidak ada payload untuk diproses.');
      return;
    }

    const responses = [];

    for (const [index, initData] of payloads.entries()) {
      //console.log(`Processing payload ${index + 1} of ${payloads.length}: ${initData}`);
      try {
        // Mengirim permintaan ke server
        const payload = { init_data: initData };
        //console.log('Payload to send:', payload);
        
        const response = await axios.post(auth, payload, { headers });
        //.log(`Response for payload ${index + 1}:`, response.data);
        responses.push(response.data);
        
        // Tunggu 3 detik sebelum melanjutkan ke payload berikutnya
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Error for payload ${index + 1}:`, error.response ? error.response.data : error.message);
      }
    }

    // Menyimpan respons ke file AccountList.json
    const accountListPath = path.join(__dirname, '../AccountList.json');
    let existingAccounts = [];

    if (fs.existsSync(accountListPath)) {
      const data = fs.readFileSync(accountListPath, 'utf-8');
      existingAccounts = JSON.parse(data);
      
      if (!Array.isArray(existingAccounts)) {
        console.log('AccountList.json tidak valid, membuat file baru...');
        existingAccounts = [];
      }
    } else {
      console.log('AccountList.json tidak ditemukan, membuat file baru...');
      fs.writeFileSync(accountListPath, JSON.stringify([], null, 2));
    }

    //console.log('Existing accounts:', existingAccounts);

    responses.forEach((newAccount) => {
      if (newAccount.user) {
        const existingIndex = existingAccounts.findIndex(account => account.user.id === newAccount.user.id);
        if (existingIndex > -1) {
          existingAccounts[existingIndex] = newAccount;
          console.log(`Data Akun user ${newAccount.user.username} Berhasil di update.`);
        } else {
          existingAccounts.push(newAccount);
          console.log(chalk.green('SUCCESS: '), `Data Akun user ${newAccount.user.username} Ditambahkan.`);
        }
      }
    });

    fs.writeFileSync(accountListPath, JSON.stringify(existingAccounts, null, 2));
    console.log('Responses saved to AccountList.json');
  } catch (err) {
    console.error('Error:', err.message);
  }
};

module.exports = authData;
