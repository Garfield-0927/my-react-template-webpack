// src/app.tsx
import React from 'react';
import './App.less';
import HelloWorld from '@comp/HelloWorld/HelloWorld';

const App: React.FC<any> = () => {
  const a = 123;
  const b = 345;

  console.log(a);
  console.log(b);

  return (
    <div className="app">
      <HelloWorld />
    </div>
  );
};

export default App;
