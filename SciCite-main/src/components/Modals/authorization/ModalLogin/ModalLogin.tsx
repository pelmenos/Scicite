import cn from "classnames";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { TToggleOBj, removeModals } from "shared/Functions";
import styleBtns from "assets/scss/btns.module.scss";
import style from "entities/AuthForm/AuthForm.module.scss";
import { FormInput } from "shared/ui/FormInput/FormInput";
import { AuthForm } from "entities/AuthForm/AuthForm";
import { TLoginData } from "types/auth.types";
import { login } from "store/auth/authSlice";
import { AppDispatch } from "store/store";
import { useDispatch } from "react-redux";
import { AxiosError } from "axios";
import { SvgIcon } from "entities/SvgIcon/SvgIcon";
import { useTranslation } from "react-i18next";

type TProps = {
  view: TToggleOBj;
  setView: (toggle: TToggleOBj) => void;
  isAuth: boolean;
};

export const ModalLogin: FC<TProps> = ({ view, setView, isAuth }) => {
  const { t } = useTranslation();
  const dispatch: AppDispatch = useDispatch();
  const [addClass, setAddClass] = useState(true);
  const [err, setErrors] = useState<any>();
  const [isShowPass, setIsShowPass] = useState(false);

  useEffect(() => {
    if (isAuth) {
      removeModals(setAddClass, setView, view, "login");
    }
  }, [isAuth]);

  const Registration = () => {
    removeModals(setAddClass, setView, view, "login", "auth");
  };

  const Forgot = () => {
    removeModals(setAddClass, setView, view, "login", "forgot");
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TLoginData>();

  const onSubmit = handleSubmit(async (data) => {
    try {
      await dispatch(login(data));
    } catch (error) {
      if (error instanceof AxiosError) {
        setErrors(error.response?.data?.detail);
      }
    }
  });

  return (
    <AuthForm
      addClass={addClass}
      setAddClass={setAddClass}
      changeEl="login"
      onSubmit={onSubmit}
      view={view}
      setView={setView}
      title={t("signIn")}
    >
      <FormInput<TLoginData>
        type="text"
        name="username"
        placeholder={t("login")}
        register={register}
        errors={errors}
        rules={{ required: true, minLength: 1 }}
        addStyle={style.field}
      />
      <div className={style.passwordWrapper}>
        <FormInput<TLoginData>
          type={isShowPass ? "text" : "password"}
          name="password"
          placeholder={t("password")}
          register={register}
          errors={errors}
          rules={{ required: true, minLength: 1 }}
          addStyle={style.field}
        />
        {!isShowPass ? (
          <button
            type="button"
            className={cn("btn-reset", style.btnTogglePassVisible)}
            onClick={() => setIsShowPass(true)}
          >
            <SvgIcon name={"showPass"} />
          </button>
        ) : (
          <button
            type="button"
            className={cn("btn-reset", style.btnTogglePassVisible)}
            onClick={() => setIsShowPass(false)}
          >
            <SvgIcon name={"hidePass"} />
          </button>
        )}
        {err && <p className={style.error}>{err}</p>}
      </div>
      <button
        type={"submit"}
        className={cn("btn-reset", styleBtns.btnDark, style.btnSub)}
      >
        {t("signIn")}
      </button>
      <button
        type={"button"}
        className={cn("btn-reset", style.btnFotgot)}
        onClick={Forgot}
      >
        {t("forgot_password")}
      </button>
      <button
        type={"button"}
        className={cn("btn-reset", style.btnAuth)}
        onClick={Registration}
      >
        {t("signUp")}
      </button>
    </AuthForm>
  );
};
