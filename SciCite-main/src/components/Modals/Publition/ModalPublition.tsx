import cn from "classnames";
import {
  ChangeEvent,
  FC,
  MutableRefObject,
  DragEvent,
  useState,
  useRef,
  useEffect,
  useMemo,
} from "react";
import { TToggleOBj, removeModals } from "shared/Functions";
import styleBtns from "assets/scss/btns.module.scss";
import style from "./ModalPublition.module.scss";
import useWindow from "shared/CustomHooks";
import { ModalWrapper } from "entities/ModalWrapper/ModalWrapper";
import { useForm } from "react-hook-form";
import { getErrors, getOffersStatus } from "store/offers/offersSelector";
import { useDispatch, useSelector } from "react-redux";
import { TOffer } from "types/offers.types";
import { AppDispatch } from "store/store";
import { publicationProof, setErrors } from "store/offers/offersSlice";
import { useTranslation } from "react-i18next";

type TProps = {
  multi?: string;
  view: TToggleOBj;
  setView: (toggle: TToggleOBj) => void;
  offers: TOffer[];
  resetFilter: () => void;
};

type TPublicationEvidence = {
  file_publication: File;
};

export const ModalPublition: FC<TProps> = ({
  view,
  setView,
  multi,
  offers,
  resetFilter,
}) => {
  const { t } = useTranslation();
  const isMobile = useWindow();

  const dispatch: AppDispatch = useDispatch();
  const statusArr = useSelector(getOffersStatus);
  const err = useSelector(getErrors);

  const [addClass, setAddClass] = useState(true);
  const [drag, setDrag] = useState(false);
  const [isDownload, setIsDownload] = useState(false);
  const [isFileError, setIsFileError] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [fileName, setFileName] = useState("");

  const downloadRef = useRef<HTMLInputElement | null>(null);

  const offerStatusId = useMemo(() => {
    let statusId = "";
    for (let i = 0; i < statusArr.length; i++) {
      if (statusArr[i].name === t("offers_status.publication")) {
        statusId = statusArr[i].id;
      }
    }

    return statusId;
  }, [statusArr]);

  const {
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<TPublicationEvidence>();

  const onSubmit = handleSubmit((data) => {
    if (data.file_publication) {
      if (err !== null) {
        dispatch(setErrors(null));
      }
      offers.map(async (offer, index) => {
        await dispatch(
          publicationProof(offer.id, offer.evidence.article.id, {
            evidence: {
              file_publication: data.file_publication,
            },
            status_customer: offerStatusId,
          })
        );
        if (index === offers.length - 1) {
          setIsSubmit(true);
        }
      });
    } else {
      setError("file_publication", { message: t("up_file") });
    }
  });

  useEffect(() => {
    if (err === null && isSubmit) {
      removeModals(setAddClass, setView, view, !multi ? "publition" : "multi");
      if (resetFilter) {
        resetFilter();
      }
      clearErrors("file_publication");
    }
    setIsSubmit(false);
  }, [err, isSubmit]);

  const handleChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files?.length) {
      if (e.currentTarget.files[0].size < 20971520) {
        setValue("file_publication", e.currentTarget.files[0]);
        setFileName(e.currentTarget.files[0].name);
        setIsDownload(true);
        clearErrors("file_publication");
      } else {
        reset({ file_publication: undefined });
        setError("file_publication", { message: t("file_size") });
        setFileName("");
        setIsDownload(false);
      }
    }
  };

  const handleClick = (ref: MutableRefObject<HTMLInputElement | null>) => {
    ref.current?.click();
  };

  const drarStartHandler = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDrag(true);
  };

  const drarLeaveHandler = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDrag(false);
  };

  const onDropHandler = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files[0].size < 20971520) {
      setValue("file_publication", e.dataTransfer.files[0]);
      setFileName(e.dataTransfer.files[0].name);
      setIsDownload(true);
      clearErrors("file_publication");
    } else {
      reset({ file_publication: undefined });
      setError("file_publication", { message: t("file_size") });
      setFileName("");
      setIsDownload(false);
      setDrag(false);
    }
  };

  return (
    <ModalWrapper
      view={view}
      setView={setView}
      changeEl={!multi ? "publition" : "multi"}
      addClass={addClass}
      setAddClass={setAddClass}
      smooth={isMobile ? true : false}
    >
      <form className={cn(style.modalUpCitation)} onSubmit={onSubmit}>
        <div className={style.top}>
          <p className={style.number}>
            {t("card")} №
            {offers.map((offer) => offer.card.cart_number).join(", ")}
          </p>
          <p className={style.title}>
            {offers.map((offer) => offer.card.theme).join(", ")}
          </p>
        </div>
        <div className={style.middle}>
          <p className={style.descr}>
            {t("publication_up_file")}
          </p>
          <div className={style.publitionModalForm}>
            <input
              onChange={handleChangeFile}
              ref={downloadRef}
              name={"file_publication"}
              type="file"
              accept=".pdf"
              className="is-hidden"
            />
            <button
              type={"button"}
              className={cn("btn-reset", styleBtns.btnAstral, style.btnUpload)}
              onClick={() => handleClick(downloadRef)}
            >
              {t("choose_file")}
            </button>
            {err?.file_publication ? (
              err?.file_publication.map((error) => (
                <span
                  className={style.errorText}
                  style={{ textAlign: "center" }}
                >
                  {error}
                </span>
              ))
            ) : errors.file_publication?.message ? (
              <span style={{ textAlign: "center" }} className={style.errorText}>
                {errors.file_publication?.message}
              </span>
            ) : (
              ""
            )}
            <div
              className={style.uploadText}
              onDragStart={(e) => drarStartHandler(e)}
              onDragLeave={(e) => drarLeaveHandler(e)}
              onDragOver={(e) => drarStartHandler(e)}
              onDrop={(e) => onDropHandler(e)}
            >
              {(!drag && !isDownload && t("drag")) ||
                (drag && !isDownload && t("drop")) ||
                (fileName && `${t("file")} ${fileName} ${t("added")}`)}
            </div>
          </div>
        </div>
        <div className={style.bottom}>
          <button
            type="submit"
            className={cn("btn-reset", styleBtns.btnAstral, style.btn)}
            onClick={() => clearErrors("file_publication")}
          >
            {t("upload")}
          </button>
          <button
            type="button"
            className={cn("btn-reset", styleBtns.btnAstral, style.btn)}
            onClick={() =>
              removeModals(setAddClass, setView, view, "publition")
            }
          >
            {t("cancel")}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};
