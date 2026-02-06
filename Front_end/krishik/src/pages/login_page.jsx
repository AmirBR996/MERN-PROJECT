import Login_form from '../components/form/login_form';
import {Link} from 'react-router'

const LoginPage = () => {
  return (
    <main className="h-full w-full flex justify-center items-center ">
      <div className="shadow-md border border-green-500  py-8 px-6 min-h-100 min-w-120 rounded-md">
        <h1 className="text-3xl font-bold text-center ">Login </h1>
        <p className="mt-1 text-center text-[14px]">
          Namaste, please enter your login details
        </p>

        {/* form */}
       <Login_form/>

        {/* link to register page */}
        <div className="mt-1">
          <p className="text-center">
            Don't have an account?{" "}
            <Link to={'/register'}>
            <span className="text-green-500 italic font-semibold">create account</span>
            </Link>
          </p>
        </div>
      </div>
    </main> 
  );
};

export default LoginPage;