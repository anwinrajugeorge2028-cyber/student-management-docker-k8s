# Student Manager — Docker & Kubernetes Assignment

A lightweight student-record management demo built with HTML, CSS, JavaScript, and Nginx. It supports adding, editing, deleting, searching, and status filtering of student records. Data is saved in the current browser's local storage.

> **Important limitation:** This is a front-end demonstration. Browser local storage is not a shared database, is not secure for real student information, and records do not automatically synchronize across devices or browsers.

## Project files

- `index.html` — application structure
- `styles.css` — responsive styling
- `app.js` — CRUD actions and browser local storage
- `Dockerfile` — builds a small Nginx image
- `kubernetes/deployment.yaml` — one-replica deployment with resource limits
- `kubernetes/service.yaml` — internal service

## Run locally with Docker

From this directory:

```bash
sudo docker build -t student-manager:1.0 .
sudo docker run -d --name student-manager-web -p 8080:80 student-manager:1.0
```

Open <http://localhost:8080>.

Check and stop:

```bash
sudo docker ps
sudo docker logs student-manager-web
sudo docker stop student-manager-web
```

If the container name is already in use, remove the old container and rerun:

```bash
sudo docker rm -f student-manager-web
sudo docker run -d --name student-manager-web -p 8080:80 student-manager:1.0
```

## Local Kubernetes with K3s

K3s consumes RAM in addition to Docker and desktop applications. On a laptop with around 4 GB RAM, close unnecessary applications and monitor `free -h`. Do not install K3s and Minikube together.

After K3s is installed and running, load the locally built image into containerd (K3s uses containerd, not the Docker daemon's image store):

```bash
sudo docker save student-manager:1.0 -o /tmp/student-manager.tar
sudo k3s ctr images import /tmp/student-manager.tar
sudo k3s kubectl apply -f kubernetes/deployment.yaml
sudo k3s kubectl apply -f kubernetes/service.yaml
sudo k3s kubectl rollout status deployment/student-manager
sudo k3s kubectl get pods,services
```

Access the service locally using port-forwarding:

```bash
sudo k3s kubectl port-forward service/student-manager 8081:80
```

Keep that terminal running, then open <http://localhost:8081>. Stop port-forwarding with `Ctrl+C`.

## Public hosting

For a public Kubernetes deployment, the cluster must be able to pull the image from a container registry. Push the image to a registry such as GitHub Container Registry (GHCR), then change `image:` in `kubernetes/deployment.yaml` to the published image name and set `imagePullPolicy: IfNotPresent` or `Always` appropriately. Configure the cloud provider's ingress/load balancer and DNS/HTTPS as required.

A locally running K3s service is not public by default. Do not expose a development laptop directly to the internet for a class assignment. Cloud providers may require billing details or charge for compute, load balancers, storage, or bandwidth; check costs before creating resources.

## Evidence for the assignment

Capture screenshots of:
1. `sudo docker images`
2. `sudo docker ps`
3. The app in the browser at `http://localhost:8080`
4. `sudo k3s kubectl get nodes`
5. `sudo k3s kubectl get pods,services`
6. The app opened via the Kubernetes port-forward URL

## Reset demo records

Use the “Reset demo data” button in the app. Records are browser-specific and can also be cleared by clearing site data in the browser.
