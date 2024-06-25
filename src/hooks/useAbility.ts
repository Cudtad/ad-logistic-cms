
import { AbilityContext } from "@/utils/context/ability";
import { useContext } from "react";

const useAbility = () => {
  return useContext(AbilityContext);
};

export default useAbility;
