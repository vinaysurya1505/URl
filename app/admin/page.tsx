import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import AdminDashboard from '@/components/AdminDashboard';

export default async function AdminPage() {
  // Check authentication on the server
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect('/login');
  }

  return <AdminDashboard />;
}
