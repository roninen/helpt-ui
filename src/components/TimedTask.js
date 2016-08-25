import React from 'react';

import * as timeUtils from '../util/time';

const KEY_ENTER = 13;

function sourceSystemIcon(source) {
  //using this as default and placemarker for github
  if (source == 'Trello') return 'glyphicon glyphicon-signal task-source-icon';
  return 'glyphicon glyphicon-tree-deciduous task-source-icon';
}

function autoFocus(predicate) {
  return function (element) {
    if (predicate()) {
      if (element != null) {
        element.focus();
      }
    }
  };
}

const NumberChangeButton = ({operation, onClick, currentValue}) => {
  if (operation == 'subtract' && currentValue == 0) {
    operation = 'remove';
  }
  let iconClass = 'glyphicon ';
  switch (operation) {
    case 'add': iconClass += 'glyphicon-plus'; break;
    case 'subtract': iconClass += 'glyphicon-minus'; break;
    case 'remove': iconClass += 'glyphicon-trash'; break;
  }
  return (
    <span className="input-group-btn">
        <button className="btn btn-default" type="button" tabIndex="-1" onClick={onClick}>
            <span className={iconClass} />
        </button>
    </span>
  );
};

export default class TimedTask extends React.Component {
  constructor (props) {
    super(props);
    // This component is the master source of an entry hours data
    // for the duration of this component's lifetime. Any
    // change to the data is posted to the server via an action
    // after which it is verified that the new persisted value
    // from the redux store equals the local state.
    this.state = {
      hourString: this.roundAndNormalize(
        timeUtils.minutesToHours(this.props.persistedMinutes))
    };
  }
  // Called before persisting and after incrementing with button
  roundAndNormalize (strVal, options = {step: 0.25}) {
    const { step } = options;
    if (typeof strVal !== 'string') {
      strVal = '' + strVal;
    }
    if (strVal.length == 0 || strVal == '.') {
      return '0';
    }
    strVal = '' + timeUtils.round(parseFloat(strVal), step);
    let [whole, fract] = strVal.split('.');
    if (fract === undefined) {
      return whole;
    }
    fract = fract.replace(/0+$/, '');
    if (fract.length == 0) {
      return whole;
    }
    return `${whole}.${fract}`;
  }
  // Called with every change
  ensureValidHourString (strVal) {
    // Replace unsupported characters
    let val = strVal.replace(/[^0-9.,:]/g, '');
    // Normalize decimal separator
    val = val.replace(/[,:]/, '.');

    // Accept only the leftmost decimal separator
    const spl = val.split(/\./);
    if (spl.length == 1) {
      return spl[0];
    }
    if (spl[0].length == 0) {
      spl[0] = '0';
    }
    const retVal = `${spl[0]}.${spl.slice(1).join('')}`;
    return retVal;
  }
  setHours (newValue) {
    this.setState({desiHours: newValue});
  }
  onChange (event) {
    this.setState({hourString: this.ensureValidHourString(event.target.value)});
  }
  validateAndPersist (event) {
    const { entry } = this.props;
    this.setState({hourString: this.roundAndNormalize(event.target.value)});
    this.props.modifyEntry(entry.id, timeUtils.hoursToMinutes(this.state.hourString));
    
  }
  onKeyUp (event) {
    if (event.keyCode == KEY_ENTER) {
      event.target.blur();
    }
  }
  incrementButtonClickListener (amount) {
    return () => {
      const newHours = timeUtils.round(
        parseFloat(this.state.hourString), 0.5);
      const delta = newHours - parseFloat(this.state.hourString);
      if (Math.sign(delta) == Math.sign(amount)) {
        // Rounding already incremented the number to the desired direction
        this.setState({ hourString: this.roundAndNormalize(newHours) });
        return;
      }
      const hoursFloat = parseFloat(this.state.hourString) + amount;
      this.setState({ hourString: this.roundAndNormalize(new String(hoursFloat), {step: 0.5}) });
    };
  }
  render () {
    const {source, entry, tasks/*, entryIndex, modifyEntry*/} = this.props;
    // Uncoditionally disable autofocus for now.
    // Could be enabled when entryIndex == 0, if desired.
    const autoFocusPredicate = () => {return false;};
    var sourceServiceIcon = sourceSystemIcon(source);
    const currentTask = tasks[`${entry.workspace}:${entry.task}`];
    const taskDescription = currentTask ? currentTask.description : null;
    const INCREMENT_STEP_HOURS = 0.5;
    const currentValue = parseFloat(this.state.hourString);
    return (
      <div className="panel panel-default">
          <div className="panel-body">
              <div className="col-sm-8">
                  <div className="task-source">
                      <a href="#link-to-service" tabIndex="-1">
                          <span className={sourceServiceIcon}></span>
                          <span className="task-source-header">{source}/City-of-Helsinki/servicemap issue#514</span>
                      </a>
                  </div>
                  { taskDescription }
              </div>
              <div className="input-group input-group-lg col-sm-4 hours-entry">
                  <NumberChangeButton
                       operation="subtract"
                       currentValue={currentValue}
                       onClick={this.incrementButtonClickListener(-INCREMENT_STEP_HOURS).bind(this)} />
                  <input type="text"
                         className="form-control"
                         value={this.state.hourString}
                         onChange={this.onChange.bind(this)}
                         onKeyUp={this.onKeyUp.bind(this)}
                         onBlur={this.validateAndPersist.bind(this)}
                         ref={autoFocus(autoFocusPredicate)} />
                  <NumberChangeButton
                       operation="add"
                       currentValue={currentValue}
                       onClick={this.incrementButtonClickListener(INCREMENT_STEP_HOURS).bind(this)} />
              </div>
          </div>
      </div>
    );
  }
  
}
