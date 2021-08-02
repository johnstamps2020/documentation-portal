# Config deployer

This tool allows you to manage configuration files for docs, sources, and builds. For example, you can use it to merge
several files and to update a property value for all items in a config file.

## Local package

You can build and install the tool locally using the source files in this repo.

### Requirements

- [Python 3.8 or later](https://www.python.org/downloads/)
- [Poetry  1.x](https://python-poetry.org/docs/)

### Build and install the local package

In `apps/config_deployer`, follow these steps:

1. Create a Python virtual environment. This step is not required, but it's a good practice.

    ```shell
    python -m venv config-deployer-venv
    ```

1. Activate the virtual environment.

    - macOS/Linux

    ```shell
    source config-deployer-venv/bin/activate
    ```

    - Windows CMD

    ```shell
    C:\> config-deployer-venv\Scripts\activate.bat
    ```

    - Windows PowerShell

    ```shell
    PS C:\> config-deployer-venv\Scripts\Activate.ps1
    ```

   > Note: On Microsoft Windows, it may be required to enable the Activate.ps1 script by setting the execution policy for the user. You can do this by issuing the following PowerShell command:
   `PS C:> Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`. See About Execution Policies for more information.

   The `(config-deployer-venv)` prefix appears in your terminal indicating that you are now in the virtual environment.
   For example:

   ```shell
   (config-deployer-venv) -> documentation-portal git:(dev-branch):
   ```

1. Build an installation package.

    ```shell
    poetry build
    ```

1. Install the package.

   ```shell
   pip install dist/config_deployer-2.0.0-py3-none-any.whl 
   ```

### Use the tool

After you install the local package, you can run the `config_deployer` tool from the Python virtual environment.

#### Examples

- To display the tool help, run:

   ```shell
   config_deployer -h
   ```

- To display help for a specific command, run:

   ```shell
   config_deployer commandName -h
   ```

  For example, to show help for the `merge` command, run:

   ```shell
   config_deployer merge -h
   ```

- To merge all config files
  in `/Users/mskowron/Documents/GIT-REPOS/documentation-portal/apps/config_deployer/input /docs`, run:

   ```shell
   config_deployer merge /Users/mskowron/Documents/GIT-REPOS/documentation-portal/apps/config_deployer/input/docs
   ```

  You can also provide a path relative to your current working directory. For example, if you are in
  the `/Users/mskowron/Documents/GIT-REPOS/documentation-portal/apps/config_deployer`
  directory, run:

   ```shell
   config_deployer merge input/docs
   ```

## Docker

You can use the tool by running it in a Docker container.

### Requirements

- [Docker](https://docs.docker.com/get-docker/)

### Download the image and create a container

1. Make sure the Docker Desktop app is running.

1. Log in to Guidewire Artifactory.

   ```shell
   docker login -u guidewireUsername --password guidewirePassword artifactory.guidewire.com
   ```

1. Download and tag the latest `config_deployer` image from Artifactory.

   ```shell
   docker pull artifactory.guidewire.com/doctools-docker-dev/config-deployer:latest && docker tag artifactory.guidewire.com/doctools-docker-dev/config-deployer:latest config-deployer:latest
   ```

1. Create a Docker container for the tool. By default, Docker containers do not have access to local files on your
   machine. Therefore, you need to mount a local directory in the container when you create it by using the `-v`
   option. This way, you will be able to pass input files to the container and access output files.

   ```shell
   docker create --name config_deployer_container -it -v pathToLocalDirectory:/opt/app config-deployer:latest
   ```

   For example, to mount `/Users/mskowron/Documents/GIT-REPOS/documentation-portal/apps/config_deployer` in the
   container, run:

   ```shell
   docker create --name config_deployer_container -it -v /Users/mskowron/Documents/GIT-REPOS/documentation-portal/apps/config_deployer:/opt/app config-deployer:latest
   ```

1. Start the Docker container.

   ```shell
   docker start config_deployer_container
   ```

### Use the tool

After you create a Docker container, you can run the `config_deployer` tool from the running container using the
`docker exec` command.

#### Examples

- To display the tool help, run:

   ```shell
   docker exec config_deployer_container config_deployer -h
   ```

- To display help for a specific command, run:

   ```shell
   docker exec config_deployer_container config_deployer commandName -h
   ```

  For example, to show help for the `merge` command, run:

   ```shell
   docker exec config_deployer_container config_deployer merge -h
   ```

- To merge all config files
  in `/Users/mskowron/Documents/GIT-REPOS/documentation-portal/apps/config_deployer/input/docs`, run:

   ```shell
   docker exec config_deployer_container config_deployer merge input/docs
   ```

  > IMPORTANT: The Docker container has access only to the mounted directory. Therefore, the path must be a relative
  > path inside the mounted directory.

### Manage the container

To conserve your local resources, you can:

- Stop the container when you don't need it.

    ```shell
    docker stop config_deployer_container
    ```

- Remove the container completely:

    ```shell
    docker stop config_deployer_container && docker rm config_deployer_container    
    ```

## Support

For any questions or suggestions, contact the Doc Tools team.