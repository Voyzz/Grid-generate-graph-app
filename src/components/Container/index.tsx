import React from 'react';
import Chart from '../Chart';

const Container = React.memo(() => {

  return (
    <div className="girdGraphContiner">
      <Chart />
    </div>
  )
});

export default Container;