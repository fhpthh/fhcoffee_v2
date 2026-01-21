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
    command: ["sleep"]
    args: ["9999999"]
    volumeMounts:
    - name: docker-config
      mountPath: /kaniko/.docker/
    volumes:
  - name: docker-config
    secret:
      secretName: dockerhub-secret 
      items:
      - key: .dockerconfigjson
        path: config.json
"""
        }
    }
    stages {
        stage('Test: Kaniko & Secret') {
            steps {
                container('kaniko') {
                    script {
                        echo "--- Kiểm tra file cấu hình Docker trong Kaniko ---"
                        sh "ls -la /kaniko/.docker/"
                        
                        sh "cat /kaniko/.docker/config.json | grep 'auth' || echo 'Không tìm thấy chuỗi auth'"
                    }
                }
            }
        }
    }
}
