pipeline {
    agent {
        kubernetes {
            cloud 'k3s-cloud'
            yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: test-shell
    image: busybox
    command: ["sleep"]
    args: ["3600"]
"""
        }
    }
    stages {
        stage('Test Connection') {
            steps {
                container('test-shell') {
                    sh 'echo "Ket noi thanh cong qua WebSocket!"'
                }
            }
        }
    }
}
