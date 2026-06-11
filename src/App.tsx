import Calendar from './components/Calendar'
import './App.css'

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Lloyd&apos;s Dashboard</h1>
        <p className="app-subtitle">Your personal calendar</p>
      </header>
      <main className="app-main">
        <Calendar />
      </main>
    </div>
  )
}
