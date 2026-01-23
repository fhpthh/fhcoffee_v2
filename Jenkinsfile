pipeline {
    agent {
        kubernetes {
            cloud 'cloud-typ'
            yamlFile 'kaniko-builder.yaml'
        }
    }

    environment {
        DOCKER_USER      = "huepth"
        APP_NAME         = "fhcoffee"
        
        GIT_CONFIG_REPO  = "github.com/fhpthh/fh-coffee-config.git"
        CONFIG_BRANCH    = "main"
        GIT_CRED_ID      = "my-github"

        BASE_IMAGE_BE    = "${DOCKER_USER}/${APP_NAME}-backend"
        BASE_IMAGE_FE    = "${DOCKER_USER}/${APP_NAME}-frontend"
        BASE_IMAGE_AD    = "${DOCKER_USER}/${APP_NAME}-admin"
    }

    stages {
        stage("Checkout Source Code") {
            steps {
                container('git') {
                    checkout scm
                }
            }
        }

        stage("Get Git Tag") {
            steps {
                container('git') {
                    script {
                        sh "git config --global --add safe.directory ${WORKSPACE}"
                        sh 'git fetch --tags'

                        def tagName = sh(
                            script: "git describe --tags --exact-match || true",
                            returnStdout: true
                        ).trim()

                        if (tagName) {
                            echo "Phat hien Tag: ${tagName} -> Bat dau build."
                            env.IMAGE_TAG = tagName
                        } else {
                            def commitHash = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
                            env.IMAGE_TAG = "dev-${commitHash}"
                            echo "Khong tim thay Tag. Su dung IMAGE_TAG: ${env.IMAGE_TAG}"
                        }
                    }
                }
            }
        }

        stage("Build & Push Backend Image") {
            steps {
                container('kaniko') {
                    echo "Building Backend... ${env.BASE_IMAGE_BE}:${env.IMAGE_TAG}"
                    sh """
                    /kaniko/executor \
                        --context ${WORKSPACE}/backend \
                        --dockerfile ${WORKSPACE}/backend/Dockerfile \
                        --destination=${env.BASE_IMAGE_BE}:${env.IMAGE_TAG}
                    """ 
                }
            }
        }

        stage("Build & Push Frontend Image") {
            steps {
                container('kaniko') {
                    echo "Building Frontend... ${env.BASE_IMAGE_FE}:${env.IMAGE_TAG}"
                    sh """
                    /kaniko/executor \
                        --context ${WORKSPACE}/frontend \
                        --dockerfile ${WORKSPACE}/frontend/Dockerfile \
                        --destination=${env.BASE_IMAGE_FE}:${env.IMAGE_TAG}
                    """ 
                 }
             }
         }

        stage("Build & Push Admin Image") {
            steps {
                container('kaniko') {
                    echo "Building Admin... ${env.BASE_IMAGE_AD}:${env.IMAGE_TAG}"
                    sh """
                    /kaniko/executor \
                        --context ${WORKSPACE}/admin \
                        --dockerfile ${WORKSPACE}/admin/Dockerfile \
                        --destination=${env.BASE_IMAGE_AD}:${env.IMAGE_TAG}
                    """ 
                 }
             }
        }

        stage("Update AgroCD") {
            steps {
                container('git') {
                  withCredentials([string(credentialsId: "${env.GIT_CRED_ID}", variable: 'GITHUB_TOKEN')]) {
                        dir('config-deploy-repo') {
                            sh """
                            git clone https://\$GITHUB_TOKEN@${env.GIT_CONFIG_REPO} .
                            
                            # Cap nhat tag moi cho tat ca service trong values-prod.yaml
                            sed -i "s/tag:.*/tag: ${env.IMAGE_TAG}/g" values-prod.yaml
                            
                            git config user.email "jenkins-bot@ci.com"
                            git config user.name "jenkins-bot"
                            
                            git add values-prod.yaml
                            git commit -m "Update image tag to ${env.IMAGE_TAG} [skip ci]" || echo "No changes"
                            git push origin ${env.CONFIG_BRANCH}
                            """
                        }
                    }
                }
            }
        }
    }

    post {
        success {
            echo "Pipeline hoan thanh thanh cong!"
        }
        failure {
            echo "Pipeline that bai. Kiem tra log cua cac container."
        }
        always {
            cleanWs()
        }
    }
}
