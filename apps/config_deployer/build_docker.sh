cp ../../.teamcity/config/config-schema.json config_deployer/
docker image build --no-cache -t config-deployer .