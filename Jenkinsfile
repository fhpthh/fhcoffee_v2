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
        GIT_CRED_ID      = "my-github"
        BASE_IMAGE_BE    = "${DOCKER_USER}/${APP_NAME}-backend"
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
                            echo "Phát hiện Tag: ${tagName}"
                            env.IMAGE_TAG = tagName
                        } else {
                            // Cải tiến: Nếu không có tag, lấy 7 ký tự commit hash để TEST
                            def commitHash = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
                            env.IMAGE_TAG = "test-${commitHash}"
                            echo "⚠hông có Tag. Sử dụng tag tạm thời: ${env.IMAGE_TAG} để build."
                        }
                    }
                }
            }
        }

        stage("Build & Push Backend") {
            steps {
                container('kaniko') {
                    echo "Đang build Backend Image: ${env.BASE_IMAGE_BE}:${env.IMAGE_TAG}"
                    // Kaniko sẽ tìm file Dockerfile nằm trong thư mục backend của bạn
                    sh """
                    /kaniko/executor \
                        --context=${WORKSPACE}/backend \
                        --dockerfile=${WORKSPACE}/backend/Dockerfile \
                        --destination=${env.BASE_IMAGE_BE}:${env.IMAGE_TAG}
                    """
                }
            }
        }
    }

    post {
        success {
            echo "Test Backend thành công! Image đã đẩy lên Docker Hub."
        }
        failure {
            echo "Test Backend thất bại. Hãy kiểm tra lại file Dockerfile hoặc Secret."
        }
    }
}
