build:
	docker-compose build --no-cache && docker-compose up --force-recreate --no-deps
clear:
	docker system prune
up:
	docker-compose down && docker-compose up