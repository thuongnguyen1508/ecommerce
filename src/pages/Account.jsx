import React, { useState } from "react";
import {
  SignIn as SignInGoogle,
  SignOut as SignOutGoogle,
} from "../database/Auth/GoogleAuth";
import {
  SignIn as SignInPassword,
  CreateAccount,
} from "../database/Auth/PasswordAuth";
import icon_google from "../assets/images/icon_google.png";
import "../styles/account.css";
import Helmet from "../components/Helmet/Helmet";
import { hasLogin } from "../database/Auth/Auth";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";

function Account() {
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect");
  const [inputEmail, setEmail] = useState(null);
  const [inputPassword, setPassword] = useState(null);

  const signInGoogle = async () => {
    var result = await SignInGoogle();
    if (result) {
      document.getElementsByTagName("form")[0].submit();
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    var resultSubmit = false;
    switch (e.nativeEvent.submitter.name) {
      case "signOut":
        resultSubmit = await SignOutGoogle();
        break;
      case "signInByPassword":
        resultSubmit = await SignInPassword(inputEmail, inputPassword);
        break;
      case "register":
        resultSubmit = await CreateAccount(inputEmail, inputPassword);
        break;
      default:
        break;
    }
    if (resultSubmit) e.target.submit();
    else {
      toast.error("Đăng nhập sai email/password");
    }
    return false;
  };
  return hasLogin() ? (
    <Helmet title="Tài khoản">
      <section className="account-section">
        <form
          action={redirect === null ? "/account" : redirect}
          onSubmit={onSubmit}
        >
          <div className="text-center ">
            <p>Bạn đã đăng nhập</p>
            <button
              type="submit"
              className="my-3 btn btn-primary text-uppercase shadow-lg"
              name="signOut"
            >
              <strong>Đăng xuất</strong>
            </button>
          </div>
        </form>
      </section>
    </Helmet>
  ) : (
    <Helmet title="Login">
      <section className="account-section position-relative">
        <form
          action={redirect === null ? "/account" : redirect}
          onSubmit={onSubmit}
        >
          <div className="hero-section__bg"></div>
          <div className="account-section__form container bg-white rounded">
            <div className="d-flex flex-column justify-content-center p-2 p-sm-5">
              <span className="text-center">
                <i className="ri-lock-2-line icon"></i>
              </span>
              <p className="text-center">Hey, chào mừng quay trờ lại!!!</p>
              <button
                type="button"
                onClick={signInGoogle}
                className="my-3 btn btn-primary shadow-lg"
                name="signInGoogle"
              >
                <p>
                  <img
                    src={icon_google}
                    alt=""
                    className="img-fluid col-1 mx-1"
                  />
                  Đăng nhập bằng Google
                </p>
              </button>
              <div className="d-flex">
                <hr className="my-auto flex-grow-1"></hr>
                <div className="px-3">Or</div>
                <hr className="my-auto flex-grow-1"></hr>
              </div>
              <input
                type="email"
                className="my-3 p-2 form-control"
                placeholder="Tên đăng nhập"
                onChange={(e) => setEmail(e.target.value)}
                required
              ></input>
              <input
                type="password"
                className="p-2 form-control"
                placeholder="Mật khẩu"
                onChange={(e) => setPassword(e.target.value)}
                required
              ></input>
              <div className="row justify-content-around">
                <button
                  type="submit"
                  name="signInByPassword"
                  className="col-md-5 col-12 my-3 btn btn-primary text-uppercase shadow-lg p-3"
                >
                  <strong>Đăng nhập</strong>
                </button>
                <button
                  type="submit"
                  name="register"
                  className="col-md-5 col-12 my-3 btn btn-primary text-uppercase shadow-lg p-3"
                >
                  <strong>Đăng ký</strong>
                </button>
              </div>
            </div>
          </div>
        </form>
      </section>
    </Helmet>
  );
}

export default Account;
