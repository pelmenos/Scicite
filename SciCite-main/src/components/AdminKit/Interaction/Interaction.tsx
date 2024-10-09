import cn from "classnames";
import { FC, useState } from "react";
import style from "./Interaction.module.scss";
import { ModalCreateTransaction } from "components/AdminKit/modals/ModalCreateTransaction/ModalCreateTransaction";
import { TToggleOBj } from "shared/Functions";
import { InteractionHelp } from "./InteractionHelp/InteractionHelp";
import { InteractionArgument } from "./InteractionArgument/InteractionArgument";
import { InteractionTransaction } from "./InteractionTransaction/InteractionTransaction";
import { SvgIcon } from "entities/SvgIcon/SvgIcon";

type TProps = {
  currentSection: number;
  setCurrentSubSection: (num: number) => void;
  setCurrentMainSection: (num: number) => void;
};

export const Interaction: FC<TProps> = ({
  currentSection,
  setCurrentSubSection,
  setCurrentMainSection,
}) => {
  const [showModals, setShowModals] = useState<TToggleOBj>({
    createTrnsaction: false,
  });

  const [currentSearchValue, setCurrentSearchValue] = useState<string>("");

  return (
    <div className={style.subSection}>
      <div
        className={style.top}
        style={
          currentSection === 3
            ? { justifyContent: "", columnGap: "20.25rem" }
            : { justifyContent: "center" }
        }
      >
        {currentSection !== 3 ? (
          ""
        ) : (
          <button
            className={cn("btn-reset", style.btnTransaction)}
            onClick={() =>
              setShowModals((old) => ({ ...old, createTrnsaction: true }))
            }
          >
            создать транзакцию
            <SvgIcon name={"plus"} />
          </button>
        )}
        <form className={style.search}>
          <input
            className={cn("input-reset", style.searchField)}
            placeholder={"имя пользователя"}
            onChange={(e) => setCurrentSearchValue(e.target.value)}
          />
          <button className={cn("btn-reset", style.searchBtn)} type="button">
            <SvgIcon name="search" />
          </button>
        </form>
      </div>
      {(currentSection === 1 && (
        <InteractionHelp
          setCurrentMainSection={setCurrentMainSection}
          setCurrentSubSection={setCurrentSubSection}
          currentSearchValue={currentSearchValue}
        />
      )) ||
        (currentSection === 2 && (
          <InteractionArgument
            setCurrentMainSection={setCurrentMainSection}
            setCurrentSubSection={setCurrentSubSection}
            currentSearchValue={currentSearchValue}
          />
        )) ||
        (currentSection === 3 && (
          <InteractionTransaction
            setCurrentMainSection={setCurrentMainSection}
            setCurrentSubSection={setCurrentSubSection}
            currentSearchValue={currentSearchValue}
          />
        ))}
      {showModals.createTrnsaction && (
        <ModalCreateTransaction view={showModals} setView={setShowModals} />
      )}
    </div>
  );
};
