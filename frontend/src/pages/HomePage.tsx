import CategoryBar from "../components/CategoryBar/CategoryBar";
import ProductGrid from "../components/ProductGrid/ProductGrid";

function HomePage() {
    return (
        <div className="space-y-8">

            <CategoryBar />

            <ProductGrid />
        </div>
    );
}

export default HomePage;