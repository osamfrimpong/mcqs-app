import React from 'react'
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Assessments',
    href: '/dashboard/assessments',
  }
];
export default function Assessments() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Question" />
    <div>Assessments</div>
    </AppLayout>
  )
}
