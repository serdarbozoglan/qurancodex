'use client';

import { useRouter } from 'next/navigation';
import AddresseeSystem from '@/components/AddresseeSystem';

export default function AddresseeSystemRoute() {
  const router = useRouter();
  return <AddresseeSystem onClose={() => router.back()} />;
}
