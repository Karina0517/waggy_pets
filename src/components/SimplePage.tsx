'use client';
import { useState } from 'react';
import Button from '../components/Button';
import Display from '../components/Display';

export default function SimplePage() {
  const [value, set] = useState(0);

  return (
    <div>
      <h1>Demo</h1>
      <Display value={value} />
      <Button label="+" onClick={() => set((v) => v + 1)} />
      <Button label="-" onClick={() => set((v) => v - 1)} />
    </div>
  );
}