const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Fungsi untuk menunda eksekusi
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const yellowText = text => `\x1b[33m${text}\x1b[0m`;
const greenText = text => `\x1b[32m${text}\x1b[0m`;

// Fungsi untuk format waktu
const formatTime = ms => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}h ${minutes}m ${seconds}s`;
};

const GeneralTask = async () => {
  try {
    const accountListPath = path.join(__dirname, '../AccountList.json');
    const accountList = JSON.parse(fs.readFileSync(accountListPath, 'utf-8'));

    if (accountList.length === 0) {
      console.log('No accounts found in AccountList.json');
      return;
    }

    for (const account of accountList) {
      const token = account.access_token;
      const username = account.user && account.user.username ? account.user.username : 'NO USERNAME';

      const headers = {
        'Accept': 'application/json, text/plain, */*',
        'Authorization': `Bearer ${token}`,
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Accept-Language': 'en-US,en;q=0.9,id;q=0.8',
        'Content-Type': 'application/json',
        'Referer': 'https://major.bot/',
        'User-Agent': 'Mozilla/5.0',
      };

      try {
        const generalTask = 'https://major.bot/api/tasks/?is_daily=false';
        const response = await axios.get(generalTask, { headers });
        const tasks = response.data;

        // Filter tasks yang tidak berkaitan dengan transaksi
        const filteredTasks = tasks.filter(task => task.id && !/buy|purchase|transaction/i.test(task.description || ''));

        if (filteredTasks.length > 0) {
          console.log(`${username}: Ada ${filteredTasks.length} General Tasks yang bisa diselesaikan. Memulai Menyelesaikan Task....`);

          for (const task of filteredTasks) {
            try {

              const actionTask = await axios.post('https://major.bot/api/tasks/', { task_id: task.id }, { headers });
              console.log(`Task: "${task.title}" processed.`);
              console.log('\x1b[34m%s\x1b[0m', username, ': ', task.title, actionTask.data.is_completed === false ? yellowText('Task Belum Selesai/ tidak dapat diselesaikan') : 'Task Selesai');
            } catch (error) {
              if (error.response && error.response.status === 400) {
                console.warn(greenText(`for user ${username}: Task ${task.title} ALREADY COMPLETED`));
              } else {
                console.error(`Error for user ${username} on task ${task.id}:`, error.message);
              }
            }

            await delay(1000); // Jeda antara task
          }
        } else {
          console.log(`\x1b[33m Akun: ${username} No Task Found \x1b[0m`);
        }
      } catch (error) {
        console.error(`Error for user ${username}:`, error.message);
      }

      await delay(3000); // Jeda antara akun
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
};

// Ekspor fungsi
module.exports = GeneralTask;
