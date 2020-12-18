cd app
docker build -t table-app:node .
cd ..
cd db
docker build -t db:mysql .
cd ..
kubectl create secret generic app-secrets --from-literal=dbpassword=supersecret --from-literal=jwttoken=b1a3923cc1e1e19523fd5c3f20b409501e1e19523923cc --from-literal=passhash=JiSAZCDKf1isqNNDxmg3aJXEcI5bmAhTMxX4ynWCVcJcmzH
kubectl apply -f storage.deployment.yml
kubectl apply -f mysql.deployment.yml
kubectl apply -f app.deployment.yml