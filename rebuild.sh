#!/usr/bin/env bash
docker kill hydro_tech
docker rmi hydro-tech
docker system prune
bash deploy.sh
