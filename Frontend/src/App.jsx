import { useState } from 'react';
import customRoute from './routes/customRoute.jsx';
import { Toaster } from 'react-hot-toast';
import Chatbot from './components/Chatbot';

function App() {
    const routes = customRoute();
    return (
        <div>
            {routes}
            <Toaster />
            {/* <Chatbot /> */}
        </div>
    );
}

export default App;
