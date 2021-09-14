# Build manager

The build manager app works with the build API of the admin server to trigger and monitor relevant builds.

The app:

1. Checks which files changed.
2. Checks which docs were affected by the changes and triggers builds for them.
3. Monitors the status of the triggered builds to make sure all of them finished.