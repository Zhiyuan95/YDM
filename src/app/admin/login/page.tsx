import { login } from "@/app/admin/login/actions";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col justify-center items-center px-4 font-sans text-zinc-900">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
        <div className="px-8 py-8">
          <h1 className="text-2xl font-semibold tracking-tight text-center mb-6">Archive Access</h1>
          
          <form className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-zinc-700">Email Address</label>
              <input 
                id="email" 
                name="email" 
                type="email" 
                required 
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 transition-colors"
                placeholder="archivist@example.com"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-zinc-700">Password</label>
              <input 
                id="password" 
                name="password" 
                type="password" 
                required 
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 transition-colors"
              />
            </div>

            <div className="pt-2">
              <button 
                formAction={login}
                className="w-full bg-zinc-900 text-white rounded-md py-2 text-sm font-medium hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
