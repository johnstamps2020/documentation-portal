container_name="docportal-db"
db_volume_name="dev_db_volume"

docker volume create --name $db_volume_name
echo "The database volume is ready"

docker start $container_name || docker run --detach --name $container_name \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=testtesttest \
  -e PGDATA=/var/lib/postgresql/data/pgdata \
  -v $db_volume_name:/var/lib/postgresql/data \
  -p 5432:5432 \
  postgres:13.9-alpine
echo "The database container is ready"