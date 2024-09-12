@echo off
setlocal

:: Cek jika Chocolatey belum terinstal
where choco >nul 2>nul
if %errorlevel% neq 0 (
    echo Chocolatey tidak terdeteksi, menginstal Chocolatey...
    @powershell -NoProfile -ExecutionPolicy Bypass -Command "Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))"
) else (
    echo Chocolatey sudah terinstal.
)

:: Cek jika Git belum terinstal
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo Git tidak terdeteksi, menginstal Git...
    choco install git -y
) else (
    echo Git sudah terinstal.
)

:: Cek jika Node.js belum terinstal
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Node.js tidak terdeteksi, menginstal Node.js...
    choco install nodejs -y
) else (
    echo Node.js sudah terinstal.
)

:: Cek jika npm belum terinstal
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo npm tidak terdeteksi, menginstal npm...
    choco install npm -y
) else (
    echo npm sudah terinstal.
)

:: Jalankan npm install
echo Menjalankan npm install...
npm install

:: Update npm package
echo Menjalankan npm install...
npm update

:: upgrade npm package
echo Menjalankan npm install...
npm upgrade
echo Setup selesai.
pause
