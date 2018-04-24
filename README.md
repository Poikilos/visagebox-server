# visagebox
A LOW-security photo booth for minimalistic programmers

## First-time setup
### Fedora
```
sudo dnf install nodejs
if [ ! -f "app.js" ]; then
  echo "This script must be run from the visagebox project's root directory."
  exit 1
fi
npm install
if [ -f "`command -v ufw`" ]; then
  sudo ufw allow 8086
fi
if [ -f "`command -v firewall-cmd`" ]; then
  sudo firewall-cmd --permanent --add-port=8086/tcp
  sudo firewall-cmd --permanent --zone=public --add-port=8086/tcp
  sudo systemctl stop firewalld
  sudo systemctl start firewalld
fi
```

## Developer notes

### Creating the project
(do not do the steps below!)
```
npm init
#NOTE: npm>=5 save by default
npm install express --save
npm install body-parser --save
npm install errorhandler --save
npm install node-webcam --save
npm install express-session --save
npm install moment-timezone --save
npm install cookie-parser --save
npm install fs --save
npm install morgan --save
npm install method-override --save
```
