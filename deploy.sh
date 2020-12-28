#!/usr/bin/env bash
docker build . -t hydro-tech
docker run --rm -p 0.0.0.0:5001:80 --name hydro_tech -d hydro-tech
docker system prune
