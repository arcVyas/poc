pipeline {
  agent any
  stages {
    stage('Init') {
      steps {
        echo env.BRANCH_NAME
      }
    }
    stage('Speak') {
      when {
        expression {
          env.BRANCH_NAME.contains('master')
        }
      }
      steps {
        echo 'Hello, Master!'
      }
    }
  }
}
