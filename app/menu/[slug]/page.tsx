import { fetchRestaurantBySlug } from '@/lib/data';
import { RestaurantMenuClient } from '@/components/menu/RestaurantMenuClient';
import { Metadata } from 'next';
import Link from 'next/link';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await fetchRestaurantBySlug(slug);

  if (!data) {
    return {
      title: 'Menu Not Found',
    };
  }

  return {
    title: `${data.restaurant.name} | Digital Menu`,
    description: data.restaurant.description,
  };
}

export default async function RestaurantPage({ params }: Props) {
  const { slug } = await params;
  const data = await fetchRestaurantBySlug(slug);

  if (!data || !data.restaurant.active) {
    return (
      <div className="min-h-screen bg-stone-100 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-xs bg-white rounded-2xl p-6 shadow-md border border-stone-200 space-y-3">
          <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
            🍽️
          </div>
          <h1 className="text-lg font-bold text-stone-900">Restaurant Not Found</h1>
          <p className="text-xs text-stone-600 leading-relaxed">
            The menu you are looking for is currently unavailable or the link has expired.
          </p>
          <Link
            href="/"
            className="inline-block w-full py-2.5 bg-stone-900 text-white text-xs font-semibold rounded-xl"
          >
            Explore Demo Menus
          </Link>
        </div>
      </div>
    );
  }

  return <RestaurantMenuClient initialData={data} />;
}
