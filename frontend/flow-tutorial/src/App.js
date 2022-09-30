import './App.css';
import Navbar from './components/Navbar.jsx';
import MintComponent from './components/MintComponent.jsx';
import ShowNfts from './components/ShowNfts';

function App() {
  
  return (
    <div className="App">
      <Navbar />
      <h1>Mint your Dog!</h1>
      <MintComponent />
      <ShowNfts />
    </div>
  );
}

export default App;