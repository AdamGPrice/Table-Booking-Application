# About the Project
Table booking web application for bars/pubs to use to upgrade their existing booking solutions
built with NodeJS and MySQL for the server-side which implements a secure REST service using json web tokens for user authentication, 
and the client-side is built with HTML and JQuery. The entire project can be deployed and configured using Kubernetes. 
The app was made for a distributed systems module at university to demonstrate capabilities of creating a reliable and scalable web application deployed on a server 
using container orchestration.
Table booking application for pubs and bars

## deployment
### local/dev
For local machine deployment (requires docker installed).
1. docker-compose up --build
2. cd /app
3. npm run dev

### production
There are four batch files provided which contain kubernetes scripts for easy deployment
1. Buildandstart.bat - Builds the application and database container images and deploys
2. Start.bat - Deploy or update kubernetes configuration settings.
3. Stop.bat - Shutdown the app and any associated running pods on kubernetes.
4. Cleanup.bat - Shutdown the app and remove the kubernetes pods and deployment along with persistent volumes.
