NAME = cardgame

all:
	@bash start.sh

up:
	@docker compose up -d

down:
	@docker compose down

logs:
	@docker compose logs -f web

# Stop containers and remove networks/orphans
clean:
	@docker compose down --remove-orphans

# Full reset: stops containers, removes images, and wipes database volumes
fclean:
	@docker compose down -v --rmi all --remove-orphans

# Rebuild everything from scratch
re: fclean all

.PHONY: all up down logs clean fclean re