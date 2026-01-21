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
    image: gcr.io/kaniko-project/executor:v1.22.0-debug
    command: ["sleep"]
    args: ["999999"]
    volumeMounts:
      - name: docker-config
        mountPath: /kaniko/.docker/
  volumes:
    - name: docker-config
      secret:
        secretName: dockerhub-creds # <-- Kiểm tra kỹ tên Secret này trong K8s
        items:
          - key: .dockerconfigjson
            path: config.json
"""
        }
    }

    stages {
        stage('Test: Git & Environment') {
            steps {
                script {
                    checkout scm
                    sh "git fetch --tags"
                    
                    def tagName = sh(script: 'git describe --tags --exact-match || echo "NO_TAG"', returnStdout: true).trim()
                    
                    echo "---------------------------------------"
                    echo "Kết quả kiểm tra Tag: ${tagName}"
                    echo "Thư mục hiện tại: ${WORKSPACE}"
                    echo "---------------------------------------"
                    
                    if (tagName == "NO_TAG") {
                        echo "Lưu ý: Bạn chưa gắn Tag cho commit này. Kaniko sẽ không có tag để build."
                    }
                }
            }
        }

        stage('Test: Docker Config') {
            steps {
                container('kaniko') {
                    sh "cat /kaniko/.docker/config.json"
                    echo "Môi trường Kaniko đã sẵn sàng!"
                }
            }
        }
    }
}
