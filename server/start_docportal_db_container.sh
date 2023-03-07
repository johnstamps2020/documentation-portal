echo "!!!!!!!!!!!!!!!!!!!"
echo "If the DB does not work, try removing your local postgres files `rm -rf /private/tmp/pgdata`"
echo "!!!!!!!!!!!!!!!!!!!"

export container_name="docportal-db"

if [ "$( docker container inspect -f '{{.State.Status}}' $container_name )" == "running" ]; then
  docker run --name $container_name \
    -e POSTGRES_USER=postgres \
    -e POSTGRES_PASSWORD=testtesttest \
    -e PGDATA=/var/lib/postgresql/data/pgdata \
    -v /tmp:/var/lib/postgresql/data \
    -p 5432:5432 \
    postgres:14.1-alpine
else
  docker start $container_name -a
fi
