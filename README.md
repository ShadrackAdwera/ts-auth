# Auth

## The Idea

- Provide users with an access token and a refresh token upon authentication. 
- On the React App (later on though), request for a new access token using the refresh token once the current one is expired, instead of autologging the user out.
- Blacklist refresh tokens for whatever reason.
- Honourable Mention: Password change logic.

## Technologies Used
- MongoDB - It has always been NoSQL and this is the best to ever do it.
- Express - Listen to and parse requests
- NodeJS - Well . . . 
- JWT - Generate access and refresh tokens
- Redis - In memory Data Structure - to store refresh tokens.
- Docker - Yes, Docker.
- Kubernetes - Orchestrate, Orchestrate, Orchestrate . . . 