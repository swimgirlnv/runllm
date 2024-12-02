// import React from 'react';
// import GameManager from './GameManager/GameManager';

// function App() {
//   return (
//     <div className="App">
//       <GameManager />
//     </div>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ConspiracyBoard from './pages/ConspiracyBoard';
import MainScene from './pages/MainScene';
import MonitorScene from './pages/MonitorScene';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainScene />} />
                <Route path="/conspiracy-board" element={<ConspiracyBoard />} />
                <Route path="/monitor" element={<MonitorScene />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;


