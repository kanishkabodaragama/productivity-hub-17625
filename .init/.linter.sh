#!/bin/bash
cd /home/kavia/workspace/code-generation/productivity-hub-17625/taskmaster_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

