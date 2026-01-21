pipeline {
    agent {
        kubernetes {
            cloud 'k3s-cloud'
            yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: kaniko
    image: gcr.io/kaniko-project/executor:debug
    imagePullPolicy: IfNotPresent
    command: ["sleep"]
    args: ["999999"]
    volumeMounts:
    - name: docker-config
      mountPath: /kaniko/.docker/
  volumes:
  - name: docker-config
    secret:
      secretName: dockerhub-creds
      items:
      - key: .dockerconfigjson
        path: config.json
"""
        }
    }
    stages {
        stage('Test Kaniko Environment') {
            steps {
                container('kaniko') {
                    // Chỉ kiểm tra xem có thấy file secret không
                    sh "ls -la /kaniko/.docker/"
                    sh "cat /kaniko/.docker/config.json"
                }
            }
        }
    }
}
