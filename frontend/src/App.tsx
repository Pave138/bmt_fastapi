import Header from "./components/Header";
import HomePage from "./pages/HomePage";

function App() {
    return (
        <div className="min-h-screen bg-gray-100">
            <Header />

            <main className="mx-auto max-w-7xl p-8">
                <HomePage />
            </main>
        </div>
    );
}

export default App;