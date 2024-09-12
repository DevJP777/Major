const fs = require('fs');
const path = require('path');

const authData = require('./PubFunc/AuthData');
const DailyTask = require('./PubFunc/DailyTask');
const GeneralTask = require('./PubFunc/GeneralTask');
const RoulleteTask = require('./PubFunc/RoulleteTask');
const SwipeCoinTask = require('./PubFunc/SwipeCoin');
const { dailyTask, generalTask } = require('./ApiPath');

// Tentukan path file JSON
const accountListPath = path.join(__dirname, './AccountList.json');
const yellowText = text => `\x1b[33m${text}\x1b[0m`;
const greenText = text => `\x1b[32m${text}\x1b[0m`;
const blueText = text => `\x1b[34m${text}\x1b[0m`;

// Fungsi untuk delay
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Fungsi untuk menghitung interval acak antara batas bawah dan batas atas dalam milidetik
const getRandomInterval = (minMinutes, maxMinutes) => {
    const minMillis = minMinutes * 60 * 1000;
    const maxMillis = maxMinutes * 60 * 1000;
    return Math.floor(Math.random() * (maxMillis - minMillis + 1)) + minMillis;
};

// Fungsi untuk mengonversi interval dari milidetik ke format hari-jam-menit
const formatInterval = millis => {
    const totalMinutes = Math.floor(millis / (1000 * 60));
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const minutes = totalMinutes % 60;
    return `${days} hari ${hours} jam ${minutes} menit`;
};

// Fungsi utama untuk majorBot
async function majorBot() {
    try {
        if (fs.existsSync(accountListPath)) {
            const stats = fs.statSync(accountListPath);
            if (stats.size === 0) {
                console.log(blueText('AccountList.json ditemukan tapi kosong, menjalankan authData...'));
                await authData();
            } else {
                const fileContent = fs.readFileSync(accountListPath, 'utf-8');
                let parsedData;

                try {
                    parsedData = JSON.parse(fileContent);
                } catch (error) {
                    console.error('Error parsing JSON:', error.message);
                    return;
                }

                // Periksa apakah parsedData adalah objek atau array kosong
                if (Array.isArray(parsedData) && parsedData.length === 0) {
                    await authData();
                } else if (typeof parsedData === 'object' && Object.keys(parsedData).length === 0) {
                    await authData();
                }
            }
        } else {
            console.log(blueText('AccountList.json tidak ditemukan, membuat file baru dan menjalankan authData...'));
            // Buat file kosong untuk AccountList.json
            fs.writeFileSync(accountListPath, JSON.stringify([]));
            await authData();
        }
        await authData()
        await DailyTask();
        await GeneralTask();
        await RoulleteTask();
        await SwipeCoinTask();
        console.log(greenText('SwipeCoin task completed.'));

        // Mulai countdown untuk tugas berikutnya
        const runTasksPeriodically = async () => {
            while (true) {
                // Hitung interval acak
                const interval = getRandomInterval(485, 495); // 485 hingga 495 menit (8 jam 5 menit hingga 8 jam 15 menit)
                const start = Date.now();
                const end = start + interval;

                console.log(`Task akan dijalankan ulang dalam waktu: ${yellowText(formatInterval(interval))}`);
                
                while (Date.now() < end) {
                    const remainingTime = end - Date.now();
                    const formattedRemainingTime = formatInterval(remainingTime);
                    console.clear();
                    console.log(`Task akan dijalankan ulang dalam waktu: ${yellowText(formattedRemainingTime)}`);
                    await delay(60000); // Tunggu 1 menit
                }

                // Jalankan tugas lagi setelah interval
                await DailyTask();
                await GeneralTask();
                await RoulleteTask();
                await SwipeCoinTask();

                // Hitung interval acak baru untuk iterasi berikutnya
                const newInterval = getRandomInterval(485, 495);
                const newFormattedInterval = formatInterval(newInterval);
                console.log(yellowText(`AUTO TASK AKAN DIJALANKAN ULANG DALAM WAKTU: ${newFormattedInterval}`));
            }
        };

        await runTasksPeriodically();
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Mulai fungsi utama
majorBot();
