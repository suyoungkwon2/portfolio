import { ReadingProgress } from "../story/ReadingProgress";
import { CompanyProblem, UserProblem } from "./ActConflict";
import { Define, Interview } from "./ActListen";
import { Integration, LiveImpact, Reflection } from "./ActPayoff";
import { AbTest, Copilot, Evaluation } from "./ActTrust";
import { Context, Hero, Hook, Impact, Roles } from "./ActSetup";

// The AI Curation case study as one story, "Follow one theme": the title
// "Matcha Core: Trending Now" is typed in the hero, searched in 08's
// Copilot, added to the Google Sheet in 11 and goes live on the same
// homepage that went stale in 04. Built from
// docs/projects/ai-curation-web-spec.md, which owns the copy and the numbers.
export function AiCurationCaseStudy() {
  return (
    <>
      <ReadingProgress />
      <Hero />
      <Context />
      <Impact />
      <Roles />
      <Hook />
      <UserProblem />
      <CompanyProblem />
      <Interview />
      <Define />
      <Copilot />
      <Evaluation />
      <AbTest />
      <Integration />
      <LiveImpact />
      <Reflection />
    </>
  );
}
