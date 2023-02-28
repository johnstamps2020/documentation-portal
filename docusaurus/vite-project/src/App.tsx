import './App.css';
import FeedbackExample from './components/FeedbackExample';
import LanguageDisplay from './components/LanguageDisplay';
import ViteHeader from './components/ViteHeader';

function App() {
  return (
    <div className="App">
      <ViteHeader />
      <LanguageDisplay />
      <FeedbackExample />
    </div>
  );
}

export default App;
