import { AuthForm } from "entities/AuthForm/AuthForm";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import cn from "classnames";
import { TToggleOBj, removeModals } from "shared/Functions";
import { FormInput } from "shared/ui/FormInput/FormInput";
import { changePassword, setErrors } from "store/auth/authSlice";
import { AppDispatch } from "store/store";
import { TClientChangePasswordData } from "types/auth.types";
import style from "entities/AuthForm/AuthForm.module.scss";
import styleBtns from "assets/scss/btns.module.scss";
import { SvgIcon } from "entities/SvgIcon/SvgIcon";
import { getErrors } from "store/auth/authSelector";
import { useTranslation } from "react-i18next";

type TProps = {
  view: TToggleOBj;
  setView: (toggle: TToggleOBj) => void;
};

export const ModalChangePassword: FC<TProps> = ({ view, setView }) => {
  const { t } = useTranslation();

  const dispatch: AppDispatch = useDispatch();
  const err = useSelector(getErrors);

  const [addClass, setAddClass] = useState(true);
  const [isSubmit, setIsSubmit] = useState(false);
  const [isShowPass, setIsShowPass] = useState({
    oldPass: false,
    newPass: false,
    confirmPass: false,
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<TClientChangePasswordData>();

  const newPassword = watch("newPassword");

  const onSubmit = handleSubmit(async (data) => {
    if (err !== null) {
      dispatch(setErrors(null));
    }
    await dispatch(changePassword(data));
    setIsSubmit(true);
  });

  useEffect(() => {
    const closeModal = () => {
      if (err === null && isSubmit) {
        removeModals(setAddClass, setView, view, "changePass");
      }
    };

    closeModal();
    setIsSubmit(false);
  }, [err, isSubmit, setView, view]);

  return (
    <AuthForm
      addClass={addClass}
      setAddClass={setAddClass}
      changeEl="changePass"
      onSubmit={onSubmit}
      view={view}
      setView={setView}
      title={t("changing_password")}
    >
      <div className={style.passwordWrapper}>
        <FormInput<TClientChangePasswordData>
          type={isShowPass.oldPass ? "text" : "password"}
          name="oldPassword"
          placeholder={t("old_password")}
          register={register}
          errors={errors}
          rules={{
            required: t("required", { name: t("old_password") }),
            minLength: {
              value: 8,
              message: t("min_length_many", { name: t("password"), count: 8 }),
            },
          }}
          addStyle={style.field}
        />
        {!isShowPass.oldPass ? (
          <button
            type="button"
            className={cn("btn-reset", style.btnTogglePassVisible)}
            onClick={() => setIsShowPass((old) => ({ ...old, oldPass: true }))}
          >
            <SvgIcon name={"showPass"} />
          </button>
        ) : (
          <button
            type="button"
            className={cn("btn-reset", style.btnTogglePassVisible)}
            onClick={() => setIsShowPass((old) => ({ ...old, oldPass: false }))}
          >
            <SvgIcon name={"hidePass"} />
          </button>
        )}
        {err?.old_password ? (
          err?.old_password.map((error) => (
            <span className={style.error}>{error}</span>
          ))
        ) : errors.oldPassword ? (
          <span className={style.error}>{errors.oldPassword.message}</span>
        ) : (
          ""
        )}
      </div>
      <div className={style.passwordWrapper}>
        <FormInput<TClientChangePasswordData>
          type={isShowPass.newPass ? "text" : "password"}
          name="newPassword"
          placeholder={t("new_password")}
          register={register}
          errors={errors}
          rules={{
            required: t("required", { name: t("new_password") }),
            minLength: {
              value: 8,
              message: t("min_length_many", { name: t("password"), count: 8 }),
            },
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d[:punct:]]{8,}$/,
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
        ) : errors.newPassword ? (
          <span className={style.error}>{errors.newPassword.message}</span>
        ) : (
          ""
        )}
      </div>
      <div className={style.passwordWrapper}>
        <FormInput<TClientChangePasswordData>
          type={isShowPass.confirmPass ? "text" : "password"}
          name="confirmPassword"
          placeholder={t("new_password_confirm")}
          register={register}
          errors={errors}
          rules={{
            required: t("required", { name: t("password") }),
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
        {err?.confirm_password ? (
          err?.confirm_password.map((error) => (
            <span className={style.error}>{error}</span>
          ))
        ) : errors.confirmPassword ? (
          <span className={style.error}>{errors.confirmPassword.message}</span>
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
