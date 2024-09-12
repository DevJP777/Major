const fs = require('fs');
const path = require('path');

// Fungsi untuk membaca data dari majorlist.txt
const readMajorList = (majorListPath) => {
  const data = fs.readFileSync(majorListPath, 'utf-8');
  return data.split('\n').filter(line => line.trim() !== '');
};

// Fungsi untuk menyinkronkan AccountList.json dengan majorlist.txt
const syncData = async (accountListPath, majorListPath) => {
  try {
    const majorListData = readMajorList(majorListPath);
    
    const accountListData = fs.existsSync(accountListPath) 
      ? JSON.parse(fs.readFileSync(accountListPath, 'utf-8')) 
      : [];

    if (!Array.isArray(accountListData)) {
      console.error('AccountList.json format tidak valid.');
      return;
    }

    const majorListSet = new Set(majorListData);

    // Hapus data yang tidak ada di majorlist.txt
    const updatedAccountListData = accountListData.filter(account => majorListSet.has(account.init_data));

    // Tambahkan data dari majorlist.txt jika belum ada
    majorListData.forEach(data => {
      if (!updatedAccountListData.some(account => account.init_data === data)) {
        updatedAccountListData.push({ init_data: data });
      }
    });

    fs.writeFileSync(accountListPath, JSON.stringify(updatedAccountListData, null, 2));
    console.log('AccountList.json berhasil disinkronkan dengan majorlist.txt.');
  } catch (error) {
    console.error('Error during data synchronization:', error.message);
  }
};

module.exports = { syncData };
