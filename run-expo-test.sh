#!/bin/bash

# Navigate to template directory
cd template

# Install expo and other required dependencies
npm install --legacy-peer-deps expo expo-cli metro react-native-web@0.18.10

# Make sure we have the specific version of metro that Expo needs
npm install --legacy-peer-deps metro@0.76.0 metro-core@0.76.0 metro-runtime@0.76.0

# Start the expo development server
npx expo start --web 