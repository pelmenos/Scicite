import cn from "classnames";
import {
  ChangeEvent,
  FC,
  FormEvent,
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { TToggleOBj, removeModals } from "shared/Functions";
import styleBtns from "assets/scss/btns.module.scss";
import style from "./ModalCreateCard.module.scss";
import { Dropdown } from "shared/ui/Dropdown/Dropdown";
import { RangeSlider } from "shared/ui/rangeSlider/RangeSlider";
import { ModalInsuff } from "../Insuff/ModalInsuff";
import { ModalWrapper } from "entities/ModalWrapper/ModalWrapper";
import { useForm } from "react-hook-form";
import { TCard, TCreateCardFormData, TTariff } from "types/cards.types";
import { useDispatch, useSelector } from "react-redux";
import {
  getCategoryList,
  getErrors,
  getRequiredbaseList,
  getTariff,
} from "store/cards/cardsSelector";
import { AppDispatch } from "store/store";
import { createCard, setErrors, updateCard } from "store/cards/cardsSlice";
import { getUserId } from "store/user/userSelector";
import { SvgIcon } from "entities/SvgIcon/SvgIcon";
import axios, { AxiosError } from "axios";
import { barterList } from "shared/Constants";
import { getSettings } from "store/admin/adminSelector";
import { useTranslation } from "react-i18next";

type TProps = {
  card?: TCard;
  isEdit?: boolean;
  view: TToggleOBj;
  setView: (toggle: TToggleOBj) => void;
  barter?: boolean;
};

export const ModalCreateCard: FC<TProps> = ({
  card,
  view,
  setView,
  isEdit,
  barter,
}) => {
  const { t } = useTranslation();

  const dispatch: AppDispatch = useDispatch();
  const err = useSelector(getErrors);
  const user = useSelector(getUserId);
  const tariff = useSelector(getTariff);
  const categoryList = useSelector(getCategoryList);
  const requiredbaseList = useSelector(getRequiredbaseList);
  const settings = useSelector(getSettings);

  const downloadRef = useRef<HTMLInputElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [addClass, setAddClass] = useState(true);
  const [touchTariff, setTouchTariff] = useState<boolean>(false);
  const [hint, setHint] = useState({
    text: t("doi_dialog"),
    show: false,
  });
  const [showModals, setShowModals] = useState<TToggleOBj>({
    noMoney: false,
    citation: false,
  });

  const [rangeValue, setRangeValue] = useState({
    min: isEdit && card ? card.tariff.period : 0,
    max: 13,
  });

  const [metaData, setMetaData] = useState(
    !isEdit
      ? {
          theme: "",
          authors: "",
          publicationYear: "",
          journalName: "",
          volume: "",
          pageNumbers: "",
        }
      : {
          theme: card?.theme,
          authors: card?.article.authors.map((a) => a.name).join(", "),
          publicationYear: card?.article.publication_year,
          journalName: card?.article.journal_name,
          volume: card?.article.volume,
          pageNumbers: card?.article.page_numbers,
        }
  );
  const [isSubmit, setIsSubmit] = useState(false);
  const [baseSelected, setBaseSelected] = useState(
    isEdit && card ? card.base.name : ""
  );

  // const price = useMemo(() => {
  // 	return settings?.price_publication && settings.price_publication[Object.keys(settings.price_publication).filter(item => (
  // 		item.includes(baseSelected)
  // 	))[0]]
  // }, [baseSelected, settings?.price_publication])

  const sortTariffArr: TTariff[] = useMemo(() => {
    const arr = tariff
      ? structuredClone([...tariff].sort((a, b) => a.period - b.period))
      : [];
    if (settings) {
      for (let i = 0; i < arr.length; i++) {
        let sum = 0;
        if (arr[i].period === 0) {
          arr[i].scicoins = 0;
        } else if (arr[i].period < settings.minimal_duration_card) {
          continue;
        } else if (arr[i].period < settings.discount.month) {
          if (baseSelected.toLowerCase() === t("other") || baseSelected.toLowerCase() === t("vak")) {
            sum =
              (settings.price_publication["вак"] /
                settings.minimal_duration_card) *
              arr[i].period;
            arr[i].scicoins = sum - (sum % 10);
          } else if (
            baseSelected.toLowerCase() === "web of science" ||
            baseSelected.toLowerCase() === "scopus"
          ) {
            sum =
              (settings.price_publication["scopus/wos"] /
                settings.minimal_duration_card) *
              arr[i].period;
            arr[i].scicoins = sum - (sum % 10);
          } else {
            sum =
              (settings.price_publication["ринц"] /
                settings.minimal_duration_card) *
              arr[i].period;
          }
        } else if (arr[i].period >= settings.discount.month) {
          if (baseSelected.toLowerCase() === t("other") || baseSelected.toLowerCase() === t("vak")) {
            sum =
              ((settings.price_publication["вак"] *
                ((100 - settings.discount.percent) / 100)) /
                settings.minimal_duration_card) *
                (arr[i].period - settings.discount.month) +
              (settings.price_publication["вак"] /
                settings.minimal_duration_card) *
                settings.discount.month;
          } else if (
            baseSelected.toLowerCase() === "web of science" ||
            baseSelected.toLowerCase() === "scopus"
          ) {
            sum =
              ((settings.price_publication["scopus/wos"] *
                ((100 - settings.discount.percent) / 100)) /
                settings.minimal_duration_card) *
                (arr[i].period - settings.discount.month) +
              (settings.price_publication["scopus/wos"] /
                settings.minimal_duration_card) *
                settings.discount.month;
          } else {
            sum =
              ((settings.price_publication["ринц"] *
                ((100 - settings.discount.percent) / 100)) /
                settings.minimal_duration_card) *
                (arr[i].period - settings.discount.month) +
              (settings.price_publication["ринц"] /
                settings.minimal_duration_card) *
                settings.discount.month;
          }
        }
        arr[i].scicoins = sum - (sum % 10);
      }
    }
    const newArr = [arr[0]];
    for (let i = 1; i < arr.length; i++) {
      if (arr[i].period !== arr[i - 1].period) {
        newArr.push(arr[i]);
      }
    }
    if (settings) {
      newArr.splice(1, settings.minimal_duration_card - 1);
    }
    if (!isEdit) {
      newArr.splice(11);
    }
    return newArr;
  }, [tariff, baseSelected]);

  const step = useMemo(() => {
    return settings?.minimal_duration_card &&
      rangeValue.min <= settings?.minimal_duration_card
      ? settings.minimal_duration_card
      : 1;
  }, [settings, rangeValue.min]);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    getValues,
    formState: { errors },
  } = useForm<TCreateCardFormData>({
    defaultValues: {
      category: card?.category.map((c) => c.id).join(","),
      requiredbase: card?.base.id,
      citationUrl: card?.article.citation_url,
      authors: card?.article.authors
        ? card?.article.authors.map((a) => a.name).join(", ")
        : "",
      publicationYear: card?.article.publication_year,
      doi: card?.article.doi,
      journalName: card?.article.journal_name,
      volume: card?.article.volume,
      pageNumbers: card?.article.page_numbers,
      abstract: card?.article.abstract,
      keywords: card?.article.keywords.map((k) => k.name).join(", "),
      isExchangable: card?.is_exchangable ? `${+card?.is_exchangable}` : "",
    },
  });

  const { onBlur } = register("doi");

  const onSubmit = handleSubmit(async (data) => {
    if (!isEdit && tariff) {
      if (err !== null) {
        dispatch(setErrors(null));
      }
      await dispatch(
        createCard(
          {
            ...data,
            user,
            tariff:
              sortTariffArr.find((tariff) => tariff.period === +data.tariff)
                ?.id || sortTariffArr[0].id,
          },
          barter ? true : false
        )
      );
      setIsSubmit(true);
    } else {
      if (card) {
        if (err !== null) {
          dispatch(setErrors(null));
        }
        dispatch(updateCard(card?.article.id, card.id, { ...data, user }));
        setIsSubmit(true);
      }
    }
  });

  useEffect(() => {
    const closeModal = () => {
      if (err === null && isSubmit) {
        removeModals(setAddClass, setView, view, isEdit ? "edit" : "create");
      }
    };

    closeModal();
    setIsSubmit(false);
  }, [err, isEdit, isSubmit, setView, view]);

  // useEffect(() => {
  //     const verifyPayment = () => {
  //         if (err?.message) {
  //             setShowModals(old => ({ ...old, noMoney: true }))
  //         }
  //     }

  //     verifyPayment()
  // }, [err])

  useEffect(() => {
    const transformationLink = () => {
      if (
        metaData.authors &&
        metaData.journalName &&
        metaData.publicationYear
      ) {
        if (!isEdit && metaData.theme) {
          const citationUrl =
            (metaData.authors ? `${metaData.authors}. ` : "") +
            (metaData.theme ? `${metaData.theme} // ` : "") +
            (metaData.journalName ? `${metaData.journalName}. ` : "") +
            (metaData.publicationYear ? `${metaData.publicationYear}. ` : "") +
            (metaData.volume ? `№ ${metaData.volume}. ` : "") +
            (metaData.pageNumbers ? `P. ${metaData.pageNumbers}.` : "");
          setValue("citationUrl", citationUrl);
        } else {
          const citationUrl =
            (metaData.authors ? `${metaData.authors}. ` : "") +
            (metaData.theme ? `${metaData.theme} // ` : "") +
            (metaData.journalName ? `${metaData.journalName}. ` : "") +
            (metaData.publicationYear ? `${metaData.publicationYear}. ` : "") +
            (metaData.volume ? `№ ${metaData.volume}. ` : "") +
            (metaData.pageNumbers ? `P. ${metaData.pageNumbers}.` : "");
          setValue("citationUrl", citationUrl);
        }
      }
    };

    transformationLink();
  }, [isEdit, metaData, setValue]);

  useEffect(() => {
    const checkVerifyMeta = () => {
      if (
        (err &&
          (err.authors ||
            err.publicationYear ||
            err.journalName ||
            err.volume ||
            err.pageNumbers)) ||
        errors.authors ||
        errors.publicationYear ||
        errors.journalName
      ) {
        setShowModals((old) => ({ ...old, citation: true }));
      }
    };

    checkVerifyMeta();
  }, [err, errors]);

  const handleClick = (ref: MutableRefObject<HTMLInputElement | null>) => {
    ref.current?.click();
  };

  const handleChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files?.length) {
      if (e.currentTarget.files[0].size <= 20971520) {
        setValue("file", e.currentTarget.files[0]);
        setIsLoaded(true);
        clearErrors("file");
      } else {
        setError("file", { message: t("file_size") });
      }
    }
  };

  const handleChangeCitationUrl = useCallback(
    async (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      try {
        const response = await axios.get(
          `https://api.crossref.org/works/${e.currentTarget.value}`
        );
        let doi = response.data.message.DOI ? response.data.message.DOI : "";
        let publicationYear = response.data.message.issued["date-parts"][0][0];
        let authorArray: string[] = [];
        for (let i = 0; i < response.data.message.author?.length; i++) {
          authorArray.push(
            `${response.data.message.author[i].given}  ${response.data.message.author[i].family}`
          );
        }
        let journalName = response.data.message.publisher
          ? response.data.message.publisher
          : "";
        let volume = response.data.message.volume
          ? response.data.message.volume
          : "";
        let pageNumbers = response.data.message.page
          ? response.data.message.page
          : "";
        let abstract = response.data.message.abstract
          ? response.data.message.abstract
          : "";
        let parseAbstract = "";
        let isValid = true;
        for (let i = 0; i < abstract.length; i++) {
          if (abstract[i - 1] === ">") {
            isValid = true;
          }
          if (abstract[i] === "<") {
            isValid = false;
          }
          if (
            isValid &&
            !(
              abstract[i] === " " &&
              i + 1 < abstract.length &&
              abstract[i + 1] === " "
            ) &&
            !(abstract[i] === "\n")
          ) {
            parseAbstract += abstract[i];
          }
        }
        let theme: string = response.data.message.title[0]
          ? response.data.message.title[0]
          : "";
        if (theme.includes("<b>")) {
          theme = theme.replace("<b>", "");
          theme = theme.replace("</b>", "");
        }
        const citationUrl =
          (authorArray.join(", ") ? `${authorArray.join(", ")}. ` : "") +
          (theme ? `${theme} // ` : "") +
          (journalName ? `${journalName}. ` : "") +
          (publicationYear ? `${publicationYear}. ` : "") +
          (volume ? `№ ${volume}. ` : "") +
          (pageNumbers ? `P. ${pageNumbers}.` : "");
        setMetaData({
          theme: theme,
          publicationYear: publicationYear,
          authors: authorArray.join(", "),
          journalName: journalName,
          volume: volume,
          pageNumbers: pageNumbers,
        });
        setValue("doi", doi);
        setValue("theme", theme);
        setValue("publicationYear", publicationYear);
        setValue("authors", authorArray.join(", "));
        setValue("journalName", journalName);
        setValue("volume", volume);
        setValue("pageNumbers", pageNumbers);
        setValue("abstract", parseAbstract);
        setValue("citationUrl", citationUrl);
        setHint((old) => ({
          ...old,
          text: t("autocomplete_succeeded"),
        }));
      } catch (error) {
        const err = error as AxiosError;
        if (err.response?.status === 404) {
          setHint((old) => ({
            ...old,
            text: t("autocomplete_faild"),
          }));
        }
      }
    },
    [setValue]
  );

  const handleValidation = (
    e: FormEvent<HTMLTextAreaElement>,
    pattern: RegExp
  ) => {
    const value = e.currentTarget.value;
    if (!pattern.test(value)) {
      e.currentTarget.value = e.currentTarget.value.substring(
        0,
        e.currentTarget.value.length - 1
      );
    }
  };

  return (
    <ModalWrapper
      view={view}
      setView={setView}
      changeEl={isEdit ? "edit" : "create"}
      addClass={addClass}
      setAddClass={setAddClass}
    >
      <form className={style.modalCreateCard} onSubmit={onSubmit}>
        <div className={style.modalCreateCard__top}>
          {isEdit ? (
            <>
              <span className={style.topText}>
                {t("card")} № {card?.cart_number}
                <div className={style.downloadWrapper}>
                  {errors.file ? (
                    <span className={style.errorText}>
                      {errors.file.message}
                    </span>
                  ) : (
                    downloadRef.current &&
                    downloadRef.current?.files && (
                      <span className={style.modalCreateCard__title}>
                        {downloadRef.current?.files[0]?.name}
                      </span>
                    )
                  )}
                  <button
                    type="button"
                    onClick={() => handleClick(downloadRef)}
                    className={cn(
                      "btn-reset",
                      style.modalCreateCard__btnDownload,
                      isLoaded ? style.fileLoaded : ""
                    )}
                  >
                    <SvgIcon name={"refresh"} />
                  </button>
                </div>
              </span>
              <span className={style.topText}>{card?.theme}</span>
            </>
          ) : (
            <>
              <div className={style.downloadWrapper}>
                <button
                  type="button"
                  onClick={() => handleClick(downloadRef)}
                  className={cn(
                    "btn-reset",
                    style.modalCreateCard__btnDownload,
                    isLoaded ? style.fileLoaded : ""
                  )}
                >
                  <SvgIcon name={"download"} />
                </button>
                {errors.file ? (
                  <span className={style.errorText}>{errors.file.message}</span>
                ) : (
                  downloadRef.current &&
                  downloadRef.current?.files && (
                    <span className={style.modalCreateCard__title}>
                      {downloadRef.current?.files[0]?.name}
                    </span>
                  )
                )}
              </div>
              <p className={style.modalCreateCard__title}>{t("upload_file")}</p>
            </>
          )}
          <input
            onChange={handleChangeFile}
            ref={downloadRef}
            name={"file"}
            type="file"
            accept=".pdf"
            className="is-hidden"
          />
        </div>
        <div className={style.modalCreateCard__info}>
          <div className={style.modalCreateCard__fieldsBlock}>
            <div>
              <Dropdown
                {...register("requiredbase", {
                  required: {
                    value: !isEdit ? true : false,
                    message: t("required_card_field", { name: t("indexing") }),
                  },
                })}
                name={"requiredbase"}
                placeholder={card?.base ? card.base.name : t("indexing")}
                setInputValue={setValue}
                items={requiredbaseList ? requiredbaseList : []}
                setIsBaseSelected={setBaseSelected}
                disabled={isEdit}
                addStyle={
                  (err?.requiredbase || errors.requiredbase) && style.fieldError
                }
                action={true}
              />
              {err?.requiredbase ? (
                err?.requiredbase.map((error) => (
                  <span className={style.errorText}>{error}</span>
                ))
              ) : errors.requiredbase ? (
                <span className={style.errorText}>
                  {errors.requiredbase.message}
                </span>
              ) : (
                ""
              )}
            </div>
            <div className={style.fieldWrapper}>
              <input
                type="text"
                placeholder={isEdit && card ? card.article.doi : "doi"}
                {...register("doi", {
                  required: {
                    value: !isEdit ? true : false,
                    message: t("required_card_field", { name: "doi" }),
                  },
                  disabled: isEdit ? true : false,
                })}
                onChange={handleChangeCitationUrl}
                onFocus={() => setHint((old) => ({ ...old, show: true }))}
                onBlur={(e) => {
                  setHint((old) => ({ ...old, show: false }));
                  onBlur(e);
                }}
                className={cn(
                  "input-reset",
                  style.modalCreateCard__input,
                  style.doi,
                  (err?.doi || errors.doi) && style.fieldError,
                  isEdit ? style.disabled : ""
                )}
              />
              {hint.show ? <p className={style.hintDoi}>{hint.text}</p> : ""}
              {err?.doi ? (
                err?.doi.map((error) => (
                  <span className={style.errorText}>{error}</span>
                ))
              ) : errors.doi ? (
                <span className={style.errorText}>{errors.doi.message}</span>
              ) : (
                ""
              )}
            </div>
            <div>
              <Dropdown
                {...register("category", {
                  required: {
                    value: !isEdit ? true : false,
                    message: t("area_message"),
                  },
                })}
                name={"category"}
                placeholder={
                  card?.category.length === 1
                    ? card.category[0].name
                    : card?.category.length && card?.category.length > 1
                    ? `${card?.category.length} ${t("area.many")}`
                    : t("area.one")
                }
                setInputValue={setValue}
                items={categoryList ? categoryList : []}
                disabled={isEdit}
                multi
                addStyle={
                  (err?.category || errors.category) && style.fieldError
                }
              />
              {err?.category ? (
                err?.category.map((error) => (
                  <span className={style.errorText}>{error}</span>
                ))
              ) : errors.category ? (
                <span className={style.errorText}>
                  {errors.category.message}
                </span>
              ) : (
                ""
              )}
            </div>
            <div>
              <input
                type="text"
                placeholder={isEdit && card ? card.theme : t("article_title")}
                {...register("theme", {
                  required: {
                    value: !isEdit ? true : false,
                    message: t("required_card_field", {
                      name: t("article_title"),
                    }),
                  },
                  minLength: 1,
                  disabled: isEdit ? true : false,
                })}
                onChange={(e) =>
                  setMetaData((old) => ({ ...old, theme: e.target.value }))
                }
                className={cn(
                  "input-reset",
                  style.modalCreateCard__input,
                  (err?.doi || errors.doi) && style.fieldError,
                  isEdit ? style.disabled : ""
                )}
              />
              {err?.theme ? (
                err?.theme.map((error) => (
                  <span className={style.errorText}>{error}</span>
                ))
              ) : errors.theme ? (
                <span className={style.errorText}>{errors.theme.message}</span>
              ) : (
                ""
              )}
            </div>
            <div>
              <textarea
                {...register("citationUrl", {
                  required: {
                    value: !isEdit ? true : false,
                    message: t("required_card_field", {
                      name: t("citation_link.2"),
                    }),
                  },
                })}
                placeholder={t("citation_link.1")}
                className={cn(
                  "input-reset",
                  style.modalCreateCard__input,
                  style.fieldCitation,
                  (err?.doi || errors.doi) && style.fieldError
                )}
                onClick={() =>
                  setShowModals((old) => ({ ...old, citation: true }))
                }
              />
              {err?.citationUrl ? (
                err?.citationUrl.map((error) => (
                  <span className={style.errorText}>{error}</span>
                ))
              ) : errors.citationUrl ? (
                <span className={style.errorText}>
                  {errors.citationUrl.message}
                </span>
              ) : (
                ""
              )}
            </div>
            <div>
              <Dropdown
                {...register("isExchangable", {
                  required: {
                    value: !isEdit ? true : false,
                    message: t("required_card_field", {name: t("possibility_exchange")}),
                  },
                })}
                name={"isExchangable"}
                setInputValue={setValue}
                placeholder={
                  !isEdit
                    ? t("possibility_exchange")
                    : card?.is_exchangable
                    ? t("present")
                    : !card?.is_exchangable
                    ? t("no_exchange")
                    : ""
                }
                items={barterList}
                addStyle={
                  (err?.is_exchangable || errors.isExchangable) &&
                  style.fieldError
                }
              />
              {err?.is_exchangable ? (
                err?.is_exchangable.map((error) => (
                  <span className={style.errorText}>{error}</span>
                ))
              ) : errors.isExchangable ? (
                <span className={style.errorText}>
                  {errors.isExchangable.message}
                </span>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className={style.modalCreateCard__textContainer}>
            <label
              htmlFor={"abstractText"}
              className={style.modalCreateCard__label}
            >
              {t("annotation_text")}
            </label>
            <textarea
              {...register("abstract", {
                required: {
                  value: true,
                  message: t("required_card_field", {name: t("annotation_text")}),
                },
              })}
              className={cn("input-reset", style.modalCreateCard__textAbstract)}
            />
            {err?.abstract ? (
              err?.abstract.map((error) => (
                <span className={style.errorText}>{error}</span>
              ))
            ) : errors.abstract ? (
              <span className={style.errorText}>{errors.abstract.message}</span>
            ) : (
              ""
            )}
          </div>
          <div className={style.modalCreateCard__term}>
            <p className={style.modalCreateCard__termTitle}>{t("visibility_period")}</p>
            <RangeSlider
              {...register("tariff", { required: !isEdit })}
              name={"tariff"}
              tariffValue={sortTariffArr}
              value={rangeValue}
              setValue={setValue}
              min={0}
              max={isEdit && card ? card.tariff.period * 2 : 13}
              step={step}
              onChange={setRangeValue}
              setTouchTariff={setTouchTariff}
              disabled={isEdit || !baseSelected}
            />
            {err?.message ? (
              <span className={style.errorText}>{err?.message}</span>
            ) : errors.tariff ? (
              <span className={style.errorText}>{errors.tariff.message}</span>
            ) : (
              ""
            )}
          </div>
          <div className={style.modalCreateCard__textContainer}>
            <label
              htmlFor={"abstractText"}
              className={style.modalCreateCard__label}
            >
              {t("keywords")}
            </label>
            <textarea
              {...register("keywords")}
              className={cn("input-reset", style.modalCreateCard__textKeywords)}
            />
          </div>
        </div>
        <div className={style.modalCreateCard__btnBlock}>
          <button
            type="submit"
            className={cn(
              "btn-reset",
              styleBtns.btnAstral,
              style.modalCreateCard__btn
            )}
          >
            {isEdit ? t("submit") : t("create")}
          </button>
          <button
            type={"button"}
            className={cn(
              "btn-reset",
              styleBtns.btnAstral,
              style.modalCreateCard__btn
            )}
            onClick={() =>
              removeModals(
                setAddClass,
                setView,
                view,
                isEdit ? "edit" : "create"
              )
            }
          >
            {t("cancel")}
          </button>
        </div>
        <div
          className={cn(style.modalCreateCard__citationBlock)}
          style={
            !showModals.citation
              ? { pointerEvents: "none", display: "none" }
              : {}
          }
        >
          <div
            className={style.overlay}
            onClick={() =>
              setShowModals((old) => ({ ...old, citation: false }))
            }
          ></div>
          <div className={style.metaFieldWrapper}>
            <label
              htmlFor="authors"
              className={style.modalCreateCard__citationLabel}
            >
              {t("authors.1")}
            </label>
            <textarea
              {...register("authors", {
                required: {
                  value: true,
                  message: t("required_card_field", {name: t("authors.2")}),
                },
              })}
              onChange={(e) =>
                setMetaData((old) => ({ ...old, authors: e.target.value }))
              }
              onInput={(e) => handleValidation(e, /^[A-ZА-ЯЁ\.\s]{1,}$/i)}
              className={cn("input-reset", style.modalCreateCard__bigTextArea)}
            />
            {err?.authors ? (
              err?.authors.map((error) => (
                <span className={style.errorText}>{error}</span>
              ))
            ) : errors.authors ? (
              <span className={style.errorText}>{errors.authors.message}</span>
            ) : (
              ""
            )}
          </div>
          <div className={style.metaFieldWrapper}>
            <label
              htmlFor="year"
              className={style.modalCreateCard__citationLabel}
            >
              {t("year")}
            </label>
            <textarea
              {...register("publicationYear", {
                required: {
                  value: true,
                  message: t("required_card_field", {name: t("year")}),
                },
              })}
              onChange={(e) =>
                setMetaData((old) => ({
                  ...old,
                  publicationYear: e.target.value,
                }))
              }
              onInput={(e) => handleValidation(e, /^[0-9]{1,4}$/)}
              className={cn(
                "input-reset",
                style.modalCreateCard__smallTextArea
              )}
            />
            {err?.publication_year ? (
              err?.publication_year.map((error) => (
                <span className={style.errorText}>{error}</span>
              ))
            ) : errors.publicationYear ? (
              <span className={style.errorText}>
                {errors.publicationYear.message}
              </span>
            ) : (
              ""
            )}
          </div>
          <div className={style.metaFieldWrapper}>
            <label
              htmlFor="journal"
              className={style.modalCreateCard__citationLabel}
            >
              {t("journal")}
            </label>
            <textarea
              {...register("journalName", {
                required: {
                  value: true,
                  message:
                  t("required_card_field", {name: t("journal")}),
                },
              })}
              onChange={(e) =>
                setMetaData((old) => ({ ...old, journalName: e.target.value }))
              }
              className={cn(
                "input-reset",
                style.modalCreateCard__smallTextArea
              )}
            />
            {err?.journal_name ? (
              err?.journal_name.map((error) => (
                <span className={style.errorText}>{error}</span>
              ))
            ) : errors.journalName ? (
              <span className={style.errorText}>
                {errors.journalName.message}
              </span>
            ) : (
              ""
            )}
          </div>
          <div className={style.modalCreateCard__citationBlockBottom}>
            <div className={style.modalCreateCard__shortBlock}>
              <label
                htmlFor="volume"
                className={style.modalCreateCard__citationLabel}
              >
                {t("volume")}
              </label>
              <textarea
                {...register("volume")}
                onChange={(e) =>
                  setMetaData((old) => ({ ...old, volume: e.target.value }))
                }
                onInput={(e) => handleValidation(e, /^[0-9]{1,}$/)}
                className={cn(
                  "input-reset",
                  style.modalCreateCard__shortTextArea
                )}
              />
              {err?.volume
                ? err?.volume.map((error) => (
                    <span className={style.errorText}>{error}</span>
                  ))
                : ""}
            </div>
            <div className={style.modalCreateCard__shortBlock}>
              <label
                htmlFor="pages"
                className={style.modalCreateCard__citationLabel}
              >
                {t("page")}
              </label>
              <textarea
                {...register("pageNumbers")}
                onChange={(e) =>
                  setMetaData((old) => ({
                    ...old,
                    pageNumbers: e.target.value,
                  }))
                }
                onInput={(e) => handleValidation(e, /^[0-9-]{1,}$/)}
                className={cn(
                  "input-reset",
                  style.modalCreateCard__shortTextArea
                )}
              />
              {err?.page_numbers
                ? err?.page_numbers.map((error) => (
                    <span className={style.errorText}>{error}</span>
                  ))
                : ""}
            </div>
          </div>
        </div>
      </form>
      {/* {
                showModals.noMoney &&
                <ModalInsuff view={showModals} setView={setShowModals} />
            } */}
    </ModalWrapper>
  );
};
