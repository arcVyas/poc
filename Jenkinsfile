pipeline {
  agent any
  stages {
    stage('Checkout') {
      steps {
        echo '${env.BRANCH_NAME}'
      }
    }
    stage('Sanity Check') {
      when {
        expression {
          env.BRANCH_NAME.contains('master')
        }
        
      }
      steps {
        echo 'Hello, Master!'
      }
    }
    stage('Build') {
      steps {
        sh 'echo "i"'
      }
    }
    stage('Unit Test') {
      steps {
        echo 'hello'
      }
    }
    stage('Integration Test') {
      steps {
        echo 'hi'
      }
    }
    stage('Static Code Analysis') {
      steps {
        echo 'hi'
      }
    }
    stage('Sonar Quality Gate') {
      steps {
        echo 'hi'
      }
    }
    stage('Deploy to QA (Skytap)') {
      steps {
        parallel(
          "Deploy to QA (Skytap)": {
            echo 'h'
            
          },
          "Deploy to PERF (Skytap)": {
            echo 'h'
            
          }
        )
      }
    }
    stage('Deployment Approval?') {
      steps {
        input 'hi'
      }
    }
    stage('Deploy to PROD (Skytap)') {
      steps {
        echo 's'
      }
    }
    stage('Validate Deployment') {
      steps {
        echo 's'
      }
    }
    stage('Label') {
      steps {
        echo 'h'
      }
    }
  }
}