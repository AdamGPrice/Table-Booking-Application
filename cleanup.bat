kubectl delete -f mysql.deployment.yml
kubectl delete -f app.deployment.yml
kubectl delete pvc mysql-claim
kubectl delete pvc pictures-claim