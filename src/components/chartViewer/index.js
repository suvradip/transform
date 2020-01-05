import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';

const ChartViewer = props => {
   const { containerId } = props;
   return (
      <div className="chart-wrapper">
         <div id={containerId} className="chart-container text-center" />
      </div>
   );
};

ChartViewer.propTypes = {
   containerId: PropTypes.string.isRequired,
};

export default ChartViewer;
