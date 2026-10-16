import { AbTest, Architecture } from "./ActProof";
import { CompanyProblem, UserProblem } from "./ActConflict";
import { Improvement, IntegrationImpact } from "./ActPayoff";
import { Context, Hero, Impact, Roles } from "./ActSetup";
import { Define, PocApproach } from "./ActTurn";
import { resolveAssets } from "./assets.server";
import { ReadingProgress } from "./ReadingProgress";
import { AssetProvider } from "./ui";

// The AI Search case study as one story, "Follow one typo": the query
// "cabage" fails in the hero, bounces off in 01, frustrates in 04, is found
// in 07, travels the system in 08 and lands in a cart in 11. Built from
// docs/projects/ai-search-web-spec.md, which owns the copy and the numbers.
//
// Replaces the whole template body (hero, 10s summary, PDF slides). The
// sidebar's "On this page" list, fed by each chapter's data-chapter, is the
// chapter nav.
export function AiSearchCaseStudy() {
  return (
    <AssetProvider assets={resolveAssets()}>
      <ReadingProgress />
      <Hero />
      <Context />
      <Impact />
      <Roles />
      <UserProblem />
      <CompanyProblem />
      <Define />
      <PocApproach />
      <Architecture />
      <AbTest />
      <Improvement />
      <IntegrationImpact />
    </AssetProvider>
  );
}
