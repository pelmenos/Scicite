import { AuthForm } from "entities/AuthForm/AuthForm";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import cn from "classnames";
import { TToggleOBj, removeModals } from "shared/Functions";
import { FormInput } from "shared/ui/FormInput/FormInput";
import { resetPassword, setErrors } from "store/auth/authSlice";
import { AppDispatch } from "store/store";
import { TResetPassword } from "types/auth.types";
import style from "entities/AuthForm/AuthForm.module.scss";
import styleBtns from "assets/scss/btns.module.scss";
import { getErrors } from "store/auth/authSelector";
import { SvgIcon } from "entities/SvgIcon/SvgIcon";
import { useTranslation } from "react-i18next";

type TProps = {
  view: TToggleOBj;
  setView: (toggle: TToggleOBj) => void;
};

export const ModalResetPassword: FC<TProps> = ({ view, setView }) => {
  const { t } = useTranslation();
  const dispatch: AppDispatch = useDispatch();
  const err = useSelector(getErrors);

  const [addClass, setAddClass] = useState(true);
  const [isSubmit, setIsSubmit] = useState(false);
  const [isShowPass, setIsShowPass] = useState({
    newPass: false,
    confirmPass: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<TResetPassword>();

  const newPassword = watch("new_password");

  const onSubmit = handleSubmit(async (data) => {
    const searchReset = localStorage.getItem("reset");
    if (searchReset) {
      if (err !== null) {
        dispatch(setErrors(null));
      }
      const [uid, token] = searchReset.split("&");
      const uidStartPos = uid.indexOf("=") + 1;
      const tokenStartPos = token.indexOf("=") + 1;
      await dispatch(
        resetPassword(
          uid.substring(uidStartPos),
          token.substring(tokenStartPos),
          data
        )
      );
      setIsSubmit(true);
    }
  });

  useEffect(() => {
    const closeModal = () => {
      if (err === null && isSubmit) {
        removeModals(setAddClass, setView, view, "reset");
      }
    };

    closeModal();
    setIsSubmit(false);
  }, [err, isSubmit, setView, view]);

  return (
    <AuthForm
      addClass={addClass}
      setAddClass={setAddClass}
      changeEl="reset"
      onSubmit={onSubmit}
      view={view}
      setView={setView}
      title={t("new_password")}
    >
      <div className={style.passwordWrapper}>
        <FormInput<TResetPassword>
          type={isShowPass.newPass ? "text" : "password"}
          name="new_password"
          placeholder={t("new_password")}
          register={register}
          errors={errors}
          rules={{
            required: t("required", { name: t("new_password") }),
            minLength: {
              value: 8,
              message: t("min_length_many", {
                name: t("password"),
                count: 8,
              }),
            },
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
              message: t("password_message"),
            },
          }}
          addStyle={style.field}
        />
        {!isShowPass.newPass ? (
          <button
            type="button"
            className={cn("btn-reset", style.btnTogglePassVisible)}
            onClick={() => setIsShowPass((old) => ({ ...old, newPass: true }))}
          >
            <SvgIcon name={"showPass"} />
          </button>
        ) : (
          <button
            type="button"
            className={cn("btn-reset", style.btnTogglePassVisible)}
            onClick={() => setIsShowPass((old) => ({ ...old, newPass: false }))}
          >
            <SvgIcon name={"hidePass"} />
          </button>
        )}
        {err?.new_password ? (
          err?.new_password.map((error) => (
            <span className={style.error}>{error}</span>
          ))
        ) : errors.new_password ? (
          <span className={style.error}>{errors.new_password.message}</span>
        ) : (
          ""
        )}
      </div>
      <div className={style.passwordWrapper}>
        <FormInput<TResetPassword>
          type={isShowPass.confirmPass ? "text" : "password"}
          name="confirm_new_password"
          placeholder={t("new_password_confirm")}
          register={register}
          errors={errors}
          rules={{
            required: t("required", { name: "" }),
            validate: (value) => value === newPassword || t("confirm_pass_error"),
          }}
          addStyle={style.field}
        />
        {!isShowPass.confirmPass ? (
          <button
            type="button"
            className={cn("btn-reset", style.btnTogglePassVisible)}
            onClick={() =>
              setIsShowPass((old) => ({ ...old, confirmPass: true }))
            }
          >
            <SvgIcon name={"showPass"} />
          </button>
        ) : (
          <button
            type="button"
            className={cn("btn-reset", style.btnTogglePassVisible)}
            onClick={() =>
              setIsShowPass((old) => ({ ...old, confirmPass: false }))
            }
          >
            <SvgIcon name={"hidePass"} />
          </button>
        )}
        {err?.confirm_new_password ? (
          err?.confirm_new_password.map((error) => (
            <span className={style.error}>{error}</span>
          ))
        ) : errors.confirm_new_password ? (
          <span className={style.error}>
            {errors.confirm_new_password.message}
          </span>
        ) : (
          ""
        )}
      </div>
      <button
        type={"submit"}
        className={cn("btn-reset", styleBtns.btnDark, style.btnSub)}
      >
        {t("change_password")}
      </button>
    </AuthForm>
  );
};
