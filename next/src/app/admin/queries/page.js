import AdminQueriesRoute from './AdminQueriesRoute';

export const metadata = {
  title: 'Concierge Admin — Queries',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AdminQueriesRoute />;
}
