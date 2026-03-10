import AdminDashboard from '@/components/AdminDashboard';

export default async function AdminPage() {
  // Admin page is now public - anyone can add entries
  return <AdminDashboard />;
}
