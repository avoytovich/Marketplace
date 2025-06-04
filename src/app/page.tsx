import Link from 'next/link';

export default function HomePage() {
  return (
    <section className="text-center py-20">
      <h1 className="text-4xl font-bold mb-4">Welcome to BuySellHub</h1>
      <p className="text-lg text-gray-600 mb-6">
        A simple platform to connect buyers and sellers through custom requests
        and offers.
      </p>
      <Link
        href="/discovery"
        className="inline-block bg-blue-600 text-white px-6 py-3 mx-6 rounded hover:bg-blue-700"
      >
        Browse a Buyer's Requests
      </Link>
      <Link
        href="/request"
        className="inline-block bg-blue-600 text-white px-6 py-3 mx-6 rounded hover:bg-blue-700"
      >
        Post Request as a Buyer
      </Link>
    </section>
  );
}
