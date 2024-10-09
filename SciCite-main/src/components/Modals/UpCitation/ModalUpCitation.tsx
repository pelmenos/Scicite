import cn from "classnames";
import {
  ChangeEvent,
  DragEvent,
  FC,
  MutableRefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { TToggleOBj, removeModals } from "shared/Functions";
import styleBtns from "assets/scss/btns.module.scss";
import style from "./ModalUpCitation.module.scss";
import { Dropdown } from "shared/ui/Dropdown/Dropdown";
import { ModalExample } from "../Example/ModalExample";
import { ModalWrapper } from "entities/ModalWrapper/ModalWrapper";
import useWindow from "shared/CustomHooks";
import { TOffer } from "types/offers.types";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "store/store";
import { FormInput } from "shared/ui/FormInput/FormInput";
import { citationProof, setErrors } from "store/offers/offersSlice";
import { getErrors, getOffersStatus } from "store/offers/offersSelector";
import { items } from "shared/Constants";
import { useTranslation } from "react-i18next";

type TProps = {
  multi?: string;
  view: TToggleOBj;
  setView: (toggle: TToggleOBj) => void;
  offers: TOffer[];
  resetFilter: () => void;
};

type TCitationEvidence = {
  deadline_at: Date;
  title: string;
  journal_name: string;
  file: File;
};

export const ModalUpCitation: FC<TProps> = ({
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

  const downloadRef = useRef<HTMLInputElement | null>(null);

  const [addClass, setAddClass] = useState(true);
  const [drag, setDrag] = useState(false);
  const [isDownload, setIsDownload] = useState(false);
  const [showModals, setShowModals] = useState<TToggleOBj>({
    example: false,
  });
  const [isCopy, setIsCopy] = useState<boolean[]>([false, false]);
  const [isSubmit, setIsSubmit] = useState(false);
  const [fileName, setFileName] = useState("");

  const offerStatusId = useMemo(() => {
    let statusId = "";
    for (let i = 0; i < statusArr.length; i++) {
      if (statusArr[i].name === t("offers_status.цитирование")) {
        statusId = statusArr[i].id;
      }
    }

    return statusId;
  }, [statusArr]);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<TCitationEvidence>();

  const onSubmit = handleSubmit((data) => {
    if (data.file) {
      let deadline = new Date();
      deadline.setMonth(deadline.getMonth() + +data.deadline_at);
      if (err !== null) {
        dispatch(setErrors(null));
      }
      offers.map(async (offer, index) => {
        await dispatch(
          citationProof(offer.id, {
            deadline_at: deadline,
            evidence: {
              file: data.file,
              title: data.title,
              journal_name: data.journal_name,
            },
            status_customer: offerStatusId,
          })
        );
        if (index === offers.length - 1) {
          setIsSubmit(true);
        }
      });
    } else {
      setError("file", { message: t("up_file") });
    }
  });

  useEffect(() => {
    if (err === null && isSubmit) {
      removeModals(setAddClass, setView, view, !multi ? "citation" : "multi");
      if (resetFilter) {
        resetFilter();
      }
      clearErrors("file");
    }
    setIsSubmit(false);
  }, [err, isSubmit]);

  const handleChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files?.length) {
      if (e.currentTarget.files[0].size < 20971520) {
        setValue("file", e.currentTarget.files[0]);
        setFileName(e.currentTarget.files[0].name);
        setIsDownload(true);
        clearErrors("file");
      } else {
        reset({ file: undefined });
        setError("file", { message: t("file_size") });
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
      setValue("file", e.dataTransfer.files[0]);
      setFileName(e.dataTransfer.files[0].name);
      setIsDownload(true);
      clearErrors("file");
    } else {
      reset({ file: undefined });
      setError("file", { message: t("file_size") });
      setFileName("");
      setIsDownload(false);
      setDrag(false);
    }
  };

  const copyToClipboard = async (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    index: number
  ) => {
    if (e.currentTarget.textContent) {
      await navigator.clipboard.writeText(e.currentTarget.textContent);
      setIsCopy(index === 0 ? [true, false] : [false, true]);
    }
  };

  return (
    <ModalWrapper
      view={view}
      setView={setView}
      changeEl={!multi ? "citation" : "multi"}
      addClass={addClass}
      setAddClass={setAddClass}
      smooth={isMobile ? true : false}
    >
      <form className={cn(style.modalUpCitation)} onSubmit={onSubmit}>
        <div className={style.top}>
          <p className={style.number}>
            {t("card")} №{" "}
            {offers.map((offer) => offer.card.cart_number).join(", ")}
          </p>
          <p className={style.title}>{multi ? multi : offers[0].card.theme}</p>
        </div>
        <div className={style.middle}>
          <p className={style.descr}>{t("publication_up_file")}</p>
          <button
            className={cn("btn-reset", styleBtns.btnAstral, style.btnExample)}
            onClick={() => setShowModals((old) => ({ ...old, example: true }))}
          >
            {t("example")}
          </button>
          <div className={style.citationModalForm}>
            <div>
              <div
                className={cn(
                  style.field,
                  style.naturalSize,
                  style.disabledField,
                  style.fieldCitation
                )}
              >
                <span onClick={(e) => copyToClipboard(e, 0)}>
                  {offers
                    .map((offer) => offer.card.article.citation_url)
                    .join(", ")}
                </span>
              </div>
              {isCopy[0] ? (
                <span className={style.isCopyLabel}>
                  {t("citation_link_copied")}
                </span>
              ) : (
                ""
              )}
            </div>
            <div>
              <div
                className={cn(
                  style.field,
                  style.naturalSize,
                  style.disabledField,
                  style.fieldDoi
                )}
              >
                <span onClick={(e) => copyToClipboard(e, 1)}>
                  {offers.map((offer) => offer.card.article.doi).join(", ")}
                </span>
              </div>
              {isCopy[1] ? (
                <span className={style.isCopyLabel}>
                  {t("citation_link_copied")}
                </span>
              ) : (
                ""
              )}
            </div>
            <div>
              <Dropdown
                {...register("deadline_at", {
                  required: {
                    value: true,
                    message: t("choose_date"),
                  },
                })}
                name={"deadline_at"}
                setInputValue={setValue}
                placeholder={t("choose_date")}
                items={items.items1}
                isField={items.field1}
                textCenter={true}
                addStyle={errors.deadline_at && style.fieldError}
              />
              {err?.deadline_at ? (
                err?.deadline_at.map((error) => (
                  <span className={style.errorText}>{error}</span>
                ))
              ) : errors.deadline_at ? (
                <span className={style.errorText}>
                  {errors.deadline_at.message}
                </span>
              ) : (
                ""
              )}
            </div>
            <div>
              <FormInput
                type="text"
                name="title"
                placeholder={t("article_title")}
                register={register}
                errors={errors}
                rules={{
                  required: {
                    value: true,
                    message: t("required_card_field", {
                        name: t("article_title"),
                      }),
                  },
                  minLength: 1,
                }}
                addStyle={style.field}
              />
              {err?.title ? (
                err?.title.map((error) => (
                  <span className={style.errorText}>{error}</span>
                ))
              ) : errors.title ? (
                <span className={style.errorText}>{errors.title.message}</span>
              ) : (
                ""
              )}
            </div>
            <div>
              <FormInput
                type="text"
                name="journal_name"
                placeholder={t("journal")}
                register={register}
                errors={errors}
                rules={{
                  required: {
                    value: true,
                    message: t("required_card_field", {name: t("journal")}),
                  },
                  minLength: 1,
                }}
                addStyle={style.field}
              />
              {err?.journal_name ? (
                err?.journal_name.map((error) => (
                  <span className={style.errorText}>{error}</span>
                ))
              ) : errors.journal_name ? (
                <span className={style.errorText}>
                  {errors.journal_name.message}
                </span>
              ) : (
                ""
              )}
            </div>
            <input
              onChange={handleChangeFile}
              ref={downloadRef}
              name={"file"}
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
            {err?.file ? (
              err?.file.map((error) => (
                <span
                  className={style.errorText}
                  style={{ textAlign: "center" }}
                >
                  {error}
                </span>
              ))
            ) : errors.file?.message ? (
              <span style={{ textAlign: "center" }} className={style.errorText}>
                {errors.file?.message}
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
                (fileName !== "" && `${t("file")} ${fileName} ${t("added")}`)}
            </div>
          </div>
        </div>
        <div className={style.bottom}>
          <button
            type="submit"
            className={cn("btn-reset", styleBtns.btnAstral, style.btn)}
            onClick={() => clearErrors("file")}
          >
            {t("upload")}
          </button>
          <button
            type="button"
            className={cn("btn-reset", styleBtns.btnAstral, style.btn)}
            onClick={() =>
              removeModals(
                setAddClass,
                setView,
                view,
                !multi ? "citation" : "multi"
              )
            }
          >
            {t("cancel")}
          </button>
        </div>
      </form>
      {showModals.example && (
        <ModalExample view={showModals} setView={setShowModals} />
      )}
    </ModalWrapper>
  );
};
