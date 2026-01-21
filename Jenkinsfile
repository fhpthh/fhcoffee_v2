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
        stage('Check Pod creation') {
            steps {
                container('test-shell') {
                    sh 'echo "Pod da duoc tao thanh cong tren K3s!"'
                    sh 'date'
                }
            }
        }
    }
}
