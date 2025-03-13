import React, { useState, useEffect } from 'react';
import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect to the tabs home screen
  return <Redirect href="/(tabs)" />;
} 