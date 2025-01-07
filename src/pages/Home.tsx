import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Product {
  id: number;
  title: string;
  price: number;
  images: string[];
}

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [imageCache, setImageCache] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const handleNavigate = (id: number) => {
    navigate(`/product/${id}`);
  };

  useEffect(() => {
    axios
      .get<{ products: Product[] }>("https://dummyjson.com/products")
      .then(async (response) => {
        const fetchedProducts = response.data.products;

        const cachedImages: Record<string, string> = {};

        const imagePromises = fetchedProducts.map(async (product) => {
          const cachedImage = localStorage.getItem(`image_${product.id}`);
          if (cachedImage) {
            cachedImages[product.id] = cachedImage;
          } else if (product.images[0]) {
            const base64Image = await fetchImageAsBase64(product.images[0]);
            localStorage.setItem(`image_${product.id}`, base64Image);
            cachedImages[product.id] = base64Image;
          }
        });

        await Promise.all(imagePromises);

        setProducts(fetchedProducts);
        setImageCache(cachedImages);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setError("Failed to load products.");
        setLoading(false);
      });
  }, []);

  const fetchImageAsBase64 = async (imageUrl: string): Promise<string> => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  };

  return (
    <div>
      <h1>Awesome Product Page</h1>
      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <div>
          <p style={{ color: "red" }}>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      ) : (
        <ul
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            listStyleType: "none",
            padding: "0",
          }}
        >
          {products.map((product) => (
            <li
              key={product.id}
              style={{
                border: "1px solid #ddd",
                padding: "10px",
                width: "200px",
                textAlign: "center",
              }}
              onClick={() => handleNavigate(product.id)}
            >
              <span>
                {product.title} - ${product.price}
              </span>
              <img
                src={imageCache[product.id] || product.images[0]}
                alt={product.title}
                style={{ maxWidth: "100%", height: "auto", cursor: "pointer" }}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Home;
