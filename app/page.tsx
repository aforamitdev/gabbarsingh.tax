import { ComponentExample } from '@/components/component-example';

export default function Home() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-zinc-50 font-sans '>
      <main className='flex min-h-screen w-full justify-between'>
        <ComponentExample />
      </main>
    </div>
  );
}
