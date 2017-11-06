import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { Table } from 'react-bootstrap';

class ProjectsSummary extends React.Component {
  render () {

    const { report } = this.props;

    // TODO: choose more harmonious color combination from Helsinki palette
    const COLORS = ['#0072c6', '#009246','#bd2719','#ffc61e', '#00d7a7', '#f5a3c7', '#ffe977','#c2a251'];
    const RADIAN = Math.PI / 180;

    // Render custom label with percentage, center the figure in the slice of pie
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
      const x  = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy  + radius * Math.sin(-midAngle * RADIAN);

      return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} 	dominantBaseline="central">
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      );
    };

    // Render color swatch for legend
    const renderSwatch = (data) => {
      const swatchStyle = {
        backgroundColor: data.color
      };

      return (
        <td style={swatchStyle}>&nbsp;&nbsp;</td>
      );
    };

    // Render custom legend as a table
    const renderLegend = (props) => {
      const { payload } = props;
      const rows = payload.map((entry, index) => (
        <tr key={`item-${index}`}>{renderSwatch(entry)}<td>{entry.value}</td><td>({entry.payload.total} h)</td></tr>
      ));

      return (
        <Table condensed hover className="small">
          <tbody>{ rows }</tbody>
        </Table>
      );
    };

    // The project breakdown pie
    return (
      <div>
        <h5>Hours per Project</h5>
    	  <PieChart width={600} height={400}>
          <Pie
            data={report.children}
            cx={150}
            cy={150}
            outerRadius={120}
            dataKey="total"
            nameKey="name"
            labelLine={false}
            label={renderCustomizedLabel}
          >
            {
              report.children.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>)
            }
          </Pie>
          <Tooltip />
          <Legend verticalAlign="top" align="right" layout="vertical" content={renderLegend}/>
        </PieChart>
      </div>
    );
  }
}

export default ProjectsSummary;
