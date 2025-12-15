import SignInForm from "@/features/auth/components/SignInForm";

export default async function Page() {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <SignInForm />
    </div>
  );
}
