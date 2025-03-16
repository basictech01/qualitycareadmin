import React, { FormEvent, MouseEventHandler } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { loginAsync } from "./actions";
import { AppDispatch } from "@/store";

const SignInLayer = () => {
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');
	const dispatch = useDispatch<AppDispatch>();

	const submit = () => {
		dispatch(loginAsync({ email, password }));
	}
  return (
    <section className='auth bg-base d-flex flex-wrap'>
      <div className='auth-left d-lg-block d-none'>
        <div className='d-flex align-items-center flex-column h-100 justify-content-center'>
          <Image
            src="/images/logo.png"
            alt="Loading"
            width={450} // Or whatever the original image dimensions are
            height={450} // Or whatever the original image dimensions are
            className="w-40 h-40 md:w-48 md:h-48"
        />
        </div>
      </div>
      <div className='auth-right py-32 px-24 d-flex flex-column justify-content-center'>
        <div className='max-w-464-px mx-auto w-100'>
          <div>
            <h4 className='mb-12'>Sign In to your Account</h4>
            <p className='mb-32 text-secondary-light text-lg'>
              Welcome back! please enter your detail
            </p>
          </div>
          <form action='#'>
            <div className='icon-field mb-16'>
              <span className='icon top-50 translate-middle-y'>
                <Icon icon='mage:email' />
              </span>
              <input
								value={email}
								onChange={(e) => setEmail(e.target.value)}
                type='email'
                className='form-control h-56-px bg-neutral-50 radius-12'
                placeholder='Email'
              />
            </div>
            <div className='position-relative mb-20'>
              <div className='icon-field'>
                <span className='icon top-50 translate-middle-y'>
                  <Icon icon='solar:lock-password-outline' />
                </span>
                <input
									value={password}
									onChange={(e) => setPassword(e.target.value)}
                  type='password'
                  className='form-control h-56-px bg-neutral-50 radius-12'
                  id='your-password'
                  placeholder='Password'
                />
              </div>
              <span
                className='toggle-password ri-eye-line cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light'
                data-toggle='#your-password'
              />
            </div>
            <button
              type='submit'
              className='btn btn-primary text-sm btn-sm px-12 py-16 w-100 radius-12 mt-32'
              onClick={submit}
            >
              {" "}
              Sign In
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignInLayer;
