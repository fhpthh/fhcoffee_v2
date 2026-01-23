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
                        sh 'git fetch --tags'
                        def tagName = sh(
                            script: "git describe --tags --exact-match || true",
                            returnStdout: true
                        ).trim()

                        if (tagName) {
                            echo "Phát hiện Tag: ${tagName} => Bắt đầu build."
                            env.IMAGE_TAG = tagName
                        } else {
                            echo "Lỗi: Commit hiện tại không được gắn Tag."
                            currentBuild.result = 'ABORTED'
                            error("Pipeline dừng vì không có Tag phù hợp.")
                        }
                    }
                }
            }
        }

    }

    post {
        success {
            echo "Pipeline hoàn thành thành công!"
        }
        failure {
            echo "Pipeline thất bại. Kiểm tra log của các container."
        }
        always {
            cleanWs()
        }
    }
}
