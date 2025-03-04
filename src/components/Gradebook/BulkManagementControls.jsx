/* eslint-disable react/sort-comp, react/button-has-type */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { StatefulButton } from '@edx/paragon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faSpinner } from '@fortawesome/free-solid-svg-icons';

import actions from 'data/actions';
import selectors from 'data/selectors';

export class BulkManagementControls extends React.Component {
  handleClickDownloadInterventions = () => {
    this.props.downloadInterventionReport(this.props.courseId);
    window.location = this.props.interventionExportUrl;
  };

  // At present, we don't store label and value in google analytics. By setting the label
  // property of the below events, I want to verify that we can set the label of google anlatyics
  // The following properties of a google analytics event are:
  // category (used), name(used), lavel(not used), value(not used)
  handleClickExportGrades = () => {
    this.props.downloadBulkGradesReport(this.props.courseId);
    window.location = this.props.gradeExportUrl;
  };

  render() {
    return this.props.showBulkManagement && (
      <div>
        <StatefulButton
          variant="outline-primary"
          onClick={this.handleClickExportGrades}
          state={this.props.showSpinner ? 'pending' : 'default'}
          labels={{
            default: 'Bulk Management',
            pending: 'Bulk Management',
          }}
          icons={{
            default: <FontAwesomeIcon className="mr-2" icon={faDownload} />,
            pending: <FontAwesomeIcon className="fa-spin mr-2" icon={faSpinner} />,
          }}
          disabledStates={['pending']}
        />
        <StatefulButton
          variant="outline-primary"
          onClick={this.handleClickDownloadInterventions}
          state={this.props.showSpinner ? 'pending' : 'default'}
          className="ml-2"
          labels={{
            default: 'Interventions*',
            pending: 'Interventions*',
          }}
          icons={{
            default: <FontAwesomeIcon className="mr-2" icon={faDownload} />,
            pending: <FontAwesomeIcon className="fa-spin mr-2" icon={faSpinner} />,
          }}
          disabledStates={['pending']}
        />
      </div>
    );
  }
}

BulkManagementControls.defaultProps = {
  courseId: '',
  showBulkManagement: false,
  showSpinner: false,
};

BulkManagementControls.propTypes = {
  courseId: PropTypes.string,

  // redux
  downloadBulkGradesReport: PropTypes.func.isRequired,
  downloadInterventionReport: PropTypes.func.isRequired,
  gradeExportUrl: PropTypes.string.isRequired,
  interventionExportUrl: PropTypes.string.isRequired,
  showSpinner: PropTypes.bool,
  showBulkManagement: PropTypes.bool,
};

export const mapStateToProps = (state, ownProps) => ({
  gradeExportUrl: selectors.root.gradeExportUrl(state, { courseId: ownProps.courseId }),
  interventionExportUrl: selectors.root.interventionExportUrl(
    state,
    { courseId: ownProps.courseId },
  ),
  showBulkManagement: selectors.root.showBulkManagement(state, { courseId: ownProps.courseId }),
  showSpinner: selectors.root.shouldShowSpinner(state),
});

export const mapDispatchToProps = {
  downloadBulkGradesReport: actions.grades.downloadReport.bulkGrades,
  downloadInterventionReport: actions.grades.downloadReport.intervention,
};

export default connect(mapStateToProps, mapDispatchToProps)(BulkManagementControls);
