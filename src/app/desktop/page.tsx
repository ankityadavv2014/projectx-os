// Redirect /desktop to /os
import { redirect } from 'next/navigation';

export default function DesktopPage() {
  redirect('/os');
}
