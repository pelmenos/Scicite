import cn from "classnames";
import { FC, useEffect, useState } from "react";
import { TToggleOBj, removeModals } from "shared/Functions";
import styleBtns from "assets/scss/btns.module.scss";
import style from "./ModalSupport.module.scss";
import useWindow from "shared/CustomHooks";
import { ModalWrapper } from "entities/ModalWrapper/ModalWrapper";
import { Dropdown } from "shared/ui/Dropdown/Dropdown";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  getErrors,
  getSupportStatus,
  getSupportTypes,
} from "store/support/supportSelector";
import { AppDispatch } from "store/store";
import { getUserId } from "store/user/userSelector";
import { createSupport, setErrors } from "store/support/supportSlice";
import { useTranslation } from "react-i18next";

type TProps = {
  view: TToggleOBj;
  setView: (toggle: TToggleOBj) => void;
};

type TFields = {
  type: string;
  narrative: string;
};

export const ModalSupport: FC<TProps> = ({ view, setView }) => {
  const { t } = useTranslation();

  const dispatch: AppDispatch = useDispatch();
  const declarerId = useSelector(getUserId);
  const typeSupp = useSelector(getSupportTypes);
  const statusSupp = useSelector(getSupportStatus);
  const err = useSelector(getErrors);

  const [isSubmit, setIsSubmit] = useState(false);

  const type = typeSupp
    ?.filter(
      (type) => type.name.toLocaleLowerCase() !== t("support_types.refusal")
    )
    .filter(
      (type) =>
        type.name.toLocaleLowerCase() !== t("support_types.support_types")
    );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TFields>();

  const isMobile = useWindow();
  const [addClass, setAddClass] = useState(true);

  const onSubmit = handleSubmit(async (data) => {
    if (err !== null) {
      dispatch(setErrors(null));
    }
    const status = statusSupp?.filter((status) => status.name === "open");
    await dispatch(
      createSupport({
        declarer: declarerId,
        narrative: data.narrative,
        status: status ? status[0]?.id : "",
        type_support: data.type,
      })
    );
    setIsSubmit(true);
  });

  useEffect(() => {
    if (err === null && isSubmit) {
      removeModals(setAddClass, setView, view, "support");
    }
    setIsSubmit(false);
  }, [err, isSubmit, setView, view]);

  return (
    <ModalWrapper
      view={view}
      setView={setView}
      changeEl={"support"}
      addClass={addClass}
      setAddClass={setAddClass}
      smooth={isMobile ? true : false}
    >
      <form className={cn(style.modalSupport)} onSubmit={onSubmit}>
        <div className={style.modalSupport__top}>
          <p className={style.modalSupport__subTitle}>{t("support")}</p>
          <p className={style.modalSupport__title}>{t("describe_problem")}</p>
        </div>
        <div className={style.modalSupport__middle}>
          <label htmlFor="textSupport" className={style.modalSupport__label}>
            {t("expect_response")}
          </label>
          <div>
            <Dropdown
              {...register("type", {
                required: {
                  value: true,
                  message: t("required_card_field", { name: t("theme.2") }),
                },
              })}
              name={"type"}
              placeholder={t("theme.1")}
              setInputValue={setValue}
              items={type ? type : []}
              addStyle={(err?.type || errors.type) && style.fieldError}
            />
            {err?.type ? (
              err?.type.map((error) => (
                <span className={style.errorText}>{error}</span>
              ))
            ) : errors.type ? (
              <span className={style.errorText}>{errors.type.message}</span>
            ) : (
              ""
            )}
          </div>
          <div>
            <textarea
              {...register("narrative", {
                required: {
                  value: true,
                  message: t("required_card_field", { name: t("message") }),
                },
              })}
              className={cn(
                "input-reset",
                style.modalSupport__textField,
                (err?.narrative || errors.narrative) && style.fieldError
              )}
            />
            {err?.narrative ? (
              err?.narrative.map((error) => (
                <span className={style.errorText}>{error}</span>
              ))
            ) : errors.narrative ? (
              <span className={style.errorText}>
                {errors.narrative.message}
              </span>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className={style.modalSupport__bottom}>
          <button
            type={"submit"}
            className={cn(
              "btn-reset",
              styleBtns.btnAstral,
              style.modalSupport__btn
            )}
          >
            {t("submit")}
          </button>
          <button
            type={"button"}
            className={cn(
              "btn-reset",
              styleBtns.btnAstral,
              style.modalSupport__btn
            )}
            onClick={() => removeModals(setAddClass, setView, view, "support")}
          >
            {t("cancel")}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};
