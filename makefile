build:
	docker-compose up --build --force-recreate --no-deps --no-cache
clear:
	docker system prune
up:
	docker-compose down && docker-compose up