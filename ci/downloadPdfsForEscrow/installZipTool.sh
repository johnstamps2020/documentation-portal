#!/usr/bin/env bash

# The atmosdeploy:2.6.0 Docker image is based on Amazon Corretto Linux, which doesn't have the zip tool installed.
# There's an issue with the local SSL certificate that prevents installation of the tool using the yum package manager.
# A quick fix is to disable the SSL verification in the yum config.

echo "Disabling the SSL verification in the yum config"
echo "sslverify=false" >>/etc/yum.conf
echo "Installing the zip tool"
yum install -y zip
