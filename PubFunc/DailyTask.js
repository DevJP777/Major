


const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Fungsi untuk menunda eksekusi
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Fungsi untuk format waktu
const formatTime = ms => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}h ${minutes}m ${seconds}s`;
};

const greenText = text => `\x1b[32m${text}\x1b[0m`;
const DailyTask = async () => {
  try {
    const accountListPath = path.join(__dirname, '../AccountList.json');
    const accountList = JSON.parse(fs.readFileSync(accountListPath, 'utf-8'));

    if (accountList.length === 0) {
      console.log('No accounts found in AccountList.json');
      return;
    }

    for (const account of accountList) {
      const token = account.access_token;
      const username = account.user && account.user.username ? account.user.username : 'Unknown User';

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
        const dailyTask = 'https://major.bot/api/tasks/?is_daily=true';
        const response = await axios.get(dailyTask, { headers });
        const tasks = response.data;
        //console.log(tasks)

        const filteredTasks = tasks.filter(task => !/buy|purchase|transaction|invite|boost|donation|donate rating|promote/i.test(task.description || ''));

        const taskIds = filteredTasks
          .filter(task => task.id)
          .map(task => ({ id: task.id, description: task.description, title: task.title }));
        //console.log(taskIds)
        if (taskIds.length > 0) {
            //console.log(taskIds)
            console.log(`${username}: Ada ${taskIds.length} Daily tasks yang bisa di selesaikan. Memulai Menyelesaikan Task`);
            //console.log(tasks)
          for (const task of taskIds) {
                try {
                  const actionTask = await axios.post('https://major.bot/api/tasks/', { task_id: task.id }, { headers });
                  console.log(`Task: "${task.title}" processed.`);
                  console.log('\x1b[34m%s\x1b[0m', username, ': ', task.title, actionTask.data.is_completed === false ? 'Task Belum Selesai/ tidak dapat diselesaikan' : 'Task Selesai');
              } catch (actionError) {
                  if (actionError.response && actionError.response.status === 400) {
                      // Jika status adalah 400, log pesan dan lanjutkan
                      console.warn(greenText(`for user ${username}: Daily Task "${task.title}" ALREADY COMPLETE`));
                  } else {
                      // Tangani kesalahan lain
                      console.error(`Error for user ${username}:`, actionError.message);
                  }
              }
            await delay(500)
          }
        } else {
          console.log(`\x1b[33m Akun: ${username} No Task Found \x1b[0m`);
        }
      } catch (error) {
        console.error(`Error for user ${username}:`, error.message);
      }

      await delay(1000);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
};

module.exports =  DailyTask;
