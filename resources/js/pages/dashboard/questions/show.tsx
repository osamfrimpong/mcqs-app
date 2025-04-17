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
    title: 'Edit Question',
    href: '/dashboard/questions',
  }
];
export default function ShowQuestion() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Question" />
    <div>ShowQuestion</div>
    </AppLayout>
  )
}
