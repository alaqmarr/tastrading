import prisma from "@/lib/prisma";
import HeroCarousel from "@/components/HeroCarousel";
import ProductCard from "@/components/ProductCard";
import BrandCard from "@/components/BrandCard";
import CategoryCard from "@/components/CategoryCard";
import Link from "next/link";

// Revalidate home page every 5 minutes for fresh content
export const revalidate = 300;

async function getHomeData() {
  // Get total count first for random offset
  const totalProducts = await prisma.product.count({
    where: { isArchived: false },
  });

  // Calculate random skip for variety (but ensure we get 8 products)
  const maxSkip = Math.max(0, totalProducts - 8);
  const randomSkip = Math.floor(Math.random() * maxSkip);

  const [featuredProducts, brands, categories] = await Promise.all([
    prisma.product.findMany({
      where: { isArchived: false },
      include: {
        images: { take: 1 },
        brand: { select: { name: true } },
        category: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: randomSkip,
      take: 8,
    }),
    prisma.brand.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    }),
    prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    }),
  ]);

  return { featuredProducts, brands, categories };
}

export default async function HomePage() {
  const { featuredProducts, brands, categories } = await getHomeData();

  return (
    <>
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-emerald-600 font-medium text-sm tracking-wide uppercase">
                About TAS Trading
              </span>
              <h2 className="mt-3 text-4xl font-bold text-gray-900 leading-tight">
                Industrial Excellence <br />
                <span className="gradient-text">Since 1968</span>
              </h2>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                Established in 1968, TAS Trading Corporation has grown to become
                a leading trader and supplier of premium industrial tools and
                equipment in Andhra Pradesh & Telangana.
              </p>
              <p className="mt-4 text-gray-600 leading-relaxed">
                We source our entire product line from renowned and globally
                trusted manufacturers including <strong>Dormer</strong>,{" "}
                <strong>Mitsubishi</strong>, <strong>Sandvik</strong>,{" "}
                <strong>Fenner</strong>, and <strong>Gates</strong>. Our
                products are known for their high reliability, precise
                operations, and long service life.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white font-medium rounded-full hover:bg-emerald-700 transition-all"
                >
                  Learn More
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-200 text-gray-700 font-medium rounded-full hover:border-emerald-500 hover:text-emerald-600 transition-all"
                >
                  Contact Us
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-50 rounded-2xl p-6 text-center">
                <div className="text-4xl font-bold text-emerald-600">56+</div>
                <div className="text-gray-600 mt-2">Years of Excellence</div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-6 text-center">
                <div className="text-4xl font-bold text-emerald-600">5+</div>
                <div className="text-gray-600 mt-2">Premium Brands</div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-6 text-center">
                <div className="text-4xl font-bold text-emerald-600">3</div>
                <div className="text-gray-600 mt-2">Office Locations</div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-6 text-center">
                <div className="text-4xl font-bold text-emerald-600">1000+</div>
                <div className="text-gray-600 mt-2">Happy Clients</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-emerald-600 font-medium text-sm tracking-wide uppercase">
              Our Products
            </span>
            <h2 className="mt-3 text-3xl font-bold text-gray-900">
              Featured Products
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Explore our range of high-quality industrial tools and equipment
            </p>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    ...product,
                    price: product.price ? Number(product.price) : null,
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>Products coming soon...</p>
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-medium rounded-full hover:bg-gray-800 transition-all"
            >
              View All Products
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-emerald-600 font-medium text-sm tracking-wide uppercase">
              Trusted Partners
            </span>
            <h2 className="mt-3 text-3xl font-bold text-gray-900">
              Premium Brands We Carry
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              We partner with globally recognized brands to bring you the best
              quality products
            </p>
          </div>

          {brands.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {brands.map((brand, index) => (
                <BrandCard key={brand.id} brand={brand} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>Brands coming soon...</p>
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-emerald-400 font-medium text-sm tracking-wide uppercase">
              Product Range
            </span>
            <h2 className="mt-3 text-3xl font-bold text-white">
              Explore Categories
            </h2>
            <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
              Browse our comprehensive range of industrial tools and equipment
            </p>
          </div>

          {categories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <p>Categories coming soon...</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 to-emerald-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-emerald-100 text-lg mb-8 max-w-2xl mx-auto">
            Contact us today for a quote or to learn more about our products.
            Our team is ready to help you find the right tools for your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-emerald-700 font-semibold rounded-full hover:bg-gray-100 transition-all shadow-lg"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              Get a Quote
            </Link>
            <a
              href="tel:9391057437"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-all"
            >
              Call: 9391057437
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
