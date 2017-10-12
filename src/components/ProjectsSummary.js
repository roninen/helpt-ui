import React from 'react';
import { BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Bar, ResponsiveContainer } from 'recharts';

class ProjectsSummary extends React.Component {
  render () {
    const data = [
          {name: 'Project Name A', hours: 230},
          {name: 'Project Name B', hours: 540},
          {name: 'Project Name C', hours: 940},
          {name: 'Project Name D', hours: 25},
          {name: 'Project Name E', hours: 3},
          {name: 'Project Name F', hours: 410},
          {name: 'Project Name G', hours: 120}
    ];
    return (
      <div>
        <h5>Hours per Project</h5>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}
                margin={{top: 5, right: 0, left: 0, bottom: 5}}>
           <XAxis dataKey="name"/>
           <YAxis/>
           <CartesianGrid strokeDasharray="3 3"/>
           <Tooltip/>
           <Bar dataKey="hours" fill="#c2a251" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default ProjectsSummary;
