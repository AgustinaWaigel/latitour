import { AuthForm } from '@/components/auth-form';
import { configured } from '@/lib/supabase';
export default function Login(){return <main id="main" className="shell auth-page"><AuthForm configured={configured}/></main>}