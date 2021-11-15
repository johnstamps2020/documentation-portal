# Working with Python apps in this project

To develop Python apps in this project, you need [the `Poetry` tool](https://python-poetry.org/), which manages
dependencies and virtual environments. Python SDKs are already defined for modules in this IntelliJ IDEA project. You
only need to configure `Poetry` and then use its feature for installing dependencies in a virtual environment.

## Install and configure Poetry

1. Install `Poetry` by following the instructions in
   the [official documentation](https://python-poetry.org/docs/#installation).
2. Configure the tool to create the virtual environment inside the root directory of the project.

    ```shell
     poetry config virtualenvs.in-project true
    ```

## Install dependencies for a Python app

1. Go to the root directory of the Python app. It is the directory where the `pyproject.toml` file is located.
2. Delete any existing Python virtual environments. They are usually stored in `venv` or `.venv` directories.
3. Install the app dependencies.

    ```shell
    poetry install
    ```
   The virtual environment is created as the `.venv` directory.

## Run a Python app

1. Go to the root directory of the Python app. It is the directory where the `pyproject.toml` file is located.
2. Make sure the `.venv` directory is present. If not, follow the steps in the "Install dependencies for a Python app"
   section.
3. Run the app in the virtual environment.

    ```shell
    poetry run python pathToPythonFile
    ```

   For example

    ```shell
    poetry run python build_manager/main.py
    ```
