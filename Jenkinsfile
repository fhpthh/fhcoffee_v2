pipeline {
  agent {
    kubernetes {
      cloud 'k3s-cloud'
      yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: git
    image: alpine/git
    command: ["sleep"]
    args: ["999999"]
    volumeMounts:
    - name: workspace
      mountPath: /workspace

  - name: kaniko
    image: gcr.io/kaniko-project/executor:v1.22.0-debug
    command: ["sleep"]
    args: ["999999"]
    volumeMounts:
    - name: workspace
      mountPath: /workspace
    - name: docker-config
      mountPath: /kaniko/.docker/

  volumes:
  - name: workspace
    emptyDir: {}
  - name: docker-config
    secret:
      secretName: dockerhub-creds
      items:
      - key: .dockerconfigjson
        path: config.json
"""
    }
  }

  environment {
    DOCKER_USER   = "huepth"
    APP_NAME      = "fhcoffee"
    CONFIG_BRANCH = "main"
  }

  stages {

    stage("Checkout Source Code") {
      steps {
        container('git') {
          checkout scm
          sh "cp -r . /workspace"
        }
      }
    }

    stage("Get Git Tag") {
      steps {
        container('git') {
          script {
            env.IMAGE_TAG = sh(
              script: "git describe --tags --abbrev=0",
              returnStdout: true
            ).trim()

            if (!IMAGE_TAG) {
              error("Không tìm thấy Git Tag – pipeline chỉ chạy khi có TAG")
            }

            echo "Using image tag: ${IMAGE_TAG}"
          }
        }
      }
    }

    stage("Build & Push Backend Image") {
      steps {
        container('kaniko') {
          sh """
          /kaniko/executor \
            --context=/workspace/backend \
            --dockerfile=/workspace/backend/Dockerfile \
            --destination=${DOCKER_USER}/${APP_NAME}-backend:${IMAGE_TAG}
          """
        }
      }
    }

    stage("Build & Push Frontend Image") {
      steps {
        container('kaniko') {
          sh """
          /kaniko/executor \
            --context=/workspace/frontend \
            --dockerfile=/workspace/frontend/Dockerfile \
            --destination=${DOCKER_USER}/${APP_NAME}-frontend:${IMAGE_TAG}
          """
        }
      }
    }

    stage("Update Config Repo (Helm)") {
      steps {
        container('git') {
          withCredentials([string(
            credentialsId: 'github-token',
            variable: 'GITHUB_TOKEN'
          )]) {
            sh """
            git clone https://\$GITHUB_TOKEN@github.com/fhpthh/fh-coffee-config.git
            cd fh-coffee-config

            sed -i "s/tag:.*/tag: ${IMAGE_TAG}/g" values-prod.yaml

            git config user.email "jenkins@ci.com"
            git config user.name "jenkins"

            git add values-prod.yaml
            git commit -m "Update image tag ${IMAGE_TAG}"
            git push origin ${CONFIG_BRANCH}
            """
          }
        }
      }
    }
  }

  post {
    success {
      echo "🎉 Pipeline succeeded!"
    }
    always {
      echo "Pipeline completed."
      cleanWs()
    }
  }
}
