pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        sh 'echo \'Build project\''
      }
    }
    stage('Test') {
      steps {
        parallel(
          "Test": {
            echo 'Test 1'
            echo 'Test 2'
            
          },
          "Test 2": {
            echo 'Parallel Test1'
            
          }
        )
      }
    }
    stage('Deploy') {
      steps {
        echo 'Deployed'
      }
    }
  }
}