pipeline {
  agent any
  stages {
    stage('Init') {
      steps {
        echo '$BRANCH_NAME'
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
