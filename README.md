# pkg-nodejs
How to make executable file of web application (NodeJS based projects) using npm pkg ?

## Advantage
After making executable file, You can execute file without using the nodejs server

## How to setup:
1. Install pkg library globally: npm i -g pkg 
2. Clone or download the repository
3. cd pkg-nodejs
4. Install all dependency: npm i
5. Make executable:-
 
- nodeRange node${n} or latest → In our case was node10
- platform freebsd, linux, alpine, macos, win → In our case linux
- arch x64, x86, armv6, armv7 → In our case x64

linux command: pkg . --targets node10-linux-x64
windows command: pkg . --targets node10-win-x64
macos: pkg . --targets node10-macos-x64

6. Run Executable in linux: 
 Executable access: sudo chmod +x ./pkg-nodejs   //(file path=./pkg-nodejs)
 Run: sudo ./pkg-nodejs 