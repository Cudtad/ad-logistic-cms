import { createContext } from "react";
import { createMongoAbility, MongoAbility } from "@casl/ability";
import { createContextualCan } from '@casl/react';

export const AbilityContext = createContext<MongoAbility>(
  createMongoAbility([]),
);
export const Can = createContextualCan(AbilityContext.Consumer);
