docker run --name docportal-db --rm \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=testtesttest \
  -e PGDATA=/var/lib/postgresql/data/pgdata \
  -v /tmp:/var/lib/postgresql/data \
  -p 5432:5432 \
  -it postgres:14.1-alpine