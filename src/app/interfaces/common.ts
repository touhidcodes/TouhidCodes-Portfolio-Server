import { Skill, SkillCategory } from "../../../generated/prisma/client";

export type TGroupedSkills = {
  [key: string]: (Skill & { skillCategory: SkillCategory })[];
};
