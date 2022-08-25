build:
	docker-compose up --build --force-recreate --no-deps
clear:
	docker system prune
up:
	docker-compose down && docker-compose up