cd app
docker build -t table-app:node .
cd ..
cd db
docker build -t db:mysql .
cd ..
kubectl apply -f storage.deployment.yml
kubectl apply -f mysql.deployment.yml
kubectl apply -f app.deployment.yml