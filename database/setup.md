echo "deb [ arch=amd64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

sudo apt update

sudo apt install -y mongodb-org

sudo systemctl start mongod
sudo systemctl enable mongod

sudo systemctl status mongod


## Test oe mandeha ve 

show dbs
