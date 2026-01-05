import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import { properties } from '@/data/properties';
import PropertyDetailClient from './PropertyDetailClient';

interface PropertyDetailPageProps {
  params: {
    id: string;
  };
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { id } = await params;
  const property = properties.find((p) => p.id === id);

  if (!property) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <PropertyDetailClient property={property} />
    </div>
  );
}
