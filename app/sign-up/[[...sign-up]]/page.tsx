import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-custom-gradient">
      <SignUp 
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-slate-900 border-slate-700",
            headerTitle: "text-white",
            headerSubtitle: "text-slate-400",
            socialButtonsBlockButton: "bg-slate-800 border-slate-700 text-white hover:bg-slate-700",
            formButtonPrimary: "bg-brand-600 hover:bg-brand-500",
            formFieldInput: "bg-slate-800 border-slate-700 text-white",
            formFieldLabel: "text-slate-300",
            footerActionLink: "text-brand-400 hover:text-brand-300",
          },
        }}
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        afterSignUpUrl="/"
      />
    </div>
  );
}

