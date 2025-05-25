import RegisterForm from "@/components/auth/RegisterForm";

const Register = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Inscription</h1>
          <p className="text-gray-600 mt-2">
            Créez votre compte pour commencer à participer à des missions
          </p>
        </div>

        <RegisterForm />
      </div>
    </div>
  );
};

export default Register; 