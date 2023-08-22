import { useEffect } from 'react';
import './stylesheets/App.css';

function App() {
  useEffect(() => {
    fetch('http://localhost:8080/repos')
      .then((res) => res.json())
      .then((json) => {
        debugger;
      });
  }, []);

  return <div className="App">Hello from app</div>;
}

export default App;
