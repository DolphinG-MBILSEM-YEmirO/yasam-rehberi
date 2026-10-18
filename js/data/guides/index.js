// Registry of life-event guides. Add a new guide by creating a module next to
// this file and listing it here; the home page and router pick it up.

import { movingGuide } from './moving.js';
import { newBabyGuide } from './new-baby.js';
import { buyingCarGuide } from './buying-car.js';
import { marriageGuide } from './marriage.js';
import { leavingJobGuide } from './leaving-job.js';
import { retirementGuide } from './retirement.js';

export const guides = [movingGuide, newBabyGuide, buyingCarGuide, marriageGuide, leavingJobGuide, retirementGuide];

// Planned guides shown on the home page as "coming soon".
export const upcomingGuides = [];

export function findGuide(id) {
  return guides.find((guide) => guide.id === id) || null;
}

/** True when every question of the guide has an answer. */
export function isComplete(guide, answers) {
  return guide.questions.every((q) => Boolean(answers[q.id]));
}
