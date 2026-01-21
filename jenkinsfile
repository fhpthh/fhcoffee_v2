pipeline {
    agent any

    environment {
        DOCKER_USER   = "huepth"
        APP_NAME      = "fhcoffee"
        CONFIG_REPO   = "https://github.com/fhpthh/fh-coffee-config.git"
        CONFIG_BRANCH = "main"
    }

    stages {

        stage("Checkout Source Code") {
            steps {
                checkout scm
            }
        }

        stage("Get Git Tag") {
            steps {
                script {
                    IMAGE_TAG = sh(
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

        stage("Docker Login") {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh """
                    echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin
                    
                    docker build -t ${DOCKER_USER}/${APP_NAME}-backend:${IMAGE_TAG} ./backend
                    docker push ${DOCKER_USER}/${APP_NAME}-backend:${IMAGE_TAG}

                    docker build -t ${DOCKER_USER}/${APP_NAME}-frontend:${IMAGE_TAG} ./frontend
                    docker push ${DOCKER_USER}/${APP_NAME}-frontend:${IMAGE_TAG}
                    """
                }
            }
        }

        
        stage("Update Config Repo (Helm)") {
            steps {
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
                    git commit -m "Update backend image tag ${IMAGE_TAG}"
                    git push origin ${CONFIG_BRANCH}
                    """
                }
            }
        }
    }

    post {
        always {
            echo "Pipeline completed."
            sh "docker logout"
            cleeanWs()
        }
        success {
            echo "Pipeline succeeded!"
        }
    }
}
