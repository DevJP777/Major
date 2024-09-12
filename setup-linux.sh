#!/bin/bash
setup_linux() {
    if ! command -v $1 &> /dev/null
    then
        return 1
    else
        return 0
    fi
}

# Cek jika curl belum terinstal, instal curl
if ! setup_linux curl; then
    echo "curl tidak terdeteksi, menginstal curl..."
    sudo apt update
    sudo apt install curl -y
else
    echo "curl sudah terinstal."
fi

# Cek jika Git belum terinstal, instal Git
if ! setup_linux git; then
    echo "Git tidak terdeteksi, menginstal Git..."
    sudo apt install git -y
else
    echo "Git sudah terinstal."
fi

# Cek jika Node.js belum terinstal, instal Node.js
if ! setup_linux node; then
    echo "Node.js tidak terdeteksi, menginstal Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt install -y nodejs
else
    echo "Node.js sudah terinstal."
fi

# Cek jika npm belum terinstal, instal npm
if ! setup_linux npm; then
    echo "npm tidak terdeteksi, menginstal npm..."
    sudo apt install npm -y
else
    echo "npm sudah terinstal."
fi

# Jalankan npm install
echo "Menjalankan npm install..."
npm install

# Update npm install
echo "Update npm Package..."
npm update

# upgrade npm package
echo "Update npm Package..."
npm upgrade

echo "Setup selesai."
