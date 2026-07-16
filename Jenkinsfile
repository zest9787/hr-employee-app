pipeline {
  agent any
  environment {
    IMAGE_NAME = "hr-employee-app"
    NPM_CONFIG_USERCONFIG = ".npmrc"
  }
  stages {
    stage('Checkout') { steps { checkout scm } }
    stage('Node and pnpm') { steps { sh 'corepack enable && node -v && pnpm -v' } }
    stage('Nexus Auth') { steps { sh 'echo "@company:registry=$NEXUS_NPM_GROUP" > .npmrc' } }
    stage('Install') { steps { sh 'pnpm install --frozen-lockfile' } }
    stage('Quality') { steps { sh 'pnpm lint && pnpm type-check && pnpm test' } }
    stage('Build') { steps { sh 'pnpm build:production' } }
    stage('Docker Build') { steps { sh 'docker build -t $REGISTRY/$IMAGE_NAME:$VERSION -t $REGISTRY/$IMAGE_NAME:$VERSION-$GIT_COMMIT_SHORT .' } }
    stage('Push') { steps { sh 'docker push $REGISTRY/$IMAGE_NAME:$VERSION && docker push $REGISTRY/$IMAGE_NAME:$VERSION-$GIT_COMMIT_SHORT' } }
    stage('Deploy') { steps { sh 'kubectl set image deployment/$IMAGE_NAME $IMAGE_NAME=$REGISTRY/$IMAGE_NAME:$VERSION-$GIT_COMMIT_SHORT' } }
    stage('Health Check') { steps { sh 'kubectl rollout status deployment/$IMAGE_NAME || kubectl rollout undo deployment/$IMAGE_NAME' } }
  }
}
