pipeline {
    agent any
    parameters {
        choice(
            // choices are a string of newline separated values
            // https://issues.jenkins-ci.org/browse/JENKINS-41180
            choices: 'greeting\nsilence',
            description: '',
            name: 'REQUESTED_ACTION')
    }

    stages {
        stage ('Init'){
            echo $env.BRANCH_NAME
        }
        stage ('Speak') {
            when {
                // Only say hello if a "greeting" is requested
                expression { env.BRANCH_NAME.contains('master')}
            }
            steps {
                echo "Hello, Master!"
            }
        }
    }
}
