You need an environment variable called `NPM_AUTH_TOKEN` to start server
locally. If you do not plan to run your site locally (which we do not recommend)
you can skip this step.

To get the token:

1. From your Okta home, log into Artifactory.
2. In the top right-hand corner, click your username and select **Edit
   profile**.
3. Either copy an existing token, or click **Generate an identity token** and
   copy that.
4. Set the token as the value of an environment variable called
   `NPM_AUTH_TOKEN`.
5. Restart your terminal, if necessary.
