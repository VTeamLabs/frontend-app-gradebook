/* eslint-disable import/no-self-import */
import { StrictDict } from 'utils';
import * as module from './filters';
import simpleSelectorFactory from '../utils';

// Transformers
/**
 * chooseRelevantAssignmentData(assignment)
 * formats the assignment api data for an assignment object for consumption
 * @param {object} assignment - assignment data to prepare
 * @return {object} - formatted data ({ label, subsectionLabel, type, id })
 */
export const chooseRelevantAssignmentData = ({
  label,
  subsection_name: subsectionLabel,
  category: type,
  module_id: id,
}) => ({
  label, subsectionLabel, type, id,
});

/**
 * getAssignmentsFromResultsSubstate(results)
 * returns the section_breakdown of the first results entry
 * defaulting to an empty list.
 * @param {[object[]]} results - list of result entries from grades fetch
 * @return {object} - section_breakdown of first grade entry
 */
export const getAssignmentsFromResultsSubstate = (results) => (
  (results[0] || {}).section_breakdown || []
);

/**
 * relevantAssignmentDataFromResults
 * returns assignment info from grades results for the assignment with the given id
 * @param {object} grades - grades fetch result
 * @param {string} id - selected assignment id from assignment filter
 * @return {object} assignment data with type, label, and subsectionLabel
 */
export const relevantAssignmentDataFromResults = (grades, id) => (
  module.getAssignmentsFromResultsSubstate(grades)
    .map(module.chooseRelevantAssignmentData)
    .find(assignment => assignment.id === id)
);

// Selectors
/**
 * allFilters(state)
 * returns the top-level filter state.
 * @param {object} state - redux state
 * @return {object} - filter substate from redux state
 */
export const allFilters = (state) => state.filters || {};

/**
 * selectableAssignments(state)
 * @param {object} state - redux state
 * @return {object[]} - list of selectable assignment objects, filtered if there is an
 *   assignmentType filter selected.
 */
export const selectableAssignments = (state) => {
  const selectedAssignmentType = allFilters(state).assignmentType;
  const needToFilter = selectedAssignmentType && selectedAssignmentType !== 'All';
  const allAssignments = getAssignmentsFromResultsSubstate(state.grades.results);
  if (needToFilter) {
    return allAssignments.filter(
      (assignment) => assignment.category === selectedAssignmentType,
    );
  }
  return allAssignments;
};

/**
 * Returns the relevant assignment data for all selectable assignments
 * @param {object} state - redux state
 * @return {object[]} - object of assignment data entries [({ label, subsectionLabel, type, id })]
 */
export const selectableAssignmentLabels = (state) => (
  selectableAssignments(state).map(chooseRelevantAssignmentData)
);

export const simpleSelectors = simpleSelectorFactory(
  ({ filters }) => filters,
  [
    'assignment',
    'assignmentGradeMax',
    'assignmentGradeMin',
    'assignmentType',
    'cohort',
    'courseGradeMax',
    'courseGradeMin',
    'track',
    'includeCourseRoleMembers',
  ],
);
/**
 * Returns the id of the selected assignment filter
 * @param {object} state - redux state
 * @return {string} - assignment id
 */
export const selectedAssignmentId = (state) => (simpleSelectors.assignment(state) || {}).id;

/**
 * selectedAssignmentLabel(state)
 * Returns the label of the selected assignment filter
 * @param {object} state - redux state
 * @return {string} - assignment label
 */
export const selectedAssignmentLabel = (state) => (simpleSelectors.assignment(state) || {}).label;

export default StrictDict({
  ...simpleSelectors,
  relevantAssignmentDataFromResults,
  selectedAssignmentId,
  selectedAssignmentLabel,
  selectableAssignmentLabels,
  selectableAssignments,
  allFilters,
  chooseRelevantAssignmentData,
  getAssignmentsFromResultsSubstate,
});
