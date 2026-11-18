import { getAllAduan } from '@/lib/aduan-store';
import { HelpdeskDashboard } from '@/components/HelpdeskDashboard';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const initialAduan = await getAllAduan();

  return <HelpdeskDashboard initialAduan={initialAduan} />;
}
