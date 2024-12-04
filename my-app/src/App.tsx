import React from 'react';
import MainScene from './pages/MainScene';
import TestScene from './models/TestScene';

const App: React.FC = () => {
    return (
    <>
    <TestScene />
    <MainScene />
    </>
    );
};

export default App;