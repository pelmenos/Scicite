import cn from "classnames";
import { FC, useEffect, useMemo, useState } from "react";
import useWindow from "shared/CustomHooks";
import { TToggleOBj, removeModals } from "shared/Functions";
import styleBtns from "assets/scss/btns.module.scss";
import style from "./ModalRefuse.module.scss";
import { ModalWrapper } from "entities/ModalWrapper/ModalWrapper";
import { AppDispatch } from "store/store";
import { useDispatch, useSelector } from "react-redux";
import { TOffer } from "types/offers.types";
import { SvgIcon } from "entities/SvgIcon/SvgIcon";
import { useForm } from "react-hook-form";
import {
  createSupport,
  requestSupport,
  setErrors,
} from "store/support/supportSlice";
import { getUserId } from "store/user/userSelector";
import {
  getErrors,
  getSupportStatus,
  getSupportTypes,
} from "store/support/supportSelector";
import { requestOffers, resetOffers } from "store/offers/offersSlice";
import { getOffersStatus } from "store/offers/offersSelector";
import { useTranslation } from "react-i18next";

type TProps = {
  contact?: boolean;
  refuse?: boolean;
  view: TToggleOBj;
  setView: (toggle: TToggleOBj) => void;
  offer: TOffer;
  toggleStatus?: string;
};

type TRefuseForm = {
  narrative: string;
};

export const ModalRefuse: FC<TProps> = ({
  view,
  setView,
  refuse,
  contact,
  offer,
  toggleStatus,
}) => {
  const { t } = useTranslation();

  const dispatch: AppDispatch = useDispatch();
  const declarerId = useSelector(getUserId);
  const statusSupp = useSelector(getSupportStatus);
  const typeSupp = useSelector(getSupportTypes);
  const err = useSelector(getErrors);
  const statusArr = useSelector(getOffersStatus);

  const isMobile = useWindow();
  const [addClass, setAddClass] = useState(true);
  const [isSubmit, setIsSubmit] = useState(false);

  const offerStatusId = useMemo(() => {
    let statusId = "";
    for (let i = 0; i < statusArr.length; i++) {
      if (statusArr[i].name === toggleStatus) {
        statusId = statusArr[i].id;
      }
    }

    return statusId;
  }, [statusArr, toggleStatus]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TRefuseForm>();

  const onSubmit = handleSubmit(async (data) => {
    const status = statusSupp?.filter((status) => status.name === "open");
    if (!contact) {
      if (err !== null) {
        dispatch(setErrors(null));
      }
      const type = typeSupp?.filter((type) =>
        refuse
          ? type.name.toLowerCase() === t("support_types.refusal")
          : type.name.toLowerCase() === t("support_types.dispute")
      );
      await dispatch(
        createSupport({
          offer: offer.id,
          declarer: declarerId,
          narrative: data.narrative,
          status: status ? status[0]?.id : "",
          type_support: type ? type[0].id : "",
        })
      );
      dispatch(resetOffers());
      if (toggleStatus) {
        dispatch(resetOffers());
        dispatch(
          requestOffers({
            card_id: offer.card.id,
            is_evidence: true,
            page: 1,
            perfomer_id: "",
            search: "",
            status_executor__id: "",
            status_customer__id: offerStatusId,
          })
        );
        dispatch(
          requestSupport({
            type_support__id: type ? [type[0].id] : [],
          })
        );
      } else {
        dispatch(resetOffers());
        dispatch(
          requestOffers({
            page: 1,
            card_id: "",
            perfomer_id: declarerId,
            search: "",
            status_executor__id: "",
            status_customer__id: "",
            is_evidence: null,
          })
        );
        dispatch(
          requestSupport({
            type_support__id: type ? [type[0].id] : [],
          })
        );
      }
      setIsSubmit(true);
    } else {
      if (err !== null) {
        dispatch(setErrors(null));
      }
      const type = typeSupp?.filter((type) =>
        refuse
          ? type.name.toLowerCase() === t("support_types.refusal")
          : type.name.toLowerCase() === t("support_types.communication")
      );
      await dispatch(
        createSupport({
          offer: offer.id,
          declarer: declarerId,
          narrative: data.narrative,
          status: status ? status[0]?.id : "",
          type_support: type ? type[0].id : "",
        })
      );
      dispatch(resetOffers());
      dispatch(
        requestOffers({
          card_id: offer.card.id,
          is_evidence: true,
          page: 1,
          perfomer_id: "",
          search: "",
          status_executor__id: "",
          status_customer__id: offerStatusId,
        })
      );
      dispatch(
        requestSupport({
          type_support__id: type ? [type[0].id] : [],
        })
      );
      setIsSubmit(true);
    }
  });

  useEffect(() => {
    if (err === null && isSubmit) {
      removeModals(setAddClass, setView, view, !contact ? "refuse" : "contact");
    }
    setIsSubmit(false);
  }, [contact, err, isSubmit, setView, view]);

  return (
    <ModalWrapper
      view={view}
      setView={setView}
      changeEl={!contact ? "refuse" : "contact"}
      addClass={addClass}
      setAddClass={setAddClass}
      smooth={isMobile ? true : false}
    >
      <div className={cn(style.modalRefuse)}>
        <div className={style.top}>
          <div className={style.topText}>
            {!contact ? (
              <span className={style.text}>
                {t("card")} №{offer.card.cart_number}
              </span>
            ) : (
              ""
            )}
            <span className={style.text}>
              <SvgIcon name={offer.card.user.level.name} />
              {offer.card.user.login}
            </span>
          </div>
          <p className={style.title}>
            {contact ? t("ask") : `${offer.card.theme}`}
          </p>
        </div>
        <form className={style.modalRefuseForm} onSubmit={onSubmit}>
          <p className={style.descr}>
            {!contact
              ? refuse
                ? t("describe_reason")
                : t("describe_situation")
              : t("pls_wait")}
          </p>
          <div className={style.fieldWrapper}>
            <textarea
              className={cn(
                "input-reset",
                style.field,
                (err?.narrative || errors.narrative) && style.fieldError
              )}
              {...register("narrative", {
                required: {
                  value: true,
                  message: t("required_card_field", {name: ""}),
                },
              })}
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
          <div className={style.btnsBlock}>
            <button
              type="submit"
              className={cn("btn-reset", styleBtns.btnAstral, style.btn)}
            >
              {t("create")}
            </button>
            <button
              type={"button"}
              className={cn("btn-reset", styleBtns.btnAstral, style.btn)}
              onClick={() =>
                removeModals(
                  setAddClass,
                  setView,
                  view,
                  !contact ? "refuse" : "contact"
                )
              }
            >
              {t("cancel")}
            </button>
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
};
