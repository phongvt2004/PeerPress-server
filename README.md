# Peer Press server

## Installation guide

Pull the project and create an environment file and configure:

### .env
```
PORT=3000
MONGO_URI=mongodb://db:27017/peer-press
REDIS_URL=redis://redis:6379
```
## Build and run

### Install docker

#### [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)
#### [Docker for Linux](https://docs.docker.com/desktop/install/linux-install/)
#### [Docker for Mac](https://docs.docker.com/desktop/install/mac-install/)

To verify that the Docker installation is done correctly, run these commands:

```bash
docker version
docker-compose version #on Windows or Mac
docker compose version #on Linux
```

### Start the server

```bash
docker-compose up
```

Then the server will be started on port ```3000```

### Stop the server

```bash
docker-compose down
```